import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'File Search',
    description: 'Search uploaded documents with AI-powered semantic search',
    order: 2,
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

export default function FileSearchPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <p>
                        File Search enables retrieval-augmented generation (RAG) by letting AI search through uploaded
                        documents. Upload files to a vector store, then let the AI search them to ground responses in your content.
                    </p>

                    <Callout type="warning" title="Vector Store Required">
                        <p>
                            You must create a vector store through your provider's API or dashboard before using this tool.
                            Upload files and copy the vector store ID (e.g., <code>vs_abc123</code>).
                        </p>
                    </Callout>

                    <h2>Basic Usage</h2>

                    <Example>
                        <ExampleTitle>Enable File Search</ExampleTitle>
                        <ExampleContent>
                            Add the file search tool with your vector store ID. The AI automatically searches when needed.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "GenerativeAi/Sessions/GAiResponsesApiSession.h"

auto* Session = UGAiResponsesApiSession::CreateChatSession(
    EndpointConfig, this,
    TEXT("Use file search to ground answers in our design docs. Cite sources."),
    TEXT("What are the stealth gameplay rules?")
);

// Add file search tool
FResponsesApiFileSearchTool FileSearchTool;
FileSearchTool.VectorStoreIds.Add(TEXT("vs_abc123"));
Session->Request.Tools.Add(MakeInstancedStruct(FileSearchTool));

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        UE_LOG(LogTemp, Log, TEXT("AI: %s"), *Ctx->GetAggregatedResponseText());
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Configuration</h2>

                    <Example>
                        <ExampleTitle>Multiple Vector Stores</ExampleTitle>
                        <ExampleContent>
                            Query across multiple document collections simultaneously.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiFileSearchTool FileSearchTool;
FileSearchTool.VectorStoreIds.Add(TEXT("vs_gameplay_docs"));
FileSearchTool.VectorStoreIds.Add(TEXT("vs_lore_docs"));
FileSearchTool.VectorStoreIds.Add(TEXT("vs_tech_specs"));
Session->Request.Tools.Add(MakeInstancedStruct(FileSearchTool));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Result Limits and Ranking</ExampleTitle>
                        <ExampleContent>
                            Control result count and relevance threshold.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiFileSearchTool FileSearchTool;
FileSearchTool.VectorStoreIds.Add(TEXT("vs_abc123"));
FileSearchTool.MaxNumResults = 5; // Default: 10

// Configure ranking
FResponsesApiFileSearchRankingOptions RankingOptions;
RankingOptions.Ranker = TEXT("auto");
RankingOptions.ScoreThreshold = 0.6f; // Min relevance (0.0-1.0)
FileSearchTool.RankingOptions = RankingOptions;

Session->Request.Tools.Add(MakeInstancedStruct(FileSearchTool));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Metadata Filtering</ExampleTitle>
                        <ExampleContent>
                            Search only files matching specific metadata criteria.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiFileSearchTool FileSearchTool;
FileSearchTool.VectorStoreIds.Add(TEXT("vs_abc123"));

// Filter by metadata
FResponsesApiFileSearchFilter Filter;
Filter.Operator = EResponsesApiFileSearchFilterOperator::And;
Filter.Key = TEXT("category");
Filter.ValueString = TEXT("gameplay");
FileSearchTool.Filters = Filter;

Session->Request.Tools.Add(MakeInstancedStruct(FileSearchTool));`}
                        </ExampleCpp>
                    </Example>

                    <h2>Accessing Results</h2>

                    <Example>
                        <ExampleTitle>Retrieve Citations</ExampleTitle>
                        <ExampleContent>
                            Access files and text snippets used by the AI for transparency.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Request.Include.Add(EResponsesApiIncludableOutputData::FileSearchCallResults);

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        auto* ResponsesSession = Cast<UGAiResponsesApiSession>(Ctx);
        if (!ResponsesSession) return;

        for (const auto& Item : ResponsesSession->Response.OutputItems)
        {
            if (Item.GetType() == EResponsesApiResponseItemType::FileSearchCall)
            {
                auto* FileSearchCall = Item.TryGet<FResponsesApiFileSearchToolCall>();
                if (FileSearchCall)
                {
                    for (const auto& Result : FileSearchCall->Results)
                    {
                        FString Filename = Result.Filename.Get(TEXT(""));
                        float Score = Result.Score.Get(0.0f);
                        FString Text = Result.Text.Get(TEXT(""));
                        
                        UE_LOG(LogTemp, Log, TEXT("[%s] Score: %.2f"), *Filename, Score);
                        UE_LOG(LogTemp, Log, TEXT("Snippet: %s"), *Text);
                    }
                }
            }
        }
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Troubleshooting</h2>

                    <Callout type="info" title="No Results Found">
                        <ul>
                            <li>Verify vector store ID is correct</li>
                            <li>Check files are actually in the vector store</li>
                            <li>Lower <code>ScoreThreshold</code> to see more results</li>
                            <li>Rephrase query to match document terminology</li>
                        </ul>
                    </Callout>

                    <PageFooter />
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}