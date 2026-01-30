import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Completions API',
    description: 'OpenAI-compatible API with broad provider support',
    order: 101,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import {
    Callout,
    LanguageToggleProvider,
    Example,
    ExampleTitle,
    ExampleContent,
    ExampleCpp,
    ApiFunctionGroup,
    ApiFunction,
    ApiPropertyGroup,
    ApiProperty,
    EnumReference,
} from '@/components/doc-components';
import { LINK } from '@/lib/pages.generated';

export default function CompletionsApiPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <h2>When to Use Completions API</h2>

                    <ul>
                        <li><strong>Wide Compatibility</strong>: Works with most AI providers (OpenAI, Anthropic, Gemini, Ollama, vLLM)</li>
                        <li><strong>Familiar</strong>: If you know OpenAI's API, you know this</li>
                        <li><strong>Legacy Projects</strong>: Migrating existing OpenAI integrations</li>
                        <li><strong>Provider Flexibility</strong>: Easy switching between compatible providers</li>
                    </ul>

                    <Callout type="info" title="Responses API Recommended">
                        <p>
                            For new projects, consider the <strong>Responses API</strong> which offers hosted tools,
                            MCP integration, and richer response types. The Completions API remains fully supported for compatibility.
                        </p>
                    </Callout>

                    <Callout type="info" title="Session Basics">
                        <p>
                            For general session usage including creating sessions, managing messages, handling responses, and error handling,
                            see the <a href={LINK.GENERATIVE_AI.CORE.USING_SESSIONS}>Using Sessions</a> and{' '}
                            <a href={LINK.GENERATIVE_AI.CORE.SESSIONS_API_REFERENCE}>Sessions API Reference</a> pages.
                            This page focuses on features unique to the Completions API.
                        </p>
                    </Callout>

                    <h2>Completions API Sessions</h2>

                    <Example>
                        <ExampleTitle>Multiple Response Choices</ExampleTitle>
                        <ExampleContent>
                            The Completions API can generate multiple alternative responses in a single request by setting the N parameter.
                        </ExampleContent>
                        <ExampleCpp>
                            {`auto* Session = UGAiCompletionsApiSession::CreateChatGenerationContext(
    EndpointConfig, this,
    TEXT("You are a creative writer."),
    TEXT("Write a short tagline for a fantasy game.")
);

// Generate 3 different variations
Session->Request.N = 3;

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        // Access all choices via Response.Choices array
        auto* CompletionSession = Cast<UGAiCompletionsApiSession>(Ctx);
        for (int32 i = 0; i < CompletionSession->Response.Choices.Num(); ++i)
        {
            FString Choice = CompletionSession->Response.Choices[i].Message.Content;
            UE_LOG(LogTemp, Log, TEXT("Choice %d: %s"), i, *Choice);
        }
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Checking Finish Reasons</ExampleTitle>
                        <ExampleContent>
                            Query why generation stopped for each response:
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        auto* CompletionSession = Cast<UGAiCompletionsApiSession>(Ctx);
        ECompletionApiFinishReason Reason = CompletionSession->GetFinishReason();

        if (Reason == ECompletionApiFinishReason::Length)
        {
            UE_LOG(LogTemp, Warning, TEXT("Hit token limit"));
        }
        else if (Reason == ECompletionApiFinishReason::Stop)
        {
            UE_LOG(LogTemp, Log, TEXT("Completed normally"));
        }
        else if (Reason == ECompletionApiFinishReason::ToolCalls)
        {
            UE_LOG(LogTemp, Log, TEXT("Requested tool execution"));
        }
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Extracting Tool Calls</ExampleTitle>
                        <ExampleContent>
                            The Completions API provides direct access to tool calls embedded in assistant messages:
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Get tool calls from the last assistant message
TArray<FCompletionApiToolCall> ToolCalls = Session->GetToolCalls();

for (const FCompletionApiToolCall& ToolCall : ToolCalls)
{
    UE_LOG(LogTemp, Log, TEXT("Tool: %s"), *ToolCall.Function.Name);
    UE_LOG(LogTemp, Log, TEXT("Arguments: %s"), *ToolCall.Function.Arguments);
}

// Or get from a specific message
TArray<FCompletionApiToolCall> SpecificCalls = Session->GetToolCalls(
    2,  // Message index
    EResponsesApiMessageRole::Assistant
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Manual Tool Call Messages</ExampleTitle>
                        <ExampleContent>
                            When manually managing tool execution, you can add assistant messages that include tool calls:
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Construct tool calls
TArray<FCompletionApiToolCall> ToolCalls;
FCompletionApiToolCall ToolCall;
ToolCall.Id = TEXT("call_123");
ToolCall.Function.Name = TEXT("GetWeather");
ToolCall.Function.Arguments = TEXT("{\\"location\\": \\"Boston\\"}");
ToolCalls.Add(ToolCall);

// Add assistant message with tool calls
Session->AddAssistantMessageWithToolCalls(
    TEXT("Let me check the weather for you."),
    ToolCalls
);

// Later, add tool results
Session->AddToolResultMessage(
    TEXT("call_123"),
    TEXT("Weather: Sunny, 72°F")
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Streaming Deltas</ExampleTitle>
                        <ExampleContent>
                            Get the incremental text added in each streaming chunk.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationStreamChunk::CreateLambda([](const UGAiSession* Ctx)
    {
        auto* CompletionSession = Cast<UGAiCompletionsApiSession>(Ctx);
        FString Delta = CompletionSession->GetDeltaText();

        // Display incremental text update
        UE_LOG(LogTemp, Log, TEXT("Delta: %s"), *Delta);
    })
);`}
                        </ExampleCpp>
                    </Example>
                    <Example>
                        <ExampleTitle>Message Object Access</ExampleTitle>
                        <ExampleContent>
                            Get complete message structures including metadata and tool calls.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Get last user message as full object
