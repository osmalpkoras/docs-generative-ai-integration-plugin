import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Responses API',
    description: 'Modern API with hosted tools, MCP integration, and rich response types',
    order: 102,
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
} from '@/components/doc-components';
import { LINK } from '@/lib/pages.generated';

export default function ResponsesApiPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <p className="text-muted-foreground">
                        The Responses API is the modern, feature-rich API with native support for hosted tools,
                        MCP integration, and richer response types. <strong>Recommended for new projects.</strong>
                    </p>

                    <h2>Why Use Responses API</h2>

                    <ul>
                        <li><strong>Hosted Tools</strong>: Built-in web search, file search, code interpreter, image generation</li>
                        <li><strong>MCP Integration</strong>: Native Model Context Protocol support</li>
                        <li><strong>Rich Responses</strong>: Response items include citations, reasoning traces, and structured data</li>
                        <li><strong>Developer Messages</strong>: Separate role for technical constraints vs core instructions</li>
                        <li><strong>Modern Features</strong>: Latest AI capabilities as they're released</li>
                    </ul>

                    <Callout type="info" title="Session Basics">
                        <p>
                            For general session usage including creating sessions, managing messages, handling responses, and error handling,
                            see the <a href={LINK.GENERATIVE_AI.CORE.USING_SESSIONS}>Using Sessions</a> and{' '}
                            <a href={LINK.GENERATIVE_AI.CORE.SESSIONS_API_REFERENCE}>Sessions API Reference</a> pages.
                            This page focuses on features unique to the Responses API.
                        </p>
                    </Callout>

                    <h2>Responses API Sessions</h2>

                    <Example>
                        <ExampleTitle>Using Developer Messages</ExampleTitle>
                        <ExampleContent>

                            The Responses API supports a separate <code>Developer</code> role for technical constraints, distinct from system instructions which define core AI behavior. Developer messages provide lower-priority technical guidelines that don't override system instructions.
                        </ExampleContent>
                        <ExampleCpp>
                            {`auto* Session = UGAiResponsesApiSession::CreateChatSession(
    EndpointConfig, this,
    TEXT("You are a helpful quest narrator."),
    TEXT("")
);

// Add technical constraints via developer message
Session->SetDeveloperMessage(TEXT("Keep all responses under 100 words."));

// Or use AddMessage for more control
Session->AddMessage(
    EResponsesApiMessageRole::Developer,
    TEXT("Format all item names in [brackets].")
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Adding Hosted Tools</ExampleTitle>
                        <ExampleContent>
                            The Responses API provides provider-integrated hosted tools that execute server-side like web search, file search, code interpreter, and image generation.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "GenerativeAi/Utility/InstancedStructUtils.h"

// Web search
FResponsesApiWebSearchTool WebSearch;
WebSearch.SearchContextSize = EResponsesApiWebSearchContextSize::Medium;
Session->AddWebSearchTool(WebSearch);

// File search
FResponsesApiFileSearchTool FileSearch;
FileSearch.VectorStoreIds = {TEXT("vs_abc123")};
Session->AddFileSearchTool(FileSearch, true);

// Code interpreter
FResponsesApiCodeInterpreterTool CodeInterpreter;
Session->AddCodeInterpreterTool(CodeInterpreter, true);

// Image generation (DALL-E)
FResponsesApiImageGenerationTool ImageGen;
ImageGen.Model = TEXT("dall-e-3");
Session->AddImageGenerationTool(ImageGen);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Hosted Tools Documentation">
                        <p>
                            For detailed guides on each hosted tool type including configuration options and use cases,
                            see the <strong>Hosted Tools</strong> section.
                        </p>
                    </Callout>

                    <Callout type="warning" title="Feature Availability">
                        <p>
                            Hosted tools (web search, file search, etc.) are provider-specific.
                            Check your provider's documentation for supported features.
                        </p>
                    </Callout>

                    <Example>
                        <ExampleTitle>Working with Response Items</ExampleTitle>
                        <ExampleContent>
                            Unlike message-only APIs, the Responses API provides structured response items including
                            text, tool calls, citations, and reasoning traces. Query response items by type to access structured data beyond plain text.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Get all items of a specific type
TArray<TInstancedStruct<FResponsesApiItemBase>> TextItems =
    Session->GetItemsByType(EResponsesApiResponseItemType::MessageContent);

int32 TotalItems = Session->GetItemCount();

// Query items added after the last user message
// (useful for extracting what the AI added in the latest turn)
TArray<TInstancedStruct<FResponsesApiItemBase>> LatestItems =
    Session->GetItemsByTypeAfterLastUserMessage(
        EResponsesApiResponseItemType::MessageContent
    );`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Stream Options Configuration</ExampleTitle>
                        <ExampleContent>
                            Configure what data is included in streaming responses:
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Enable reasoning content streaming (for models like o1)
Session->SetStreamOptions(
    static_cast<int32>(EResponsesApiStreamOption::ReasoningEncryptedContent)
);

// Or combine multiple options
int32 Options =
    static_cast<int32>(EResponsesApiStreamOption::ReasoningEncryptedContent) |
    static_cast<int32>(EResponsesApiStreamOption::IncludeUsage);
Session->SetStreamOptions(Options);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Reasoning Configuration</ExampleTitle>
                        <ExampleContent>
                            Configure extended reasoning for models that support it (like o1):
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Enable reasoning with effort level
Session->Request.Reasoning = FResponsesApiReasoningOptions();
Session->Request.Reasoning->Effort = TEXT("high");  // "low", "medium", or "high"

// Stream reasoning traces
Session->SetStreamOptions(
    static_cast<int32>(EResponsesApiStreamOption::ReasoningEncryptedContent)
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>MCP Tool Integration</ExampleTitle>
                        <ExampleContent>
                            Add Model Context Protocol tools to integrate external capabilities through the MCP protocol.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Add MCP tool (requires MCP server configuration)
FResponsesApiMcpTool McpTool;
McpTool.ToolName = TEXT("my_external_tool");
Session->AddMcpTool(McpTool);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="MCP Server">
                        <p>
                            See the <strong>Agentic / MCP Server</strong> page for complete documentation
                            on setting up and using the MCP server subsystem.
                        </p>
                    </Callout>

                    <h2>API Reference</h2>

                    <p>
                        This section documents methods unique to <code>UGAiResponsesApiSession</code>.
                        For base session methods (message management, generation, error handling), see the{' '}
                        <a href={LINK.GENERATIVE_AI.CORE.SESSIONS_API_REFERENCE}>Sessions API Reference</a>.
                    </p>

                    <h3>Properties</h3>

                    <ApiPropertyGroup>
                        <ApiProperty
                            name="Request"
                            type="FResponsesApiRequest"
                            description="The request configuration containing all parameters for the next generation call including messages, tools, temperature, max tokens, and other settings."
                            notes={[
                                'Configure before calling Generate()',
                                'Persists across multiple generations unless Reset() is called'
                            ]}
                        />

                        <ApiProperty
                            name="Response"
                            type="FResponsesApiResponse"
                            description="The response data from the most recent generation including response items, token usage, and metadata."
                            notes={[
                                'Read-only',
                                'Updated after each successful generation',
                                'Contains structured items rather than just text'
                            ]}
                        />

                        <ApiProperty
                            name="CurrentStreamChunk"
                            type="FResponsesApiSseEvent"
                            description="The current streaming event being processed. Only valid during OnStreamChunk callback."
                            notes={[
                                'Read-only',
                                'Contains incremental data from streaming response',
                                'Updated for each chunk during streaming'
                            ]}
                        />

                        <ApiProperty
                            name="StreamOptions"
                            type="int32"
                            description="Bitmask controlling what data is included in streaming responses. Use EResponsesApiStreamOption enum values."
                            notes={[
                                'Configure with SetStreamOptions()',
                                'Combine multiple options with bitwise OR',
                                'Affects streaming behavior for reasoning and usage data'
                            ]}
                        />
                    </ApiPropertyGroup>

                    <h3>Factory Methods</h3>

                    <ApiFunctionGroup>
                        <ApiFunction
                            name="CreateSession"
                            signature="static UGAiResponsesApiSession* CreateSession(UGAiEndpointConfig* InEndpointConfig, UObject* Outer = nullptr)"
                            description="Creates a new Responses API session with minimal configuration."
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
                                }
                            ]}
                            returns={{
                                type: 'UGAiResponsesApiSession*',
                                description: 'New session instance'
                            }}
                        />

                        <ApiFunction
                            name="CreateChatSession"
                            signature={`static UGAiResponsesApiSession* CreateChatSession(
    UGAiEndpointConfig* InEndpointConfig,
    UObject* Outer = nullptr,
    FString SystemPrompt = TEXT(""),
    FString UserText = TEXT("")
)`}
                            description="Creates a chat session with optional system prompt and initial user message."
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
                                    name: 'SystemPrompt',
                                    type: 'FString',
                                    description: 'Optional system instructions'
                                },
                                {
                                    name: 'UserText',
                                    type: 'FString',
                                    description: 'Optional initial user message'
                                }
                            ]}
                            returns={{
                                type: 'UGAiResponsesApiSession*',
                                description: 'New chat session instance'
                            }}
                            example={`auto* Session = UGAiResponsesApiSession::CreateChatSession(
    Config, this,
    TEXT("You are a helpful NPC."),
    TEXT("Hello!")
);`}
                        />

                        <ApiFunction
                            name="CreateCompletionSession"
                            signature={`static UGAiResponsesApiSession* CreateCompletionSession(
    UGAiEndpointConfig* InEndpointConfig,
    UObject* Outer = nullptr,
    FString Prompt = TEXT("")
)`}
                            description="Creates a completion-style session for text generation without conversation history."
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
                                    type: 'FString',
                                    description: 'Optional initial prompt text'
                                }
                            ]}
                            returns={{
                                type: 'UGAiResponsesApiSession*',
                                description: 'New completion session instance'
                            }}
                        />
                    </ApiFunctionGroup>

                    <h3>Configuration Methods</h3>

                    <ApiFunctionGroup>
                        <ApiFunction
                            name="SetDeveloperMessage"
                            signature="void SetDeveloperMessage(const FString& Content)"
                            description="Sets a developer message containing technical constraints and guidelines. Developer messages have lower priority than system messages."
                            parameters={[
                                {
                                    name: 'Content',
                                    type: 'const FString&',
                                    description: 'Technical constraints or implementation details'
                                }
                            ]}
                            example={`Session->SetDeveloperMessage(
    TEXT("Keep responses under 100 words.")
);`}
                            notes={[
                                'Use for technical constraints that shouldn\'t override system personality',
                                'Not all models support developer messages',
                                'Replaces existing developer message'
                            ]}
                        />

                        <ApiFunction
                            name="SetInstructions"
                            signature="void SetInstructions(const FString& InInstructions)"
                            description="Sets the system instructions that define the AI's behavior and personality. Alias for SetSystemMessage()."
                            parameters={[
                                {
                                    name: 'InInstructions',
                                    type: 'const FString&',
                                    description: 'System-level instructions defining AI persona'
                                }
                            ]}
                        />

                        <ApiFunction
                            name="SetStreamOptions"
                            signature="void SetStreamOptions(int32 InStreamOptions)"
                            description="Configures what data is included in streaming responses using EResponsesApiStreamOption enum flags."
                            parameters={[
                                {
                                    name: 'InStreamOptions',
                                    type: 'int32',
                                    description: 'Bitmask of EResponsesApiStreamOption values'
                                }
                            ]}
                            example={`// Enable reasoning streaming
Session->SetStreamOptions(
    static_cast<int32>(EResponsesApiStreamOption::ReasoningEncryptedContent)
);

// Combine multiple options
int32 Options =
    static_cast<int32>(EResponsesApiStreamOption::ReasoningEncryptedContent) |
    static_cast<int32>(EResponsesApiStreamOption::IncludeUsage);
Session->SetStreamOptions(Options);`}
                        />

                        <ApiFunction
                            name="GetStreamOptions"
                            signature="int32 GetStreamOptions() const"
                            description="Returns the current stream options configuration."
                            returns={{
                                type: 'int32',
                                description: 'Current stream options bitmask'
                            }}
                        />

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

                    <h3>Response Item Queries</h3>

                    <ApiFunctionGroup>
                        <ApiFunction
                            name="GetItemCount"
                            signature="int32 GetItemCount() const"
                            description="Returns the total number of items in the current request input (all messages, tool calls, etc.)."
                            returns={{
                                type: 'int32',
                                description: 'Total item count'
                            }}
                        />

                        <ApiFunction
                            name="GetItemsByType"
                            signature="TArray<TInstancedStruct<FResponsesApiItemBase>> GetItemsByType(EResponsesApiResponseItemType Type) const"
                            description="Retrieves all items matching a specific type from the request input."
                            parameters={[
                                {
                                    name: 'Type',
                                    type: 'EResponsesApiResponseItemType',
                                    description: 'The item type to filter by'
                                }
                            ]}
                            returns={{
                                type: 'TArray<TInstancedStruct<FResponsesApiItemBase>>',
                                description: 'Array of matching items'
                            }}
                            example={`auto TextItems = Session->GetItemsByType(
    EResponsesApiResponseItemType::MessageContent
);`}
                        />

                        <ApiFunction
                            name="GetItemCountAfterLastUserMessage"
                            signature="int32 GetItemCountAfterLastUserMessage() const"
                            description="Returns the number of items added after the last user message. Useful for tracking what the AI added in the latest turn."
                            returns={{
                                type: 'int32',
                                description: 'Number of items after last user message'
                            }}
                        />

                        <ApiFunction
                            name="GetItemsByTypeAfterLastUserMessage"
                            signature="TArray<TInstancedStruct<FResponsesApiItemBase>> GetItemsByTypeAfterLastUserMessage(EResponsesApiResponseItemType Type) const"
                            description="Retrieves items of a specific type that were added after the last user message."
                            parameters={[
                                {
                                    name: 'Type',
                                    type: 'EResponsesApiResponseItemType',
                                    description: 'The item type to filter by'
                                }
                            ]}
                            returns={{
                                type: 'TArray<TInstancedStruct<FResponsesApiItemBase>>',
                                description: 'Array of matching items from latest turn'
                            }}
                        />
                    </ApiFunctionGroup>

                    <h3>Tool Management</h3>

                    <ApiFunctionGroup>
                        <ApiFunction
                            name="AddToolDefinition"
                            signature="void AddToolDefinition(TInstancedStruct<FResponsesApiTool> ToolDefinition)"
                            description="Adds a generic tool definition to the session. Use this for manually constructed tool definitions."
                            parameters={[
                                {
                                    name: 'ToolDefinition',
                                    type: 'TInstancedStruct<FResponsesApiTool>',
                                    description: 'Instanced struct containing tool configuration'
                                }
                            ]}
                        />

                        <ApiFunction
                            name="AddFileSearchTool"
                            signature="void AddFileSearchTool(const FResponsesApiFileSearchTool& FileSearchToolOptions, bool bIncludeFileSearchResultsInResponse = false)"
                            description="Adds a hosted file search tool for searching through uploaded documents."
                            parameters={[
                                {
                                    name: 'FileSearchToolOptions',
                                    type: 'const FResponsesApiFileSearchTool&',
                                    description: 'Configuration including vector store IDs and search parameters'
                                },
                                {
                                    name: 'bIncludeFileSearchResultsInResponse',
                                    type: 'bool',
                                    description: 'Whether to include search results in response'
                                }
                            ]}
                            example={`FResponsesApiFileSearchTool FileSearch;
FileSearch.VectorStoreIds = {TEXT("vs_abc123")};
Session->AddFileSearchTool(FileSearch, true);`}
                        />

                        <ApiFunction
                            name="AddWebSearchTool"
                            signature="void AddWebSearchTool(const FResponsesApiWebSearchTool& WebSearchToolOptions, bool bVersion_2025_03_11 = false)"
                            description="Adds a hosted web search tool for searching the internet."
                            parameters={[
                                {
                                    name: 'WebSearchToolOptions',
                                    type: 'const FResponsesApiWebSearchTool&',
                                    description: 'Configuration including search context size'
                                },
                                {
                                    name: 'bVersion_2025_03_11',
                                    type: 'bool',
                                    description: 'Use 2025-03-11 API version'
                                }
                            ]}
                            example={`FResponsesApiWebSearchTool WebSearch;
WebSearch.SearchContextSize = EResponsesApiWebSearchContextSize::Medium;
Session->AddWebSearchTool(WebSearch);`}
                        />

                        <ApiFunction
                            name="AddCodeInterpreterTool"
                            signature="void AddCodeInterpreterTool(const FResponsesApiCodeInterpreterTool& CodeInterpreterOptions, bool bIncludeCodeInterpreterOutputInResponse = false)"
                            description="Adds a hosted code interpreter tool for executing Python code in a sandbox."
                            parameters={[
                                {
                                    name: 'CodeInterpreterOptions',
                                    type: 'const FResponsesApiCodeInterpreterTool&',
                                    description: 'Configuration for code interpreter'
                                },
                                {
                                    name: 'bIncludeCodeInterpreterOutputInResponse',
                                    type: 'bool',
                                    description: 'Whether to include execution output in response'
                                }
                            ]}
                        />

                        <ApiFunction
                            name="AddImageGenerationTool"
                            signature="void AddImageGenerationTool(const FResponsesApiImageGenerationTool& ImageGenerationOptions)"
                            description="Adds a hosted image generation tool (DALL-E)."
                            parameters={[
                                {
                                    name: 'ImageGenerationOptions',
                                    type: 'const FResponsesApiImageGenerationTool&',
                                    description: 'Configuration including model selection'
                                }
                            ]}
                            example={`FResponsesApiImageGenerationTool ImageGen;
ImageGen.Model = TEXT("dall-e-3");
Session->AddImageGenerationTool(ImageGen);`}
                        />

                        <ApiFunction
                            name="AddMcpTool"
                            signature="void AddMcpTool(const FResponsesApiMcpTool& McpToolOptions)"
                            description="Adds a Model Context Protocol tool configured via the MCP server subsystem."
                            parameters={[
                                {
                                    name: 'McpToolOptions',
                                    type: 'const FResponsesApiMcpTool&',
                                    description: 'Configuration including tool name'
                                }
                            ]}
                            example={`FResponsesApiMcpTool McpTool;
McpTool.ToolName = TEXT("my_external_tool");
Session->AddMcpTool(McpTool);`}
                            notes={[
                                'Requires MCP server configuration',
                                'See MCP Server documentation for setup details'
                            ]}
                        />

                        <ApiFunction
                            name="AddCustomTool"
                            signature="void AddCustomTool(const FResponsesApiCustomTool& CustomToolOptions)"
                            description="Adds a custom tool with manual definition."
                            parameters={[
                                {
                                    name: 'CustomToolOptions',
                                    type: 'const FResponsesApiCustomTool&',
                                    description: 'Custom tool configuration'
                                }
                            ]}
                        />
                    </ApiFunctionGroup>

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
