import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Text Generation',
    description: 'Single-prompt text generation using the Completion API',
    order: 1,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer } from '@/components/layout';
import {
    LanguageToggleProvider,
    LanguageToggle,
    LanguageContent,
    Callout,
    CodeExample,
    ConsoleOutput,
} from '@/components/doc-components';

export default function TextCompletionPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="font-bold m-0!">Text Completion</h1>
                        <LanguageToggle />
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        Text completion is a single-prompt generation mode where the AI continues the text provided by the user.
                        Unlike chat completion, text completion does not use structured message roles or conversation context.
                    </p>

                    <h2>Session Creation</h2>

                    <p>
                        Text completion sessions are created using the <code>CreateTextGenerationContext</code> factory method. This initializes a <code>UGAiCompletionApiSession</code> configured for single-prompt workflows.
                    </p>

                    <CodeExample
                        title="CreateTextGenerationContext Signature"
                        description="Factory method for creating text completion sessions"
                        cppCode={`static UGAiCompletionApiSession* CreateTextGenerationContext(
    UGAiEndpointConfig* InEndpointConfig,
    UObject* Outer = nullptr,
    const FString& Prompt = TEXT("")
);`}

                    />

                    <h3>Parameters</h3>
                    <ul>
                        <li><strong>InEndpointConfig</strong> – API endpoint configuration (model, key, settings).</li>
                        <li><strong>Outer</strong> – UObject for lifetime management (defaults to <code>GetTransientPackage()</code> if not provided).</li>
                        <li><strong>Prompt</strong> – Initial text prompt. Optional; can also be set later.</li>
                    </ul>
                    <Callout type="warning" title="Important">
                        <p>If you don’t provide an <code>Outer</code>, the session may be garbage-collected unexpectedly.
                            Always tie it to a valid UObject when running in a gameplay context.</p>
                    </Callout>

                    <h2>Generation Process</h2>

                    <p>
                        Text completion generates responses by calling the <code>Generate</code> method with appropriate callbacks.
                        The process is asynchronous and supports error handling through lambda functions.
                    </p>

                    <CodeExample
                        title="Text Completion Example"
                        description="Complete example showing session creation, generation, and response handling"
                        cppCode={`UGAiCompletionApiSession* UGAiCompletions_TextCompletionExample::Run(UGAiEndpointConfig* EndpointConfig, UObject* WorldContextObject)
{
    if (!ensureMsgf(EndpointConfig != nullptr, TEXT("EndpointConfig is required")))
    {
        return nullptr;
    }

    UGAiCompletionApiSession* Session = UGAiCompletionApiSession::CreateTextGenerationContext(
        EndpointConfig,
        WorldContextObject ? WorldContextObject : GetTransientPackage(),
        TEXT("Generate 3 concise crafting recipe names for mid-game armor upgrades.")
    );

    Session->Generate(
        FOnGenerationComplete::CreateLambda([](const UGAiCompletionApiSession* Ctx)
        {
            UE_LOG(LogTemp, Log, TEXT("Completion TextExample: %s"), *Ctx->GetResponseText());
        }),
        FOnGenerationStreamChunk(),
        FOnGenerationError::CreateLambda([](const UGAiCompletionApiSession* Ctx)
        {
            UE_LOG(LogTemp, Error, TEXT("Completion TextExample error: %s"), *Ctx->GetErrorMessage());
        })
    );

    return Session;
}`}

                    />

                    <h3>Callback Functions</h3>

                    <p>The <code>Generate</code> method accepts three callback delegates:</p>

                    <ul>
                        <li><strong>FOnGenerationComplete:</strong> Called when generation completes successfully</li>
                        <li><strong>FOnGenerationStreamChunk:</strong> Called for streaming responses (empty for non-streaming)</li>
                        <li><strong>FOnGenerationError:</strong> Called when generation encounters errors</li>
                    </ul>

                    <h2>Response Handling</h2>

                    <p>
                        Completed text generation provides access to the generated content through <code>GetResponseText()</code>.
                        Error states can be checked using <code>HasError()</code> and detailed error messages retrieved via <code>GetErrorMessage()</code>.
                    </p>

                    <h3>Example Output</h3>

                    <ConsoleOutput title="Successful Generation Log">
                        {`LogTemp: Completion TextExample: 1. Reinforced Chainmail Enhancement
2. Tempered Steel Plating 
3. Guardian's Resilience Upgrade`}
                    </ConsoleOutput>

                    <ConsoleOutput title="Error Handling Log">
                        {`LogTemp: Error: Completion TextExample error: Request timeout after 30 seconds`}
                    </ConsoleOutput>

                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}