FCompletionApiMessage UserMsg = Session->GetLastUserMessage();
UE_LOG(LogTemp, Log, TEXT("User said: %s"), *UserMsg.Content);

// Get last assistant message with all metadata
FCompletionApiMessage AssistantMsg = Session->GetLastAssistantMessage();
if (AssistantMsg.ToolCalls.Num() > 0)
{
    UE_LOG(LogTemp, Log, TEXT("Assistant wants to call tools"));
}`}
                        </ExampleCpp>
                    </Example>

                    <h2>API Reference</h2>

                    <p>
                        This section documents methods unique to <code>UGAiCompletionsApiSession</code>.
                        For base session methods (message management, generation, error handling), see the{' '}
                        <a href={LINK.GENERATIVE_AI.CORE.SESSIONS_API_REFERENCE}>Sessions API Reference</a>.
                    </p>

                    <h3>Properties</h3>

                    <ApiPropertyGroup>
                        <ApiProperty
                            name="Request"
                            type="FCompletionApiRequest"
                            description="The request configuration containing all parameters for the next generation call including messages, tools, temperature, max tokens, and other settings."
                            notes={[
                                'Configure before calling Generate()',
                                'Persists across multiple generations unless Reset() is called'
                            ]}
                        />

                        <ApiProperty
                            name="Response"
                            type="FCompletionApiResponse"
                            description="The response data from the most recent generation including choices, token usage, and finish reasons."
                            notes={[
                                'Read-only',
                                'Updated after each successful generation',
                                'Contains Choices array with multiple responses if N > 1'
                            ]}
                        />

                        <ApiProperty
                            name="CurrentStreamChunk"
                            type="FCompletionApiResponse"
                            description="The current streaming chunk being processed. Only valid during OnStreamChunk callback."
                            notes={[
                                'Read-only',
                                'Contains delta updates from streaming response',
                                'Updated for each chunk during streaming'
                            ]}
                        />

                        <ApiProperty
                            name="StreamChunks"
                            type="TArray<FCompletionApiResponse>"
                            description="Array of all streaming chunks received during the generation. Useful for replay or analysis."
                            notes={[
                                'Read-only',
                                'Populated only when streaming is enabled',
                                'Cleared at the start of each generation'
                            ]}
                        />
                    </ApiPropertyGroup>

                    <h3>Factory Methods</h3>

                    <ApiFunctionGroup>
                        <ApiFunction
                            name="CreateChatGenerationContext"
                            signature={`static UGAiCompletionsApiSession* CreateChatGenerationContext(
    UGAiEndpointConfig* InEndpointConfig,
    UObject* Outer = nullptr,
    FString SystemPrompt = TEXT(""),
    FString UserPrompt = TEXT("")
)`}
                            description="Creates a new chat completion session with optional system prompt and initial user message."
                            parameters={[
                                {
                                    name: 'InEndpointConfig',
                                    type: 'UGAiEndpointConfig*',
                                    description: 'Endpoint configuration defining the AI provider and model'
                                },
                                {
                                    name: 'Outer',
                                    type: 'UObject*',
                                    description: 'Outer object for garbage collection. Use GetTransientPackage() for one-shot sessions.'
                                },
                                {
                                    name: 'SystemPrompt',
                                    type: 'FString',
                                    description: 'Optional system instructions'
                                },
                                {
                                    name: 'UserPrompt',
                                    type: 'FString',
                                    description: 'Optional initial user message'
                                }
                            ]}
                            returns={{
                                type: 'UGAiCompletionsApiSession*',
                                description: 'New chat session instance'
                            }}
                            example={`auto* Session = UGAiCompletionsApiSession::CreateChatGenerationContext(
    Config, this,
    TEXT("You are a helpful NPC."),
    TEXT("Hello!")
);`}
                        />

                        <ApiFunction
                            name="CreateTextGenerationContext"
                            signature={`static UGAiCompletionsApiSession* CreateTextGenerationContext(
    UGAiEndpointConfig* InEndpointConfig,
    UObject* Outer = nullptr,
    const FString& Prompt = TEXT("")
)`}
                            description="Creates a text completion session for continuing text without conversation history."
                            parameters={[
                                {
                                    name: 'InEndpointConfig',
                                    type: 'UGAiEndpointConfig*',
                                    description: 'Endpoint configuration'
                                },
                                {
                                    name: 'Outer',
                                    type: 'UObject*',
                                    description: 'Outer object for GC management'
                                },
                                {
                                    name: 'Prompt',
                                    type: 'const FString&',
                                    description: 'Optional initial prompt text to continue'
                                }
                            ]}
                            returns={{
                                type: 'UGAiCompletionsApiSession*',
                                description: 'New text completion session instance'
                            }}
                            example={`auto* Session = UGAiCompletionsApiSession::CreateTextGenerationContext(
    Config, this,
    TEXT("Once upon a time in a dark forest, ")
);`}
                        />
                    </ApiFunctionGroup>

                    <h3>Message Management</h3>

                    <ApiFunctionGroup>
                        <ApiFunction
                            name="AddAssistantMessageWithToolCalls"
                            signature="void AddAssistantMessageWithToolCalls(const FString& Content, const TArray<FCompletionApiToolCall>& ToolCalls)"
                            description="Adds an assistant message with embedded tool calls. Used for manual tool execution workflows or providing conversation context."
                            parameters={[
                                {
                                    name: 'Content',
                                    type: 'const FString&',
                                    description: 'Message text from the assistant'
                                },
                                {
                                    name: 'ToolCalls',
                                    type: 'const TArray<FCompletionApiToolCall>&',
                                    description: 'Array of tool calls to embed in the message'
                                }
                            ]}
                            example={`TArray<FCompletionApiToolCall> ToolCalls;
