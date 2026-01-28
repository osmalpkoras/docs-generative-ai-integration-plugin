import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Generation Callbacks',
    description: ``,
    order: 10
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import {
    Callout,
    LanguageToggleProvider,
    LanguageToggle,
    Example,
    ExampleTitle,
    ExampleContent,
    ExampleCpp,
    ExampleBlueprint,
    ApiFunction,
    ApiProperty,
} from '@/components/doc-components';

export default function SessionBasicsPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />
                    <p>
                        The <code>Generate()</code> method accepts multiple callbacks for different events during generation.
                        All callbacks are optional except <code>OnComplete</code>.
                    </p>

                    <Example>
                        <ExampleTitle>OnComplete Callback</ExampleTitle>
                        <ExampleContent>
                            Called when generation completes successfully, that is, without any error being thrown. Use this to retrieve and process the AI's response.  Note that <code>OnComplete</code> is not called
                            on error.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        if (Ctx->HasError())
        {
            // Handle error case
            return;
        }

        // Get generated text
        FString Response = Ctx->GetAggregatedResponseText();

        // Access token usage
        int32 TokensUsed = Ctx->GetTotalTokensUsed();

        // Check for structured output
        if (Ctx->ExpectsStructuredOutput())
        {
            UObject* ParsedObject = Ctx->StructuredOutput;
        }
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>OnError Callback (Optional)</ExampleTitle>
                        <ExampleContent>
                            Called when an error occurs during generation. Note that <code>OnComplete</code> is not called
                            when an error has been detected.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx)
    {
        FString ErrorMsg = Ctx->GetErrorMessage();
        UE_LOG(LogTemp, Error, TEXT("Generation failed: %s"), *ErrorMsg);
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>OnStreamChunk Callback (Optional)</ExampleTitle>
                        <ExampleContent>
                            Called for each chunk of streamed text. Streaming will be enabled if and only if this callback is provided.
                            See the <a href="/generative-ai/features/streaming">Streaming</a> page for details.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationStreamChunk::CreateLambda([](const UGAiSession* Ctx)
    {
        FString Chunk = Ctx->GetCurrentStreamChunkText();
        // Display chunk in real-time UI
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>OnToolCall Callback (Optional)</ExampleTitle>
                        <ExampleContent>
                            Called when the AI requests to execute a tool. This callback provides a way to handle tool calls manually,
                            allowing you to intercept and customize execution. Return a <code>FToolExecutionResult</code> to indicate
                            the outcome. You can return success or error results to prevent automatic execution, return an unhandled result
                            to let the plugin execute the tool automatically, or flag the tool call for termination to stop the execution flow.
                            See the <a href="/generative-ai/features/tools">Tools</a> page for details.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationStreamChunk(),
    FOnGenerationToolCall::CreateLambda([](const UGAiSession* Ctx, const FUnifiedToolCall& ToolCall)
    {
        // Custom tool execution
        FString Result = ExecuteMyTool(ToolCall.Name, ToolCall.Arguments);

        FToolExecutionResult ExecResult;
        ExecResult.Result = Result;
        return ExecResult;
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>OnChoiceSelection Callback (Optional)</ExampleTitle>
                        <ExampleContent>
                            Called when the API returns multiple response choices (when <code>Request.N &gt; 1</code>).
                            Return the index of the choice you want to use. If not provided, the first choice is used automatically.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Request.N = 3; // Generate 3 variations

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationStreamChunk(),
    FOnGenerationToolCall(),
    FOnGenerationChoiceSelection::CreateLambda([](const UGAiSession* Ctx)
    {
        // Let user pick which variation to use
        return ShowChoicePicker(Ctx);
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><a href="/generative-ai/sessions-api-reference">Sessions API Reference</a> - Learn more about the full API of the session class.</li>
                        <li><a href="/generative-ai/api/responses-api">Responses API</a> - Modern API with hosted tools and MCP integration</li>
                        <li><a href="/generative-ai/api/completions-api">Completions API</a> - OpenAI-compatible API for broad provider support</li>
                        <li><a href="/generative-ai/features/tools">Tools</a> - Enable AI to execute custom functions</li>
                        <li><a href="/generative-ai/features/streaming">Streaming</a> - Real-time response generation</li>
                        <li><a href="/generative-ai/features/structured-output">Structured Output</a> - Type-safe JSON responses</li>
                    </ul>

                </LanguageToggleProvider>

                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
