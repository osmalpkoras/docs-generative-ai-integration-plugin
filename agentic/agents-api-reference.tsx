import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Agents API Reference',
    description: 'Complete API reference for UGAiAgent and agentic workflows',
    order: 304,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import {
    Callout,
    LanguageToggleProvider,
    LanguageToggle,
    ApiFunction,
    ApiProperty,
    ApiFunctionGroup,
    ApiPropertyGroup,
    EnumReference,
} from '@/components/doc-components';
import { LINK } from '@/lib/pages.generated';

export default function AgentsApiReferencePage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <h2>UGAiAgent Class</h2>

                    <p>
                        The <code>UGAiAgent</code> class provides autonomous AI execution with tool calling, multi-agent
                        collaboration, and iterative reasoning. Agents build on top of sessions to provide high-level
                        agentic workflows.
                    </p>

                    <h3>Properties</h3>

                    <ApiPropertyGroup>
                        <ApiProperty
                            name="SystemPrompt"
                            type="FString"
                            description="Instructions defining the agent's role, behavior, and available tools. This guides the agent's decision-making throughout execution."
                            notes={[
                                'Define clear role and expertise',
                                'List available tools and when to use them',
                                'Specify output format and constraints'
                            ]}
                        />

                        <ApiProperty
                            name="EndpointConfiguration"
                            type="TSoftObjectPtr<UGAiEndpointConfig>"
                            description="The endpoint configuration specifying which AI provider to use, API keys, model selection, and connection settings."
                        />

                        <ApiProperty
                            name="MaxApiRequests"
                            type="int32"
                            description="Maximum number of API requests allowed during a single Prompt() execution. Prevents infinite loops and controls cost."
                            notes={[
                                'Default: 10',
                                'Each tool execution counts as an iteration',
                                'Agent terminates when limit is reached',
                                'Use terminating tools for early exit'
                            ]}
                        />

                        <ApiProperty
                            name="BackendType"
                            type="EGAiAgentBackendType"
                            description="Specifies which API backend to use (ResponsesApi or CompletionsApi)."
                            notes={[
                                'ResponsesApi: Modern API with hosted tools and MCP (default)',
                                'CompletionsApi: OpenAI-compatible API for broad provider support'
                            ]}
                        />

                        <ApiProperty
                            name="bLogToolCalls"
                            type="bool"
                            description="If true, logs all tool calls and results to the console for debugging."
                        />
                    </ApiPropertyGroup>

                    <h3>Callback Delegates</h3>

                    <ApiPropertyGroup>
                        <ApiProperty
                            name="FOnAgentComplete"
                            type="DECLARE_DELEGATE_OneParam(FOnAgentComplete, UGAiAgent*)"
                            description="Callback invoked when agent execution completes successfully. Called on the game thread."
                            notes={[
                                'Signature: void Callback(UGAiAgent* Agent)',
                                'Use Agent->GetLastResult() to access execution result',
                                'Called even if agent terminated early via terminating tool',
                                'Optional with default parameter in Prompt()'
                            ]}
                        />

                        <ApiProperty
                            name="FOnAgentError"
                            type="DECLARE_DELEGATE_OneParam(FOnAgentError, UGAiAgent*)"
                            description="Callback invoked when agent execution fails. Called on the game thread."
                            notes={[
                                'Signature: void Callback(UGAiAgent* Agent)',
                                'Use Agent->GetLastResult().ErrorMessage for error details',
                                'Can occur due to API errors, tool failures, configuration issues, or network problems',
                                'Optional with default parameter in Prompt()'
                            ]}
                        />

                        <ApiProperty
                            name="FOnAgentToolCall"
                            type="DECLARE_DELEGATE_RetVal_TwoParams(FToolExecutionResult, FOnAgentToolCall, UGAiAgent*, const FUnifiedToolCall&)"
                            description="Callback invoked each time a tool is executed during the agent loop. Called on the game thread."
                            notes={[
                                'Signature: FToolExecutionResult Callback(UGAiAgent* Agent, const FUnifiedToolCall& ToolCall)',
                                'Return value allows overriding tool execution (advanced)',
                                'Called for both regular tools and sub-agent invocations',
                                'Useful for logging, debugging, and progress monitoring',
                                'Optional with default parameter in Prompt()'
                            ]}
                        />
                    </ApiPropertyGroup>

                    <h3>Core Methods</h3>

                    <ApiFunctionGroup>
                        <ApiFunction
                            name="Prompt"
                            signature={`void Prompt(
    const FString& UserPrompt,
    const FOnAgentComplete& OnComplete = FOnAgentComplete(),
    const FOnAgentError& OnError = FOnAgentError(),
    const FOnAgentToolCall& OnToolCall = FOnAgentToolCall()
)`}
                            description="Executes the agent with the given prompt. The agent enters an agentic loop (up to MaxApiRequests iterations), sending requests to the LLM, executing tools and sub-agents, until completion. Execution is asynchronous - delegates are called on the game thread."
                            parameters={[
                                {
                                    name: 'UserPrompt',
                                    type: 'const FString&',
                                    description: 'The user message or task to execute'
                                },
                                {
                                    name: 'OnComplete',
                                    type: 'FOnAgentComplete',
                                    description: 'Called when execution succeeds. Receives the agent instance. Optional with default.'
                                },
                                {
                                    name: 'OnError',
                                    type: 'FOnAgentError',
                                    description: 'Called when execution fails. Receives the agent instance. Optional with default.'
                                },
                                {
                                    name: 'OnToolCall',
                                    type: 'FOnAgentToolCall',
                                    description: 'Called after each tool execution with tool call details. Optional with default.'
                                }
                            ]}
                            notes={[
                                'Asynchronous - returns immediately',
                                'Protected by critical section - concurrent calls will block',
                                'Maintains conversation history across calls',
                                'Tools and sub-agents are executed automatically'
                            ]}
                        />

                        <ApiFunction
                            name="ResetSession"
                            signature="void ResetSession()"
                            description="Clears the conversation history while preserving agent configuration, tools, and endpoint settings."
                            notes={[
                                'Conversation history is cleared',
                                'Tools remain registered',
                                'System prompt and configuration are preserved',
                                'Next Prompt() call starts fresh'
                            ]}
                        />

                        <ApiFunction
                            name="GetSession"
                            signature="UGAiSession* GetSession() const"
                            description="Returns the underlying session object used by the agent."
                            returns={{
                                type: 'UGAiSession*',
                                description: 'The session instance (UGAiResponsesApiSession or UGAiCompletionsApiSession)'
                            }}
                            notes={[
                                'Session type depends on BackendType',
                                'Provides access to low-level session configuration',
                                'Use for advanced session manipulation'
                            ]}
                        />

                        <ApiFunction
                            name="GetLastResult"
                            signature="const FGAiAgentRunResult& GetLastResult() const"
                            description="Returns the result from the most recent agent execution."
                            returns={{
                                type: 'FGAiAgentRunResult',
                                description: 'Complete execution result with status, response text, and metadata'
                            }}
                            notes={[
                                'Check IsSuccess() before using result',
                                'Contains error information if failed',
                                'Includes reference to responding agent and terminating tool (if any)'
                            ]}
                        />

                        <ApiFunction
                            name="GetToolName"
                            signature="virtual FName GetToolName() const"
                            description="Returns the name of this agent for use as a sub-agent tool."
                            returns={{
                                type: 'FName',
                                description: 'Agent name (derived from class name or custom override)'
                            }}
                            notes={[
                                'Used when agent is added as sub-agent',
                                'Override to provide custom agent names',
                                'Appears in tool calls and logs'
                            ]}
                        />
                    </ApiFunctionGroup>

                    <h3>Tool Management</h3>

                    <ApiFunctionGroup>
                        <ApiFunction
                            name="AddTool"
                            signature="void AddTool(UGAiTool* Tool, bool bIsTerminating = false)"
                            description="Adds an existing tool instance to the agent with optional terminating behavior."
                            parameters={[
                                {
                                    name: 'Tool',
                                    type: 'UGAiTool*',
                                    description: 'The tool instance to add (must be valid)'
                                },
                                {
                                    name: 'bIsTerminating',
                                    type: 'bool',
                                    description: 'If true, calling this tool terminates the agent loop immediately'
                                }
                            ]}
                            notes={[
                                'Tool must be a valid UObject',
                                'Terminating tools execute normally but stop the loop after execution',
                                'Use for final actions (e.g., submit_form, send_email) or early exits'
                            ]}
                        />

                        <ApiFunction
                            name="AddToolByClass"
                            signature="void AddToolByClass(TSubclassOf<UGAiTool> ToolClass, bool bIsTerminating = false)"
                            description="Creates and adds a tool from its class type."
                            parameters={[
                                {
                                    name: 'ToolClass',
                                    type: 'TSubclassOf<UGAiTool>',
                                    description: 'The tool class to instantiate'
                                },
                                {
                                    name: 'bIsTerminating',
                                    type: 'bool',
                                    description: 'If true, agent terminates immediately when this tool is called'
                                }
                            ]}
                            example={`Agent->AddToolByClass(UCalculateAverageTool::StaticClass());

// Add as terminating tool
Agent->AddToolByClass(USubmitFormTool::StaticClass(), true);`}
                        />

                        <ApiFunction
                            name="AddAgent"
                            signature={`void AddAgent(
    UGAiAgent* SubAgent,
    EGAiAgentInteractionMode InteractionMode,
    EGAiAgentHistoryMode HistoryMode = EGAiAgentHistoryMode::NoHistory
)`}
                            description="Adds another agent as a sub-agent that can be called like a tool."
                            parameters={[
                                {
                                    name: 'SubAgent',
                                    type: 'UGAiAgent*',
                                    description: 'The agent to add as a sub-agent'
                                },
                                {
                                    name: 'InteractionMode',
                                    type: 'EGAiAgentInteractionMode',
                                    description: 'Delegation (returns control) or Handoff (transfers control)'
                                },
                                {
                                    name: 'HistoryMode',
                                    type: 'EGAiAgentHistoryMode',
                                    description: 'NoHistory (fresh context) or FullHistory (inherit conversation)'
                                }
                            ]}
                            notes={[
                                'Enables multi-agent collaboration',
                                'Sub-agent appears as callable tool',
                                'Delegation: sub-agent returns control after completion',
                                'Handoff: sub-agent takes over permanently',
                                'History mode controls context sharing'
                            ]}
                        />

                        <ApiFunction
                            name="ClearTools"
                            signature="void ClearTools()"
                            description="Removes all tools and sub-agents from the agent."
                            notes={[
                                'Clears both tools and sub-agents',
                                'Does not affect conversation history',
                                'Useful for reconfiguring agent capabilities'
                            ]}
                        />

                        <ApiFunction
                            name="FindToolByName"
                            signature="UGAiTool* FindToolByName(const FName& Name) const"
                            description="Finds a tool by its registered name."
                            parameters={[
                                {
                                    name: 'Name',
                                    type: 'FName',
                                    description: 'The tool name to search for'
                                }
                            ]}
                            returns={{
                                type: 'UGAiTool*',
                                description: 'The tool instance, or nullptr if not found'
                            }}
                        />
                    </ApiFunctionGroup>

                    <h3>Result Structure</h3>

                    <p>
                        The <code>FGAiAgentRunResult</code> struct contains the outcome of agent execution:
                    </p>

                    <ApiPropertyGroup>
                        <ApiProperty
                            name="Result"
                            type="FString"
                            description="The final response text from the agent. Contains the aggregated response from the LLM."
                            notes={[
                                'Empty if error occurred',
                                'Check IsSuccess() or ErrorMessage.IsEmpty() before using'
                            ]}
                        />

                        <ApiProperty
                            name="ErrorMessage"
                            type="FString"
                            description="Error description if execution failed."
                            notes={[
                                'Empty if successful',
                                'Contains detailed error information'
                            ]}
                        />

                        <ApiProperty
                            name="RespondingAgent"
                            type="UGAiAgent*"
                            description="The agent that produced the final response. Can differ from the initial agent in handoff scenarios."
                            notes={[
                                'Same as calling agent in delegation mode',
                                'Points to sub-agent in handoff mode',
                                'Never null if successful'
                            ]}
                        />

                        <ApiProperty
                            name="TerminatingTool"
                            type="UGAiTool*"
                            description="The terminating tool that stopped execution, or nullptr if agent completed naturally."
                            notes={[
                                'Null for natural completion',
                                'Non-null when terminating tool was called',
                                'Useful for determining exit reason'
                            ]}
                        />
                    </ApiPropertyGroup>

                    <Callout type="info" title="Checking Results">
                        <p>
                            Always check <code>Result.IsSuccess()</code> or <code>ErrorMessage.IsEmpty()</code> before using
                            the result text. The <code>RespondingAgent</code> field is useful in multi-agent scenarios
                            to identify which agent produced the response.
                        </p>
                    </Callout>

                    <h3>Enumerations</h3>

                    <EnumReference
                        enumName="EGAiAgentBackendType"
                        description="Specifies which API backend the agent uses"
                        values={[
                            {
                                name: "ResponsesApi",
                                description: "Modern Responses API with hosted tools and MCP integration (recommended)",
                                usage: "Default choice for new projects using OpenAI or Anthropic"
                            },
                            {
                                name: "CompletionsApi",
                                description: "OpenAI-compatible Completions API for broad provider support",
                                usage: "Use for providers like Gemini, Ollama, or vLLM"
                            }
                        ]}
                    />

                    <EnumReference
                        enumName="EGAiAgentInteractionMode"
                        description="Controls how sub-agents interact with calling agents"
                        values={[
                            {
                                name: "Delegation",
                                description: "Sub-agent executes and returns control to caller",
                                usage: "Use for task-specific specialists that provide results back to the main agent"
                            },
                            {
                                name: "Handoff",
                                description: "Control permanently transfers to sub-agent",
                                usage: "Use for routing scenarios where specialist takes over completely"
                            }
                        ]}
                    />

                    <EnumReference
                        enumName="EGAiAgentHistoryMode"
                        description="Controls conversation history sharing with sub-agents"
                        values={[
                            {
                                name: "NoHistory",
                                description: "Sub-agent starts with fresh context",
                                usage: "Use for isolated tasks like formatting, validation, or simple calculations"
                            },
                            {
                                name: "FullHistory",
                                description: "Sub-agent receives complete conversation history from caller",
                                usage: "Use for context-dependent tasks like summarization, continuation, or analysis"
                            }
                        ]}
                    />

                    <h2>Next Steps</h2>

                    <ul>
                        <li><a href={LINK.GENERATIVE_AI.AGENTIC.USING_AGENTS}>Using Agents</a> - Practical guide to creating and using agents</li>
                        <li><a href={LINK.GENERATIVE_AI.AGENTIC.MCP_SERVER}>MCP Server</a> - Connect to external tool providers</li>
                        <li><a href={LINK.GENERATIVE_AI.FEATURES.TOOLS}>Creating Tools</a> - Tool implementation guide</li>
                    </ul>

                    <PageFooter />
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}