FCompletionApiToolCall Call;
Call.Id = TEXT("call_abc");
Call.Function.Name = TEXT("GetWeather");
Call.Function.Arguments = TEXT("{\\"city\\": \\"Boston\\"}");
ToolCalls.Add(Call);

Session->AddAssistantMessageWithToolCalls(
    TEXT("Let me check the weather."),
    ToolCalls
);`}
                            notes={[
                                'Typically used when manually managing tool execution',
                                'Tool calls must include unique IDs',
                                'Follow with AddToolResultMessage() to provide results'
                            ]}
                        />
                    </ApiFunctionGroup>

                    <h3>Configuration Methods</h3>

                    <ApiFunctionGroup>
                        <ApiFunction
                            name="SetResponseFormat"
                            signature="void SetResponseFormat(EResponsesApiTextFormatType Type, const TSubclassOf<UObject> Class = nullptr)"
                            description="Configures the response format for structured output. Enables JSON mode or JSON schema validation."
                            parameters={[
                                {
                                    name: 'Type',
                                    type: 'EResponsesApiTextFormatType',
                                    description: 'Format type: Text, JsonObject, or JsonSchema'
                                },
                                {
                                    name: 'Class',
                                    type: 'const TSubclassOf<UObject>',
                                    description: 'Optional UObject class for JsonSchema validation'
                                }
                            ]}
                            example={`// JSON mode
