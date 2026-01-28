import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Streaming',
    description: 'Real-time response generation with token-by-token delivery for responsive user experiences',
    order: 201
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import {
    Callout,
    LanguageToggleProvider,
    Example,
    ExampleTitle,
    ExampleContent,
    ExampleCpp,
    EnumReference,
} from '@/components/doc-components';
import { LINK } from '@/lib/pages.generated';

export default function StreamingPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <p>
                        Streaming delivers AI responses incrementally as they're generated, enabling real-time UI updates
                        and better user experience. Both the Responses API and Completions API support streaming with the
                        same interface.
                    </p>

                    <h2>Enabling Streaming</h2>

                    <p>
                        Streaming is enabled automatically when you provide the <code>OnStreamChunk</code> callback to
                        the <code>Generate()</code> method. No additional configuration is required for basic streaming.
                    </p>

                    <Example>
                        <ExampleTitle>Basic Streaming</ExampleTitle>
                        <ExampleContent>
                            Provide the <code>OnStreamChunk</code> callback to receive text as it's generated.
                            The session automatically enables streaming when this callback is present.
                        </ExampleContent>
                        <ExampleCpp>
                            {`auto* Session = UGAiResponsesApiSession::CreateChatSession(
    EndpointConfig,
    this,
    TEXT("You are a helpful assistant."),
    TEXT("Tell me a story about dragons.")
);

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        // Called when streaming is complete
        // Response contains the full aggregated text
        UE_LOG(LogTemp, Log, TEXT("Complete: %s"),
            *Ctx->GetAggregatedResponseText());
    }),
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx)
    {
        UE_LOG(LogTemp, Error, TEXT("Error: %s"),
            *Ctx->GetErrorMessage());
    }),
    FOnGenerationStreamChunk::CreateLambda([](const UGAiSession* Ctx)
    {
        // Receive chunks in real-time
        FString Chunk = Ctx->GetCurrentStreamChunkText();
        UE_LOG(LogTemp, Verbose, TEXT("Chunk: %s"), *Chunk);
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="OnComplete Callback">
                        <p>
                            The <code>OnComplete</code> callback is always called when streaming finishes, and the response
                            will contain the full aggregated response. This allows you to work with complete objects after
                            streaming is done without manually constructing them.
                        </p>
                    </Callout>

                    <h2>Handling Stream Chunks</h2>

                    <Example>
                        <ExampleTitle>Real-Time UI Updates</ExampleTitle>
                        <ExampleContent>
                            Use <code>GetCurrentStreamChunkText()</code> to access each chunk as it arrives. Accumulate
                            chunks manually to build the complete response for display.
                        </ExampleContent>
                        <ExampleCpp>
                            {`class UStreamingChatWidget : public UUserWidget
{
    UPROPERTY(meta = (BindWidget))
    UTextBlock* ChatTextBlock;

    FString AccumulatedText;

public:
    void StartGeneration(UGAiResponsesApiSession* Session)
    {
        AccumulatedText.Empty();

        Session->AddUserMessage(TEXT("Write a poem about Unreal Engine."));

        Session->Generate(
            FOnGenerationComplete::CreateLambda([this](const UGAiSession* Ctx)
            {
                UE_LOG(LogTemp, Log, TEXT("Stream complete"));
            }),
            FOnGenerationError::CreateLambda([this](const UGAiSession* Ctx)
            {
                ChatTextBlock->SetText(FText::FromString(TEXT("Error occurred")));
            }),
            FOnGenerationStreamChunk::CreateLambda([this](const UGAiSession* Ctx)
            {
                // Append new chunk
                AccumulatedText += Ctx->GetCurrentStreamChunkText();

                // Update UI in real-time
                ChatTextBlock->SetText(FText::FromString(AccumulatedText));
            })
        );
    }
};`}
                        </ExampleCpp>
                    </Example>

                    <h2>Granular Streaming Control (Responses API)</h2>

                    <p>
                        The Responses API provides granular control over which streaming events you receive through
                        the <code>StreamOptions</code> property. This allows you to filter streaming chunks to only
                        the content types you need.
                    </p>

                    <Example>
                        <ExampleTitle>Configuring Stream Options</ExampleTitle>
                        <ExampleContent>
                            Use <code>SetStreamOptions()</code> to specify which delta types to receive. Combine multiple
                            options using bitwise OR. This is useful when you only want specific types of streaming updates,
                            such as text output but not tool calls.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Stream only output text and refusals
Session->SetStreamOptions(
    EResponsesApiStreamOption::OutputText |
    EResponsesApiStreamOption::RefusalText
);

// Or stream reasoning content
Session->SetStreamOptions(
    EResponsesApiStreamOption::ReasoningText |
    EResponsesApiStreamOption::ReasoningSummary
);

// Stream everything (text, tools, reasoning, etc.)
Session->SetStreamOptions(
    EResponsesApiStreamOption::OutputText |
    EResponsesApiStreamOption::FunctionCalls |
    EResponsesApiStreamOption::ReasoningText |
    EResponsesApiStreamOption::CodeInterpreterCode
);`}
                        </ExampleCpp>
                    </Example>

                    <h3>Available Stream Options</h3>

                    <EnumReference
                        enumName="EResponsesApiStreamOption"
                        description="Bitflag options for controlling which streaming events are received. Combine multiple options using bitwise OR."
                        values={[
                            {
                                name: "None",
                                description: "Only receive complete objects when fully streamed"
                            },
                            {
                                name: "OutputText",
                                description: "Stream assistant output text deltas"
                            },
                            {
                                name: "OutputTextLifecycle",
                                description: "Stream output text lifecycle events"
                            },
                            {
                                name: "RefusalText",
                                description: "Stream refusal text deltas"
                            },
                            {
                                name: "ReasoningText",
                                description: "Stream reasoning text deltas"
                            },
                            {
                                name: "ReasoningSummary",
                                description: "Stream reasoning summary deltas"
                            },
                            {
                                name: "FunctionCalls",
                                description: "Stream function call arguments as they build"
                            },
                            {
                                name: "McpCalls",
                                description: "Stream MCP tool calls"
                            },
                            {
                                name: "CustomToolCalls",
                                description: "Stream custom tool calls"
                            },
                            {
                                name: "FileSearch",
                                description: "Stream file search results"
                            },
                            {
                                name: "WebSearch",
                                description: "Stream web search results"
                            },
                            {
                                name: "CodeInterpreterLifecycle",
                                description: "Stream code interpreter lifecycle events"
                            },
                            {
                                name: "CodeInterpreterCode",
                                description: "Stream code interpreter code deltas"
                            },
                            {
                                name: "ImageGenLifecycle",
                                description: "Stream image generation lifecycle events"
                            },
                            {
                                name: "ImageGenPartial",
                                description: "Stream partial image generation results"
                            },
                            {
                                name: "McpListTools",
                                description: "Stream MCP list tools responses"
                            }
                        ]}
                    />

                    <Example>
                        <ExampleTitle>Accessing Granular Delta Information</ExampleTitle>
                        <ExampleContent>
                            For Responses API sessions, cast to <code>UGAiResponsesApiSession</code> to access the
                            detailed <code>CurrentStreamChunk</code> delta for granular control over streaming events.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->SetStreamOptions(
    EResponsesApiStreamOption::OutputText |
    EResponsesApiStreamOption::ReasoningText
);

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationStreamChunk::CreateLambda([](const UGAiSession* Ctx)
    {
        // Access granular delta information
        const auto* ResponsesSession = Cast<UGAiResponsesApiSession>(Ctx);
        if (ResponsesSession)
        {
            const FResponsesApiSseEvent& Delta = ResponsesSession->CurrentStreamChunk;

            // React to specific delta types
            if (!Delta.Output.Text.IsEmpty())
            {
                // Handle output text delta
                UpdateOutputUI(Delta.Output.Text);
            }

            if (!Delta.Reasoning.Text.IsEmpty())
            {
                // Handle reasoning delta separately
                UpdateReasoningUI(Delta.Reasoning.Text);
            }
        }
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Default Streaming Behavior">
                        <p>
                            If you don't set stream options, the Responses API defaults to streaming output text, refusal text, and reasoning text deltas.
                            The Completions API always streams text deltas without granular control.
                        </p>
                    </Callout>

                    <h2>Streaming with Tools</h2>

                    <p>
                        Tools work seamlessly with streaming. The behavior differs between APIs:
                    </p>

                    <ul>
                        <li><strong>Responses API</strong>: Tool call deltas can be streamed if enabled via <code>StreamOptions</code>. Tool executions happen automatically, and the stream continues with results incorporated.</li>
                        <li><strong>Completions API</strong>: Tool calls are not streamed to the user, but they are appended to the response object after completion.</li>
                    </ul>

                    <Example>
                        <ExampleTitle>Streaming with Automatic Tool Execution</ExampleTitle>
                        <ExampleContent>
                            When the AI requests a tool during streaming, text chunks arrive via <code>OnStreamChunk</code>
                            while tool executions happen automatically in the background. The final response in
                            <code>OnComplete</code> includes all tool results.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->AddToolByClass(UGetWeatherTool::StaticClass());

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        // Final response includes tool results
        UE_LOG(LogTemp, Log, TEXT("Final: %s"),
            *Ctx->GetAggregatedResponseText());
    }),
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationStreamChunk::CreateLambda([](const UGAiSession* Ctx)
    {
        // Text chunks arrive here
        FString Chunk = Ctx->GetCurrentStreamChunkText();
        UpdateUI(Chunk);

        // Tool executions happen automatically in background
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Performance Considerations</h2>

                    <Example>
                        <ExampleTitle>Batching UI Updates</ExampleTitle>
                        <ExampleContent>
                            If chunks arrive very rapidly, consider batching UI updates to reduce rendering overhead.
                            This improves performance without sacrificing the streaming experience.
                        </ExampleContent>
                        <ExampleCpp>
                            {`class UBatchedStreamWidget : public UUserWidget
{
    FString ChunkBuffer;
    FTimerHandle UpdateTimer;

public:
    void OnStreamChunk(const FString& Chunk)
    {
        // Buffer chunks
        ChunkBuffer += Chunk;

        // Update UI periodically instead of per-chunk
        if (!UpdateTimer.IsValid())
        {
            GetWorld()->GetTimerManager().SetTimer(
                UpdateTimer,
                [this]()
                {
                    if (!ChunkBuffer.IsEmpty())
                    {
                        UpdateUI(ChunkBuffer);
                        ChunkBuffer.Empty();
                    }
                },
                0.1f,  // 100ms batching interval
                true
            );
        }
    }

    void OnStreamComplete()
    {
        // Flush remaining buffer
        GetWorld()->GetTimerManager().ClearTimer(UpdateTimer);
        if (!ChunkBuffer.IsEmpty())
        {
            UpdateUI(ChunkBuffer);
        }
    }
};`}
                        </ExampleCpp>
                    </Example>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><a href={LINK.GENERATIVE_AI.FEATURES.TOOLS}>Tools</a> - Enable AI to execute custom functions</li>
                        <li><a href={LINK.GENERATIVE_AI.FEATURES.STRUCTURED_OUTPUT}>Structured Output</a> - Type-safe JSON responses</li>
                        <li><a href={LINK.GENERATIVE_AI.CORE.USING_SESSIONS}>Using Sessions</a> - Learn session management</li>
                        <li><a href={LINK.GENERATIVE_AI.API.RESPONSES_API}>Responses API</a> - Modern API with advanced features</li>
                    </ul>

                </LanguageToggleProvider>

                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
