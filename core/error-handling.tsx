import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Error Handling',
    description: `Errors can occur at any stage of AI generation. Learn how to detect and handle network failures,
                  API errors, configuration issues, and malformed responses.`,
    order: 15
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

export default function ErrorHandlingPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <h2>Understanding Callbacks</h2>

                    <p>
                        The <code>Generate()</code> method uses two mutually exclusive callbacks for handling results.
                        Only one callback will be invoked per generation request.
                    </p>

                    <Callout type="info" title="OnComplete vs OnError">
                        <ul>
                            <li><strong>OnComplete</strong> - Called when generation succeeds. Response data is valid and safe to use.</li>
                            <li><strong>OnError</strong> - Called when generation fails. Use <code>GetErrorMessage()</code> to access error details.</li>
                        </ul>
                        <p className="mt-2">
                            If <code>OnError</code> is called, <code>OnComplete</code> will not be called, and vice versa.
                        </p>
                    </Callout>

                    <Example>
                        <ExampleTitle>Basic Error Handling</ExampleTitle>
                        <ExampleContent>
                            Always provide both callbacks. OnComplete for successful generations, OnError for failures.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Generate(
    // OnComplete - called only on success
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        FString Response = Ctx->GetAggregatedResponseText();
        UE_LOG(LogTemp, Log, TEXT("AI: %s"), *Response);
    }),
    // OnError - called only on failure
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx)
    {
        FString Error = Ctx->GetErrorMessage();
        UE_LOG(LogTemp, Error, TEXT("Generation failed: %s"), *Error);
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Common Error Sources</h2>

                    <p>Errors can originate from multiple sources during generation:</p>

                    <ul>
                        <li><strong>Network failures</strong> - Connection timeouts, DNS resolution failures</li>
                        <li><strong>API errors</strong> - Rate limits, authentication failures, service unavailable</li>
                        <li><strong>Configuration issues</strong> - Invalid model parameters, unsupported features</li>
                        <li><strong>Provider errors</strong> - Model not found, quota exceeded</li>
                        <li><strong>Malformed responses</strong> - Invalid JSON, unexpected response structure</li>
                    </ul>

                    <h2>Monitoring Logs</h2>

                    <Callout type="warning" title="Watch the Output Log">
                        <p>
                            Monitor the Unreal Engine Output Log for error messages during development. Common issues
                            include API authentication failures and configuration mismatches.
                        </p>
                        <p className="mt-2">
                            <strong>Example:</strong> Using unsupported features for a model (like configuring reasoning output
                            for models that don't support it) will generate API errors that appear in the logs.
                        </p>
                    </Callout>

                    <Example>
                        <ExampleTitle>Model Configuration Mismatch</ExampleTitle>
                        <ExampleContent>
                            Some models don't support certain features. For example, GPT-4o Mini doesn't support
                            reasoning configuration. Using unsupported features will result in API errors.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// This will fail with GPT-4o Mini
auto* Session = UGAiResponsesApiSession::CreateChatSession(
    GPT4oMiniConfig,
    this,
    TEXT("You are helpful."),
    TEXT("")
);

// Reasoning output not supported by this model
Session->Request.ReasoningOutput = EReasoningOutputConfig::Enabled;

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx)
    {
        // Error: Model does not support reasoning configuration
        UE_LOG(LogTemp, Error, TEXT("Error: %s"), *Ctx->GetErrorMessage());
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Debugging with API Traffic Recording</h2>

                    <p>
                        When debugging errors, view the exact requests and responses exchanged with the API provider.
                        This helps identify configuration issues, malformed requests, and unexpected API behavior.
                    </p>

                    <Callout type="info" title="Enable Traffic Recording">
                        <p>
                            Navigate to <strong>Edit → Project Settings → Plugins → Generative AI</strong> and enable
                            <code>Record Api Traffic</code>. All requests and responses are saved to <code>YourProject/Saved/GAiTraffic</code>.
                        </p>
                    </Callout>

                    <p>Traffic recording captures:</p>

                    <ul>
                        <li>Complete request JSON sent to the API</li>
                        <li>Full response JSON including error details</li>
                        <li>HTTP headers and status codes</li>
                        <li>Timestamps for debugging timing issues</li>
                    </ul>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><a href={LINK.GENERATIVE_AI.CORE.USING_SESSIONS}>Using Sessions</a> - Learn about session callbacks and lifecycle</li>
                        <li><a href={LINK.GENERATIVE_AI.CORE.ENDPOINT_CONFIGURATION}>Endpoint Configuration</a> - Configure API providers correctly</li>
                        <li><a href={LINK.GENERATIVE_AI.CORE.GENERATION_CALLBACKS}>Generation Callbacks</a> - All available callback types</li>
                        <li><a href={LINK.GENERATIVE_AI.FEATURES.TOOLS}>Tools</a> - Handle errors in tool execution</li>
                    </ul>

                </LanguageToggleProvider>

                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