Session->SetResponseFormat(EResponsesApiTextFormatType::JsonObject);

// JSON schema with validation
Session->SetResponseFormat(
    EResponsesApiTextFormatType::JsonSchema,
    UMyDataClass::StaticClass()
);`}
                            notes={[
                                'See Structured Output feature page for details',
                                'Not all models support structured output',
                                'JsonSchema mode validates and parses response into StructuredOutput property'
                            ]}
                        />
                    </ApiFunctionGroup>

                    <h3>Response Access</h3>

                    <ApiFunctionGroup>
                        <ApiFunction
                            name="GetFinishReason"
                            signature="ECompletionApiFinishReason GetFinishReason(int32 ChoiceIndex = -1) const"
                            description="Returns the finish reason for a specific choice, indicating why generation stopped."
                            parameters={[
                                {
                                    name: 'ChoiceIndex',
                                    type: 'int32',
                                    description: 'Choice index (0-based). Use -1 for the first/only choice.'
                                }
                            ]}
                            returns={{
                                type: 'ECompletionApiFinishReason',
                                description: 'The reason generation completed'
                            }}
                            example={`ECompletionApiFinishReason Reason = Session->GetFinishReason();
if (Reason == ECompletionApiFinishReason::Length)
{
    UE_LOG(LogTemp, Warning, TEXT("Hit max token limit"));
}`}
                        />

                        <ApiFunction
                            name="GetLastUserMessage"
                            signature="FCompletionApiMessage GetLastUserMessage() const"
                            description="Returns the full message object for the most recent user message."
                            returns={{
                                type: 'FCompletionApiMessage',
                                description: 'Complete message structure including content and metadata'
                            }}
                            example={`FCompletionApiMessage Msg = Session->GetLastUserMessage();
UE_LOG(LogTemp, Log, TEXT("User: %s"), *Msg.Content);`}
                        />

                        <ApiFunction
                            name="GetLastAssistantMessage"
                            signature="FCompletionApiMessage GetLastAssistantMessage() const"
                            description="Returns the full message object for the most recent assistant message, including any tool calls."
                            returns={{
                                type: 'FCompletionApiMessage',
                                description: 'Complete message structure with tool calls if present'
                            }}
                            example={`FCompletionApiMessage Msg = Session->GetLastAssistantMessage();
if (Msg.ToolCalls.Num() > 0)
{
    UE_LOG(LogTemp, Log, TEXT("Assistant requested tools"));
}`}
                        />

                        <ApiFunction
                            name="GetDeltaText"
                            signature="FString GetDeltaText(int32 ChoiceIndex = -1) const"
                            description="Returns the delta text from the current streaming chunk. Only valid during OnStreamChunk callback."
                            parameters={[
                                {
                                    name: 'ChoiceIndex',
                                    type: 'int32',
                                    description: 'Choice index for multiple responses. Use -1 for first choice.'
                                }
                            ]}
                            returns={{
                                type: 'FString',
                                description: 'Incremental text added in this chunk'
                            }}
                            example={`Session->Generate(
    /* OnComplete */,
    /* OnError */,
    FOnGenerationStreamChunk::CreateLambda([](const UGAiSession* Ctx)
    {
        auto* S = Cast<UGAiCompletionsApiSession>(Ctx);
        FString Delta = S->GetDeltaText();
        // Display delta...
    })
);`}
                            notes={[
                                'Only valid during streaming',
                                'Returns empty string outside OnStreamChunk callback'
                            ]}
                        />
                    </ApiFunctionGroup>

                    <h3>Tool Call Queries</h3>

                    <ApiFunctionGroup>
                        <ApiFunction
                            name="GetToolCalls"
                            signature="TArray<FCompletionApiToolCall> GetToolCalls(int32 MessageIndex = -1, EResponsesApiMessageRole RoleFilter = EResponsesApiMessageRole::Assistant) const"
                            description="Extracts tool calls from a specific message in the conversation history."
                            parameters={[
                                {
                                    name: 'MessageIndex',
                                    type: 'int32',
                                    description: 'Message index (supports negative indexing). -1 = last message.'
                                },
                                {
                                    name: 'RoleFilter',
                                    type: 'EResponsesApiMessageRole',
                                    description: 'Role filter (typically Assistant). Only returns tool calls if message matches this role.'
                                }
                            ]}
                            returns={{
                                type: 'TArray<FCompletionApiToolCall>',
                                description: 'Array of tool calls from the message'
                            }}
                            example={`// Get tool calls from last assistant message
