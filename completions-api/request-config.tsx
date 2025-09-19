import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Request Configuration',
    description: 'Fine-tuning AI generation through parameter control',
    order: 3,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer } from '@/components/layout';
import {
    LanguageToggleProvider,
    LanguageToggle,
    LanguageContent,
    Callout,
    CodeExample,
    CodeBlock,
    ConsoleOutput,
    EnumReference,
} from '@/components/doc-components';

export default function RequestConfigPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="font-bold m-0!">Request Configuration</h1>
                        <LanguageToggle />
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        The session's Request property lets you control how the model generates text by adjusting parameters such as
                        randomness, output length, or stopping behavior.
                    </p>

                    <h2>Parameter Reference</h2>
                    <p>
                        All parameters exposed on <code>FCompletionApiRequest </code> are <strong> identically named and behave the same </strong>
                        as in the official <a
                            href="https://platform.openai.com/docs/api-reference/chat/create"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            OpenAI Chat Completions API
                        </a>. You can consult the OpenAI documentation for authoritative explanations and expected ranges of values.
                    </p>

                    <Callout type="info" title="Session Persistence">
                        <p>
                            Request parameters are tied to the session’s request object and are <strong>persisted across calls</strong>.
                            This means you can configure parameters once and reuse them for subsequent generations, unless you explicitly
                            reset or change them.
                        </p>
                    </Callout>


                    <CodeExample
                        title="Parameter Configuration Example"
                        description="Configuring generation parameters for specific content requirements"
                        cppCode={`UGAiCompletionApiSession* UGAiCompletions_RequestConfigExample::Run(UGAiEndpointConfig* EndpointConfig, UObject* WorldContextObject)
{
    if (!ensureMsgf(EndpointConfig != nullptr, TEXT("EndpointConfig is required")))
    {
        return nullptr;
    }

    UGAiCompletionApiSession* Session = UGAiCompletionApiSession::CreateChatGenerationContext(
        EndpointConfig,
        WorldContextObject ? WorldContextObject : GetTransientPackage(),
        TEXT("You write short NPC barks for AI-controlled characters in combat or ambient states."),
        TEXT("Produce a mid-combat taunt for an orc warrior NPC. Keep it under 10 words.")
    );

    // Tune request using Completion API's request fields
    Session->Request.Temperature = 0.6;
    Session->Request.TopP = 0.95;
    Session->Request.MaxCompletionTokens = 64;

    Session->Generate(
        FOnGenerationComplete::CreateLambda([](const UGAiCompletionApiSession* Ctx)
        {
            UE_LOG(LogTemp, Log, TEXT("Completion RequestConfig: %s"), *Ctx->GetResponseText());
        }),
        FOnGenerationStreamChunk(),
        FOnGenerationError::CreateLambda([](const UGAiCompletionApiSession* Ctx)
        {
            UE_LOG(LogTemp, Error, TEXT("Completion RequestConfig error: %s"), *Ctx->GetErrorMessage());
        })
    );

    return Session;
}`}

                    />


                    <h3>Example Output</h3>

                    <ConsoleOutput title="Configured Generation Result">
                        {`LogTemp: Log: Completion RequestConfig: Your steel is weak, human!`}
                    </ConsoleOutput>
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}