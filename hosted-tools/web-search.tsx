import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Web Search',
    description: 'Search the internet for real-time information beyond training data',
    order: 1,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import {
    Callout,
    LanguageToggleProvider,
    Example,
    ExampleTitle,
    ExampleContent,
    ExampleCpp,
} from '@/components/doc-components';
import { LINK } from '@/lib/pages.generated';

export default function WebSearchPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <p>
                        Web Search enables AI to query the internet for current information beyond its training cutoff.
                        The AI automatically decides when to search based on conversation context.
                    </p>

                    <h2>Basic Usage</h2>

                    <Example>
                        <ExampleTitle>Enable Web Search</ExampleTitle>
                        <ExampleContent>
                            Add the web search tool to your session. The plugin automatically handles search execution and result integration.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "GenerativeAi/Sessions/GAiResponsesApiSession.h"

auto* Session = UGAiResponsesApiSession::CreateChatSession(
    EndpointConfig, this,
    TEXT("Use web search to find recent info. Cite sources with URLs."),
    TEXT("What are the latest Unreal Engine 5 features?")
);

// Add web search tool
FResponsesApiWebSearchTool WebSearchTool;
Session->Request.Tools.Add(MakeInstancedStruct(WebSearchTool));

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        UE_LOG(LogTemp, Log, TEXT("AI: %s"), *Ctx->GetAggregatedResponseText());
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Automatic Execution">
                        <p>
                            The AI automatically determines when web search is needed. The plugin handles the complete
                            tool execution loop without manual intervention.
                        </p>
                    </Callout>

                    <h2>Configuration</h2>

                    <Example>
                        <ExampleTitle>Domain Filtering</ExampleTitle>
                        <ExampleContent>
                            Restrict searches to specific domains. Subdomains are automatically included.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiWebSearchTool WebSearchTool;

FResponsesApiWebSearchFilters Filters;
Filters.AllowedDomains.Add(TEXT("docs.unrealengine.com"));
Filters.AllowedDomains.Add(TEXT("unrealengine.com"));
WebSearchTool.Filters = Filters;

Session->Request.Tools.Add(MakeInstancedStruct(WebSearchTool));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Context Size</ExampleTitle>
                        <ExampleContent>
                            Control how much detail the AI sees from each search result.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiWebSearchTool WebSearchTool;

// Low: Faster, snippets only
// Medium: Balanced (default)
// High: More comprehensive, slower
WebSearchTool.SearchContextSize = EResponsesApiWebSearchContextSize::Medium;

Session->Request.Tools.Add(MakeInstancedStruct(WebSearchTool));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>User Location</ExampleTitle>
                        <ExampleContent>
                            Provide location context for region-specific search results.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiWebSearchTool WebSearchTool;

FResponsesApiUserLocation UserLocation;
UserLocation.Type = TEXT("approximate");
UserLocation.City = TEXT("San Francisco");
UserLocation.Region = TEXT("California");
UserLocation.Country = TEXT("US");
UserLocation.Timezone = TEXT("America/Los_Angeles");
WebSearchTool.UserLocation = UserLocation;

Session->Request.Tools.Add(MakeInstancedStruct(WebSearchTool));`}
                        </ExampleCpp>
                    </Example>

                    <h2>Accessing Results</h2>

                    <Example>
                        <ExampleTitle>Retrieve Search URLs</ExampleTitle>
                        <ExampleContent>
                            Access the URLs and snippets the AI searched to verify sources.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Request.Include.Add(EResponsesApiIncludableOutputData::WebSearchCallActions);

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        auto* ResponsesSession = Cast<UGAiResponsesApiSession>(Ctx);
        if (!ResponsesSession) return;

        for (const auto& Item : ResponsesSession->Response.OutputItems)
        {
            if (Item.GetType() == EResponsesApiResponseItemType::WebSearchCall)
            {
                auto* WebSearchCall = Item.TryGet<FResponsesApiWebSearchToolCall>();
                if (WebSearchCall)
                {
                    for (const auto& Action : WebSearchCall->Actions)
                    {
                        FString Url = Action.Url.Get(TEXT(""));
                        FString Snippet = Action.Snippet.Get(TEXT(""));
                        
                        UE_LOG(LogTemp, Log, TEXT("URL: %s"), *Url);
                        UE_LOG(LogTemp, Log, TEXT("Snippet: %s"), *Snippet);
                    }
                }
            }
        }
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Best Practices</h2>

                    <ul>
                        <li><strong>Request citations</strong> - System prompt: "Cite sources with URLs"</li>
                        <li><strong>Specify recency</strong> - "Focus on information from the last 6 months"</li>
                        <li><strong>Be specific</strong> - "UE5 Lumen performance tips" vs "Unreal Engine lighting"</li>
                        <li><strong>Filter domains</strong> - Reduce noise and improve accuracy</li>
                    </ul>

                    <h2>Common Patterns</h2>

                    <Example>
                        <ExampleTitle>Documentation Lookup</ExampleTitle>
                        <ExampleContent>
                            Restrict search to official documentation sites.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiWebSearchFilters Filters;
Filters.AllowedDomains.Add(TEXT("docs.unrealengine.com"));
Filters.AllowedDomains.Add(TEXT("dev.epicgames.com"));
WebSearchTool.Filters = Filters;

Session->SetSystemMessage(TEXT(
    "Search official Unreal Engine documentation. "
    "Provide code examples if available."
));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Current Events</ExampleTitle>
                        <ExampleContent>
                            Search for time-sensitive information with date awareness.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->SetSystemMessage(TEXT(
    "Search for information from the past month. "
    "Focus on recent announcements. Include dates."
));

FResponsesApiWebSearchTool WebSearchTool;
WebSearchTool.SearchContextSize = EResponsesApiWebSearchContextSize::Medium;
Session->Request.Tools.Add(MakeInstancedStruct(WebSearchTool));`}
                        </ExampleCpp>
                    </Example>


                    <PageFooter />
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}