TArray<FCompletionApiToolCall> Calls = Session->GetToolCalls();

// Get from specific message
TArray<FCompletionApiToolCall> OlderCalls = Session->GetToolCalls(
    2,  // Third message
    EResponsesApiMessageRole::Assistant
);`}
                            notes={[
                                'Returns empty array if message has no tool calls',
                                'Returns empty array if message role doesn\'t match filter',
                                'Tool calls are embedded in assistant messages'
                            ]}
                        />

                        <ApiFunction
                            name="GetToolResult"
                            signature="FString GetToolResult(int32 MessageIndex = -1, EResponsesApiMessageRole RoleFilter = EResponsesApiMessageRole::Tool) const"
                            description="Retrieves the tool execution result from a tool message."
                            parameters={[
                                {
                                    name: 'MessageIndex',
                                    type: 'int32',
                                    description: 'Message index (supports negative indexing). -1 = last message.'
                                },
                                {
                                    name: 'RoleFilter',
                                    type: 'EResponsesApiMessageRole',
                                    description: 'Role filter (typically Tool). Only returns result if message matches this role.'
                                }
                            ]}
                            returns={{
                                type: 'FString',
                                description: 'Tool execution result text'
                            }}
                            example={`// Get result from last tool message
FString Result = Session->GetToolResult();
UE_LOG(LogTemp, Log, TEXT("Tool returned: %s"), *Result);`}
                            notes={[
                                'Returns empty string if message is not a tool result',
                                'Tool results are stored in messages with Tool role',
                                'Use with GetToolCalls() to match calls with results'
                            ]}
                        />
                    </ApiFunctionGroup>

                    <h3>Finish Reasons</h3>

                    <EnumReference
                        enumName="ECompletionApiFinishReason"
                        description="Indicates why the generation completed"
                        values={[
                            {
                                name: "Stop",
                                description: "Natural completion - the model finished the response"
                            },
                            {
                                name: "Length",
                                description: "Reached max token limit",
                                usage: "Increase MaxTokens if response was cut off"
                            },
                            {
                                name: "ToolCalls",
                                description: "Model wants to execute tools",
                                usage: "Tool execution is typically handled automatically"
                            },
                            {
                                name: "ContentFilter",
                                description: "Response was filtered due to content policy",
                                usage: "Adjust prompt or content to avoid policy violations"
                            },
                            {
                                name: "FunctionCall",
                                description: "Legacy function call (deprecated in favor of ToolCalls)"
                            }
                        ]}
                    />

                    <h2>Provider Compatibility</h2>

                    <p>The Completions API works with:</p>

                    <ul>
                        <li><strong>OpenAI</strong>: Full support including vision, tools, JSON mode</li>
                        <li><strong>Anthropic (Claude)</strong>: Via Messages API compatibility layer</li>
                        <li><strong>Google (Gemini)</strong>: Via OpenAI-compatible endpoint</li>
                        <li><strong>Ollama</strong>: Local models with OpenAI API compatibility</li>
                        <li><strong>vLLM</strong>: Self-hosted with OpenAI compatibility</li>
                    </ul>

                    <Callout type="info" title="Feature Support Varies">
                        <p>
                            Not all providers support all features (e.g., tools, vision, JSON mode).
                            Check your provider's documentation for supported capabilities.
                        </p>
                    </Callout>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><a href={LINK.GENERATIVE_AI.CORE.USING_SESSIONS}>Using Sessions</a> - Learn session basics and lifecycle management</li>
                        <li><a href={LINK.GENERATIVE_AI.CORE.SESSIONS_API_REFERENCE}>Sessions API Reference</a> - Base session API documentation</li>
                        <li><a href={LINK.GENERATIVE_AI.FEATURES.TOOLS}>Tools</a> - Custom tool implementation</li>
                        <li><a href={LINK.GENERATIVE_AI.FEATURES.STREAMING}>Streaming</a> - Real-time response generation</li>
                        <li><a href={LINK.GENERATIVE_AI.FEATURES.STRUCTURED_OUTPUT}>Structured Output</a> - Type-safe JSON responses</li>
                    </ul>

                </LanguageToggleProvider>

                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
