import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Request Configuration',
    description: 'Fine-tuning AI generation through parameter control (Responses API)',
    order: 3,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer } from '@/components/layout';
import {
    LanguageToggleProvider,
    LanguageToggle,
    CodeExample,
    ConsoleOutput,
} from '@/components/doc-components';
import { SiteConfig } from '@/types/sites';

export default function ResponsesRequestConfigPage({ siteConfig }: { siteConfig: SiteConfig }) {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="font-bold m-0!">Request Configuration</h1>
                        <LanguageToggle />
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        The session's request settings let you control how the model generates text by adjusting parameters such as
                        randomness, output length, and stopping behavior. These settings persist on the session and are reused for
                        subsequent generations unless you change them.
                    </p>

                    <h2>Parameter Reference</h2>
                    <p>
                        All parameters exposed on <code>FResponsesApiRequest</code> are <strong>identically named and behave the same </strong>
                        as in the official <a
                            href="https://platform.openai.com/docs/api-reference/responses/create"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            OpenAI Responses API
                        </a>. You can consult the OpenAI documentation for authoritative explanations and expected ranges of values.
                    </p>

                    <CodeExample
                        title="Parameter Configuration Example"
                        description="Configuring generation parameters for specific content requirements (Responses API)"
                        cppCode={`UGAiResponsesApiSession* UGAiResponses_RequestConfigExample::Run(UGAiEndpointConfig* EndpointConfig, UObject* WorldContextObject)
{
    if (!ensureMsgf(EndpointConfig != nullptr, TEXT("EndpointConfig is required")))
    {
        return nullptr;
    }

    // Use a chat session as a base and then tweak Request parameters
    UGAiResponsesApiSession* Session = UGAiResponsesApiSession::CreateChatSession(
        EndpointConfig,
        WorldContextObject ? WorldContextObject : GetTransientPackage(),
        TEXT("You write short NPC barks for AI-controlled characters in combat or ambient states."),
        TEXT("Produce a mid-combat taunt for an orc warrior NPC. Keep it under 10 words.")
    );

    if (!Session)
    {
        UE_LOG(LogTemp, Error, TEXT("Failed to create session"));
        return nullptr;
    }

    // Configure popular generation knobs exposed by the session helpers and request
    Session->Request.Temperature = 0.6;
    Session->Request.TopP = 0.95;
    Session->Request.MaxCompletionTokens = 64;

    Session->Generate(
        FOnResponsesGenerationComplete::CreateLambda([](const UGAiResponsesApiSession* Ctx)
        {
            UE_LOG(LogTemp, Log, TEXT("RequestConfigExample final: %s"), *Ctx->GetResponseText());
        }),
        FOnResponsesStreamChunk(),
        FOnResponsesError::CreateLambda([](const UGAiResponsesApiSession* Ctx)
        {
            UE_LOG(LogTemp, Error, TEXT("RequestConfigExample error: %s"), *Ctx->GetErrorMessage());
        })
    );

    return Session;
}`}
                    />

                    <h3>Example Output</h3>

                    <ConsoleOutput title="Configured Generation Result">
                        {`LogTemp: Log: RequestConfigExample final: Your steel is weak, human!`}
                    </ConsoleOutput>
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}


