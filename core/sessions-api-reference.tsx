import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Sessions API Reference',
    order: 11
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
    ApiFunctionGroup,
    ApiPropertyGroup,
    EnumReference,
} from '@/components/doc-components';

export default function SessionBasicsPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <h2>UGAiSession Class</h2>

                    <p>
                        The <code>UGAiSession</code> class is the foundation for all AI interactions in the plugin.
                        Sessions manage conversation history, handle API requests, execute tool calls, and provide
                        access to generated content. Both <code>UGAiResponsesApiSession</code> and{' '}
                        <code>UGAiCompletionsApiSession</code> inherit from this base class.
                    </p>

                    <h3>Properties</h3>

                    <ApiPropertyGroup>
                        <ApiProperty
                            name="EndpointConfig"
                            type="TSoftObjectPtr<UGAiEndpointConfig>"
                            description="The endpoint configuration defining which AI provider to use, API keys, model selection, and connection settings."
                        />

                        <ApiProperty
                            name="MaxApiRequests"
                            type="int32"
                            description="Maximum number of API requests allowed per generation call. Prevents infinite loops in agentic workflows with tool execution."
                            notes={[
                                'Minimum value is 1',
                                'Each tool execution counts as an additional request',
                                'Useful for limiting agent behavior'
                            ]}
                        />

                        <ApiProperty
                            name="CurrentApiRequestCount"
                            type="int32"
                            description="Current number of API requests made in the ongoing generation session. Resets to 0 before each Generate() call."
                            notes={[
                                'Read-only',
                                'Increments with each request and tool execution',
                                'Used to enforce MaxApiRequests limit'
                            ]}
                        />

                        <ApiProperty
                            name="Error"
                            type="FResponsesApiError"
                            description="Contains detailed error information from the last failed generation, including error type and message."
                            notes={[
                                'Read-only',
                                'Check with HasError() before accessing'
                            ]}
                        />

                        <ApiProperty
                            name="bHasError"
                            type="bool"
                            description="Flag indicating whether an error occurred during the last generation."
                        />

                        <ApiProperty
                            name="StructuredOutput"
                            type="UObject*"
                            description="Parsed structured output object when using JSON schema validation. Only populated if structured output was configured and successfully parsed."
                        />
                    </ApiPropertyGroup>


                    <h3>Callback Delegates</h3>

                    <p>
                        These delegates are used with the <code>Generate()</code> method to handle different stages
                        of the generation process:
                    </p>

                    <ApiPropertyGroup>
                        <ApiProperty
                            name="FOnGenerationComplete"
                            type="DECLARE_DELEGATE_OneParam(FOnGenerationComplete, const UGAiSession*)"
                            description="Callback invoked when generation completes successfully (with or without errors). Called on the game thread."
                            notes={[
                                'Signature: void Callback(const UGAiSession* Session)',
                                'Always called, even if session has errors - check HasError()',
                                'Access response via Session->GetAggregatedResponseText()',
                                'Required parameter in Generate()'
                            ]}
                        />

                        <ApiProperty
                            name="FOnGenerationError"
                            type="DECLARE_DELEGATE_OneParam(FOnGenerationError, const UGAiSession*)"
                            description="Callback invoked when an error occurs during generation. Called on the game thread."
                            notes={[
                                'Signature: void Callback(const UGAiSession* Session)',
                                'Use Session->GetErrorMessage() for error details',
                                'Can occur due to network errors, API errors, invalid configuration, or timeouts',
                                'Optional parameter in Generate()'
                            ]}
                        />

                        <ApiProperty
                            name="FOnGenerationStreamChunk"
                            type="DECLARE_DELEGATE_OneParam(FOnGenerationStreamChunk, const UGAiSession*)"
                            description="Callback invoked for each streamed chunk during generation. Called on the game thread."
                            notes={[
                                'Signature: void Callback(const UGAiSession* Session)',
                                'Use Session->GetCurrentStreamChunkText() to access the chunk',
                                'Called multiple times during streaming',
                                'Only called if streaming is enabled',
                                'Optional parameter in Generate()'
                            ]}
                        />

                        <ApiProperty
                            name="FOnGenerationToolCall"
                            type="DECLARE_DELEGATE_RetVal_TwoParams(FToolExecutionResult, FOnGenerationToolCall, const UGAiSession*, const FUnifiedToolCall&)"
                            description="Callback invoked when a tool call is requested by the AI. Called on the game thread."
                            notes={[
                                'Signature: FToolExecutionResult Callback(const UGAiSession* Session, const FUnifiedToolCall& ToolCall)',
                                'Return FToolExecutionResult to provide tool execution results',
                                'Returning an empty result allows default tool execution',
                                'Only called when tools are registered and requested by the AI',
                                'Optional parameter in Generate()'
                            ]}
                        />

                        <ApiProperty
                            name="FOnGenerationChoiceSelection"
                            type="DECLARE_DELEGATE_RetVal_OneParam(int32, FOnGenerationChoiceSelection, const UGAiSession*)"
                            description="Callback invoked when the AI provides multiple response choices and one must be selected."
                            notes={[
                                'Signature: int32 Callback(const UGAiSession* Session)',
                                'Return the zero-based index of the selected choice',
                                'Rarely used - most models provide single responses',
                                'Optional parameter in Generate()'
                            ]}
                        />
                    </ApiPropertyGroup>

                    <h3>Core Methods</h3>

                    <ApiFunctionGroup>
                        <ApiFunction

                            name="Generate"
                            signature={`virtual void Generate(
    const FOnGenerationComplete& OnComplete,
    const FOnGenerationError& OnError = FOnGenerationError(),
    const FOnGenerationStreamChunk& OnStreamChunk = FOnGenerationStreamChunk(),
    const FOnGenerationToolCall& OnToolCall = FOnGenerationToolCall(),
    const FOnGenerationChoiceSelection& OnChoiceSelection = FOnGenerationChoiceSelection()
)`}
                            description="Executes AI generation with the current session state. This is the primary method for all AI interactions."
                            parameters={[
                                {
                                    name: 'OnComplete',
                                    type: 'FOnGenerationComplete',
                                    description: 'Called when generation completes (success or error). Required.'
                                },
                                {
                                    name: 'OnError',
                                    type: 'FOnGenerationError',
                                    description: 'Called when an error occurs. Optional.'
                                },
                                {
                                    name: 'OnStreamChunk',
                                    type: 'FOnGenerationStreamChunk',
                                    description: 'Called for each streamed chunk. Optional.'
                                },
                                {
                                    name: 'OnToolCall',
                                    type: 'FOnGenerationToolCall',
                                    description: 'Called for custom tool execution. Optional.'
                                },
                                {
                                    name: 'OnChoiceSelection',
                                    type: 'FOnGenerationChoiceSelection',
                                    description: 'Called to select from multiple choices. Optional.'
                                }
                            ]}
                            notes={[
                                'Asynchronous - returns immediately',
                                'Thread-safe - concurrent calls block until completion',
                                'Respects MaxApiRequests limit for multi-turn tool execution'
                            ]}
                        />

                        <ApiFunction

                            name="Reset"
                            signature="virtual void Reset(bool bKeepConfiguration = true)"
                            description="Resets the session to a clean state for reuse."
                            parameters={[
                                {
                                    name: 'bKeepConfiguration',
                                    type: 'bool',
                                    description: 'If true, keeps request settings and tools. If false, clears everything.'
                                }
                            ]}
                            notes={[
                                'Always clears conversation messages',
                                'Clears response data and error state',
                                'When true, preserves tools and request parameters'
                            ]}
                        />
                    </ApiFunctionGroup>

                    <h3>Message Management</h3>

                    <p>Messages in conversations have specific roles that determine how the AI interprets them:</p>

                    <EnumReference
                        enumName="EResponsesApiMessageRole"
                        description="Defines the role of a message in the conversation history"
                        values={[
                            {
                                name: "User",
                                description: "Player input, questions, and commands"
                            },
                            {
                                name: "Assistant",
                                description: "AI responses and generated content"
                            },
                            {
                                name: "System",
                                description: "High-priority instructions defining persona and behavior",
                                usage: "Use for core AI personality and behavioral guidelines"
                            },
                            {
                                name: "Developer",
                                description: "Lower-priority technical constraints and guidelines",
                                usage: "Use for implementation details that shouldn't override system instructions"
                            },
                            {
                                name: "Tool",
                                description: "Results from tool executions",
                                usage: "Automatically added by the system when tools are executed"
                            }
                        ]}
                    />


                    <ApiFunctionGroup>
                        <ApiFunction

                            name="AddMessage"
                            signature="void AddMessage(EResponsesApiMessageRole Role, const FString& Text)"
                            description="Generic function to add a message with explicit role specification. Allows adding messages with any role including Developer and Tool."
                            parameters={[
                                {
                                    name: "Role",
                                    type: "EResponsesApiMessageRole",
                                    description: "The message role (User, Assistant, System, Developer, Tool)"
                                },
                                {
                                    name: "Text",
                                    type: "const FString&",
                                    description: "The message text"
                                }
                            ]}
                            example={`Session->AddMessage(
    EResponsesApiMessageRole::Developer,
    TEXT("Keep responses under 100 words.")
);`}
                            notes={[
                                "Use this for Developer messages to add technical constraints",
                                "Tool messages are typically added automatically by the system"
                            ]}
                        />

                        <ApiFunction

                            name="AddUserMessage"
                            signature="void AddUserMessage(const FString& Content)"
                            description="Adds a user message to the conversation history."
                            parameters={[
                                {
                                    name: 'Content',
                                    type: 'FString',
                                    description: 'The message text from the user.'
                                }
                            ]}
                        />

                        <ApiFunction

                            name="AddAssistantMessage"
                            signature="void AddAssistantMessage(const FString& Content)"
                            description="Adds an assistant message to the conversation history. Useful for providing example responses or context."
                            parameters={[
                                {
                                    name: 'Content',
                                    type: 'FString',
                                    description: 'The message text from the assistant.'
                                }
                            ]}
                        />

                        <ApiFunction

                            name="SetSystemMessage"
                            signature="virtual void SetSystemMessage(const FString& Content)"
                            description="Sets the system prompt that guides the AI's behavior and personality."
                            parameters={[
                                {
                                    name: 'Content',
                                    type: 'FString',
                                    description: 'The system instructions.'
                                }
                            ]}
                            notes={[
                                'Replaces any existing system message',
                                'Not all models support system messages'
                            ]}
                        />

                        <ApiFunction

                            name="AddToolResultMessage"
                            signature="virtual void AddToolResultMessage(const FString& ToolCallId, const FString& Result)"
                            description="Adds a tool execution result message to the conversation history. Used to provide tool call results back to the AI."
                            parameters={[
                                {
                                    name: 'ToolCallId',
                                    type: 'FString',
                                    description: 'The unique identifier of the tool call this result corresponds to.'
                                },
                                {
                                    name: 'Result',
                                    type: 'FString',
                                    description: 'The result data from the tool execution.'
                                }
                            ]}
                            notes={[
                                'Typically called automatically by the system when tools are executed',
                                'Used for manual tool execution workflows',
                                'The ToolCallId must match a previous tool call request from the AI'
                            ]}
                        />

                        <ApiFunction

                            name="ClearMessages"
                            signature="virtual void ClearMessages()"
                            description="Removes all messages from the conversation history without affecting configuration."
                        />
                    </ApiFunctionGroup>

                    <h3>Querying Messages</h3>

                    <p>Functions for retrieving and inspecting conversation history:</p>

                    <ApiFunctionGroup>
                        <ApiFunction

                            name="GetMessageCount"
                            signature="int32 GetMessageCount() const"
                            description="Returns the total number of messages in the conversation history."
                            returns={{
                                type: "int32",
                                description: "Count of all messages in the conversation"
                            }}
                            example={`int32 Count = Session->GetMessageCount();
UE_LOG(LogTemp, Log, TEXT("Total messages: %d"), Count);`}
                        />

                        <ApiFunction

                            name="GetMessageText"
                            signature="FString GetMessageText(int32 Index = -1) const"
                            description="Gets the text of a specific message by index. Supports Python-style negative indexing for accessing messages from the end. Defaults to -1 (last message)."
                            parameters={[
                                {
                                    name: "Index",
                                    type: "int32",
                                    description: "Message index (0 = first, -1 = last, -2 = second-to-last, etc.). Defaults to -1."
                                }
                            ]}
                            returns={{
                                type: "FString",
                                description: "Message text at the specified index"
                            }}
                            example={`// Get first message
FString First = Session->GetMessageText(0);

// Get last message (negative indexing)
FString Last = Session->GetMessageText(-1);

// Get second-to-last message
FString SecondLast = Session->GetMessageText(-2);`}
                            notes={[
                                "Negative indices count from the end: -1 is last, -2 is second-to-last, etc.",
                                "Returns empty string if index is out of bounds"
                            ]}
                        />

                        <ApiFunction

                            name="GetMessageRole"
                            signature="EResponsesApiMessageRole GetMessageRole(int32 Index = -1) const"
                            description="Gets the role of a specific message by index. Supports negative indexing. Defaults to -1 (last message)."
                            parameters={[
                                {
                                    name: "Index",
                                    type: "int32",
                                    description: "Message index (supports negative indexing). Defaults to -1."
                                }
                            ]}
                            returns={{
                                type: "EResponsesApiMessageRole",
                                description: "The role of the message (User, Assistant, System, Developer, Tool)"
                            }}
                            example={`EResponsesApiMessageRole Role = Session->GetMessageRole(-1);
if (Role == EResponsesApiMessageRole::User)
{
    UE_LOG(LogTemp, Log, TEXT("Last message was from user"));
}`}
                        />

                        <ApiFunction

                            name="GetMessagesByRole"
                            signature="TArray<FString> GetMessagesByRole(EResponsesApiMessageRole Role) const"
                            description="Retrieves all messages matching a specific role from the conversation history."
                            parameters={[
                                {
                                    name: "Role",
                                    type: "EResponsesApiMessageRole",
                                    description: "The role to filter by"
                                }
                            ]}
                            returns={{
                                type: "TArray<FString>",
                                description: "Array of message texts with the specified role"
                            }}
                            example={`// Get all user messages
TArray<FString> UserMessages =
    Session->GetMessagesByRole(EResponsesApiMessageRole::User);

for (const FString& Msg : UserMessages)
{
    UE_LOG(LogTemp, Log, TEXT("User said: %s"), *Msg);
}`}
                            notes={[
                                "Useful for analyzing conversation patterns",
                                "Returns empty array if no messages match the role"
                            ]}
                        />

                        <ApiFunction

                            name="CountMessagesByRole"
                            signature="int32 CountMessagesByRole(EResponsesApiMessageRole Role) const"
                            description="Counts the number of messages with a specific role in the conversation."
                            parameters={[
                                {
                                    name: "Role",
                                    type: "EResponsesApiMessageRole",
                                    description: "The role to count"
                                }
                            ]}
                            returns={{
                                type: "int32",
                                description: "Number of messages with that role"
                            }}
                            example={`int32 UserCount =
    Session->CountMessagesByRole(EResponsesApiMessageRole::User);
UE_LOG(LogTemp, Log, TEXT("User has sent %d messages"), UserCount);`}
                        />

                        <ApiFunction

                            name="GetLastMessageText"
                            signature="FString GetLastMessageText(EResponsesApiMessageRole RoleFilter = EResponsesApiMessageRole::None) const"
                            description="Gets the text of the most recent message, optionally filtered by role. If no role is specified, returns the very last message regardless of role."
                            parameters={[
                                {
                                    name: "RoleFilter",
                                    type: "EResponsesApiMessageRole",
                                    description: "Optional role filter. Use EResponsesApiMessageRole::None (default) to get the last message of any role."
                                }
                            ]}
                            returns={{
                                type: "FString",
                                description: "Text of the last message with that role"
                            }}
                            example={`// Get last message of any role
FString LastMsg = Session->GetLastMessageText();

// Get last user message specifically
FString LastUserMsg =
    Session->GetLastMessageText(EResponsesApiMessageRole::User);
UE_LOG(LogTemp, Log, TEXT("Last user message: %s"), *LastUserMsg);`}
                            notes={[
                                "Returns empty string if no messages exist or no messages match the role filter",
                                "More efficient than getting all messages and taking the last one",
                                "Use EResponsesApiMessageRole::None or no parameter to get the very last message"
                            ]}
                        />

                        <ApiFunction

                            name="GetRole"
                            signature="EResponsesApiMessageRole GetRole(int32 MessageIndex = -1, EResponsesApiMessageRole RoleFilter = EResponsesApiMessageRole::None) const"
                            description="Gets the role of a message by index, optionally filtering to only return if the message matches a specific role. Returns EResponsesApiMessageRole::None if filtering is used and the message doesn't match."
                            parameters={[
                                {
                                    name: "MessageIndex",
                                    type: "int32",
                                    description: "Message index (supports negative indexing). Defaults to -1."
                                },
                                {
                                    name: "RoleFilter",
                                    type: "EResponsesApiMessageRole",
                                    description: "Optional role filter. If specified, returns the role only if it matches this filter, otherwise returns None."
                                }
                            ]}
                            returns={{
                                type: "EResponsesApiMessageRole",
                                description: "The message role, or None if index is invalid or doesn't match filter"
                            }}
                            example={`// Get role of last message
EResponsesApiMessageRole LastRole = Session->GetRole();

// Verify the first message is a system message
EResponsesApiMessageRole FirstRole = Session->GetRole(0,
    EResponsesApiMessageRole::System);
if (FirstRole != EResponsesApiMessageRole::None)
{
    UE_LOG(LogTemp, Log, TEXT("First message is system message"));
}`}
                            notes={[
                                "Returns EResponsesApiMessageRole::None if message doesn't exist or doesn't match filter",
                                "Use without RoleFilter parameter to get the actual role regardless of type",
                                "Useful for validating expected message roles at specific positions"
                            ]}
                        />

                        <ApiFunction

                            name="GetText"
                            signature="FString GetText(int32 MessageIndex = -1, EResponsesApiMessageRole RoleFilter = EResponsesApiMessageRole::None) const"
                            description="Gets message text by index, optionally filtering by role. If role filter is None, returns the message at that index regardless of role. If role is specified, returns text only if the message matches that role."
                            parameters={[
                                {
                                    name: "MessageIndex",
                                    type: "int32",
                                    description: "Message index (supports negative indexing). Defaults to -1."
                                },
                                {
                                    name: "RoleFilter",
                                    type: "EResponsesApiMessageRole",
                                    description: "Optional role filter. Use EResponsesApiMessageRole::None (default) for no filtering."
                                }
                            ]}
                            returns={{
                                type: "FString",
                                description: "Message text if it matches the role, empty string otherwise"
                            }}
                            example={`// Get last message regardless of role
FString LastMsg = Session->GetText();

// Get system prompt (typically at index 0) with role verification
FString SystemPrompt = Session->GetText(0,
    EResponsesApiMessageRole::System);

// Get second message only if it's from user
FString SecondUser = Session->GetText(1,
    EResponsesApiMessageRole::User);`}
                            notes={[
                                "Returns empty string if message doesn't exist or doesn't match the role filter",
                                "Use EResponsesApiMessageRole::None (default) to skip role filtering",
                                "Useful for safely retrieving messages at specific positions with type validation"
                            ]}
                        />
                    </ApiFunctionGroup>

                    <h3>Tool Management</h3>

                    <ApiFunctionGroup>
                        <ApiFunction

                            name="AddToolInstance"
                            signature="virtual void AddToolInstance(UGAiTool* Tool)"
                            description="Adds an existing tool instance to the session."
                            parameters={[
                                {
                                    name: 'Tool',
                                    type: 'UGAiTool*',
                                    description: 'The tool instance to add.'
                                }
                            ]}
                        />

                        <ApiFunction

                            name="AddToolInstances"
                            signature="virtual void AddToolInstances(const TArray<UGAiTool*>& Tools)"
                            description="Adds multiple existing tool instances to the session in a single call."
                            parameters={[
                                {
                                    name: 'Tools',
                                    type: 'const TArray<UGAiTool*>&',
                                    description: 'Array of tool instances to add.'
                                }
                            ]}
                            example={`TArray<UGAiTool*> Tools = { Tool1, Tool2, Tool3 };
Session->AddToolInstances(Tools);`}
                        />

                        <ApiFunction

                            name="AddToolByClass"
                            signature="virtual void AddToolByClass(TSubclassOf<UGAiTool> ToolClass)"
                            description="Creates and adds a tool from its class type."
                            parameters={[
                                {
                                    name: 'ToolClass',
                                    type: 'TSubclassOf<UGAiTool>',
                                    description: 'The tool class to instantiate.'
                                }
                            ]}
                            example={`Session->AddToolByClass(UMyCustomTool::StaticClass());`}
                        />

                        <ApiFunction

                            name="ClearTools"
                            signature="virtual void ClearTools()"
                            description="Removes all tools from the session."
                        />

                        <ApiFunction

                            name="FindToolByName"
                            signature="virtual UGAiTool* FindToolByName(const FName& Name) const"
                            description="Finds a tool by its registered name."
                            parameters={[
                                {
                                    name: 'Name',
                                    type: 'FName',
                                    description: 'The name of the tool to find.'
                                }
                            ]}
                            returns={{
                                type: 'UGAiTool*',
                                description: 'The tool instance, or nullptr if not found.'
                            }}
                        />

                        <ApiFunction

                            name="GetTools"
                            signature="virtual TArray<UGAiTool*> GetTools() const"
                            description="Returns all tools currently registered in the session."
                            returns={{
                                type: 'TArray<UGAiTool*>',
                                description: 'Array of all tool instances.'
                            }}
                        />

                        <ApiFunction

                            name="HasTool"
                            signature="virtual bool HasTool(const FName& ToolName) const"
                            description="Checks if a tool with the given name is registered in the session."
                            parameters={[
                                {
                                    name: 'ToolName',
                                    type: 'FName',
                                    description: 'The name of the tool to check.'
                                }
                            ]}
                            returns={{
                                type: 'bool',
                                description: 'True if the tool exists, false otherwise.'
                            }}
                        />
                    </ApiFunctionGroup>

                    <h3>Response Access</h3>

                    <ApiFunctionGroup>
                        <ApiFunction

                            name="GetAggregatedResponseText"
                            signature="virtual FString GetAggregatedResponseText() const"
                            description="Returns the complete generated text from the most recent generation."
                            returns={{
                                type: 'FString',
                                description: 'The full response text.'
                            }}
                            notes={[
                                'Returns empty string if no response yet',
                                'For streaming, returns accumulated text'
                            ]}
                        />

                        <ApiFunction

                            name="GetCurrentStreamChunkText"
                            signature="virtual FString GetCurrentStreamChunkText() const"
                            description="Returns the text from the current streaming chunk. Only valid during OnStreamChunk callback."
                            returns={{
                                type: 'FString',
                                description: 'The current chunk text.'
                            }}
                        />

                        <ApiFunction

                            name="GetTotalTokensUsed"
                            signature="virtual int32 GetTotalTokensUsed() const"
                            description="Returns the total token count from the most recent generation (input + output tokens)."
                            returns={{
                                type: 'int32',
                                description: 'Total tokens used.'
                            }}
                        />
                    </ApiFunctionGroup>

                    <h3>Error Handling</h3>

                    <ApiFunctionGroup>
                        <ApiFunction

                            name="HasError"
                            signature="bool HasError() const"
                            description="Checks if an error occurred during the last generation."
                            returns={{
                                type: 'bool',
                                description: 'True if an error occurred.'
                            }}
                        />

                        <ApiFunction

                            name="GetErrorMessage"
                            signature="FString GetErrorMessage() const"
                            description="Returns the error message from the last failed generation."
                            returns={{
                                type: 'FString',
                                description: 'The error message, or empty string if no error.'
                            }}
                        />

                        <ApiFunction

                            name="ClearError"
                            signature="void ClearError()"
                            description="Clears the current error state."
                        />
                    </ApiFunctionGroup>

                    <h3>Validation</h3>

                    <ApiFunctionGroup>
                        <ApiFunction

                            name="HasResponse"
                            signature="virtual bool HasResponse() const"
                            description="Checks if the session has received a valid response from the last generation."
                            returns={{
                                type: 'bool',
                                description: 'True if a response is available.'
                            }}
                        />

                        <ApiFunction

                            name="IsValidForGeneration"
                            signature="virtual bool IsValidForGeneration() const"
                            description="Checks if the session is properly configured and ready to generate."
                            returns={{
                                type: 'bool',
                                description: 'True if ready to generate.'
                            }}
                        />

                        <ApiFunction

                            name="ExpectsStructuredOutput"
                            signature="virtual bool ExpectsStructuredOutput() const"
                            description="Checks if the session is configured to expect structured JSON output based on a schema."
                            returns={{
                                type: 'bool',
                                description: 'True if structured output is configured.'
                            }}
                            notes={[
                                'Returns true when a JSON schema has been configured for response validation',
                                'Used internally to determine if response parsing should occur'
                            ]}
                        />

                        <ApiFunction

                            name="GetExpectedSchemeName"
                            signature="virtual FName GetExpectedSchemeName()"
                            description="Returns the name of the JSON schema configured for structured output, if any."
                            returns={{
                                type: 'FName',
                                description: 'The schema name, or NAME_None if no schema is configured.'
                            }}
                            notes={[
                                'Only relevant when ExpectsStructuredOutput() returns true',
                                'Schema name corresponds to registered schemas in the schema cache'
                            ]}
                        />
                    </ApiFunctionGroup>

                    <h2>Next Steps</h2>

                    <ul>
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
