import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Using Agents',
    description: 'Create and configure autonomous AI agents with tools and sub-agents',
    order: 300,
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
    Step,
    StepList,
} from '@/components/doc-components';
import { LINK } from '@/lib/pages.generated';

export default function UsingAgentsPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <h2>What is an Agent?</h2>

                    <p>
                        Agents are autonomous AI systems built on top of sessions that can use tools, call other agents,
                        and execute multi-step workflows. Unlike sessions which handle single request/response cycles,
                        agents manage complex reasoning loops automatically.
                    </p>

                    <Callout type="info" title="Agent vs Session">
                        <p>
                            <strong>Sessions</strong> are low-level API wrappers for single request/response cycles. <strong>Agents</strong> are high-level autonomous systems that can reason iteratively,
                            use tools, and coordinate with other agents.
                        </p>
                    </Callout>

                    <h2>The Agentic Loop</h2>

                    <p>
                        When you call <code>Agent-&gt;Prompt()</code>, the agent enters an autonomous execution loop
                        that continues until completion. This loop enables the agent to reason iteratively, use tools,
                        and accomplish complex multi-step tasks.
                    </p>

                    <StepList>
                        <Step title="Send User Message">
                            <p>
                                The agent sends your message (and any conversation history) to the LLM, along with
                                information about available tools.
                            </p>
                        </Step>

                        <Step title="LLM Responds">
                            <p>
                                The LLM analyzes the request and responds with either:
                            </p>
                            <ul>
                                <li><strong>Text response</strong>: A direct answer or explanation</li>
                                <li><strong>Tool calls</strong>: One or more tools it wants to execute</li>
                                <li><strong>Both</strong>: Text reasoning followed by tool calls</li>
                            </ul>
                        </Step>

                        <Step title="Execute Tools">
                            <p>
                                If the LLM requested tool calls, the agent automatically executes them and collects
                                the results. Tool results are added to the conversation as tool-role messages.
                            </p>
                        </Step>

                        <Step title="Continue or Complete">
                            <p>
                                The agent determines whether to continue the loop:
                            </p>
                            <ul>
                                <li><strong>Continue</strong>: If tools were executed, send their results back to the LLM (return to step 2)</li>
                                <li><strong>Complete</strong>: If any completion condition is met (see below)</li>
                            </ul>
                        </Step>
                    </StepList>

                    <h3>Completion Conditions</h3>

                    <p>The agent loop terminates when one of the following occurs:</p>

                    <ul>
                        <li><strong>Natural Completion</strong>: The LLM returns a response without requesting any tool calls</li>
                        <li><strong>Max Iterations Reached</strong>: The number of API requests reaches <code>MaxApiRequests</code></li>
                        <li><strong>Terminating Tool Called</strong>: A tool marked as terminating is executed</li>
                    </ul>

                    <Callout type="warning" title="Loop Control">
                        <p>
                            Set <code>MaxApiRequests</code> appropriately to prevent excessive iterations and cost.
                            Each iteration through the loop counts as one API request. Use terminating tools to exit
                            early when the agent has completed its objective.
                        </p>
                    </Callout>

                    <h3>Multi-Agent Loops</h3>

                    <p>When agents call other agents (sub-agents), the loop behavior depends on the interaction mode:</p>

                    <ul>
                        <li>
                            <strong>Delegation</strong>: The sub-agent runs its own complete loop independently.
                            When it finishes, control returns to the calling agent with the sub-agent's result.
                            The calling agent's loop continues.
                        </li>
                        <li>
                            <strong>Handoff</strong>: Control of the loop is permanently transferred to the sub-agent.
                            The calling agent terminates, and the sub-agent's loop produces the final result.
                        </li>
                    </ul>

                    <Example>
                        <ExampleTitle>Agent Loop in Action</ExampleTitle>
                        <ExampleContent>
                            Here's what happens during a typical agent execution with tools:
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Agent configured with calculate_average and analyze_stats tools
Agent->MaxApiRequests = 10;
Agent->Prompt(TEXT("Analyze damage values: [10, 15, 20, 25, 30]"));

// === Loop Iteration 1 ===
// User: "Analyze damage values: [10, 15, 20, 25, 30]"
// LLM: "I'll calculate statistics for these values."
//      -> Calls: calculate_average([10, 15, 20, 25, 30])
// Tool Result: "Average: 20.0"
// (Loop continues because tool was called)

// === Loop Iteration 2 ===
// Tool message: "Average: 20.0"
// LLM: "The average is 20. Now let me analyze the distribution."
//      -> Calls: analyze_stats([10, 15, 20, 25, 30])
// Tool Result: "StdDev: 7.07, Range: 20"
// (Loop continues because tool was called)

// === Loop Iteration 3 ===
// Tool message: "StdDev: 7.07, Range: 20"
// LLM: "Analysis complete. Average damage is 20 with moderate variance..."
//      -> No tool calls
// (Loop completes naturally - no tools requested)

// OnComplete callback fires with final response`}
                        </ExampleCpp>
                    </Example>

                    <h2>Creating Agents</h2>

                    <p>
                        Now that you understand the agentic loop, let's create your first agent.
                    </p>

                    <Example>
                        <ExampleTitle>Basic Agent Setup</ExampleTitle>
                        <ExampleContent>
                            Create an agent by instantiating <code>UGAiAgent</code> and configuring its core properties.
                            The agent will handle the agentic loop automatically when you call <code>Prompt()</code>.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "GenerativeAi/GAiAgent.h"

// Create agent instance
UGAiAgent* Agent = NewObject<UGAiAgent>();

// Configure agent
Agent->SystemPrompt = TEXT("You are a helpful game development assistant.");
Agent->EndpointConfiguration = EndpointConfig;  // Your UGAiEndpointConfig asset
Agent->MaxApiRequests = 10;  // Allow up to 10 reasoning iterations

// Execute agent
Agent->Prompt(
    TEXT("Help me design a crafting system"),
    
    // On completion
    FOnAgentComplete::CreateLambda([](const FGAiAgentRunResult& Result)
    {
        UE_LOG(LogTemp, Log, TEXT("Agent: %s"), *Result.Result);
    }),
    
    // On error
    FOnAgentError::CreateLambda([](const FGAiAgentRunResult& Result)
    {
        UE_LOG(LogTemp, Error, TEXT("Error: %s"), *Result.ErrorMessage);
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <p>
                        Tools extend agent capabilities by allowing them to perform actions, query data, or interact
                        with your game. The agent decides when and how to use tools based on the task.
                    </p>

                    <Example>
                        <ExampleTitle>Register Custom Tools</ExampleTitle>
                        <ExampleContent>
                            Add tools to your agent using <code>AddToolByClass()</code> or <code>AddToolInstance()</code>.
                            The agent will automatically call these tools during execution as needed.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Define a custom tool
UCLASS()
class UCalculateAverageTool : public UGAiTool
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, Category = "Params",
              meta = (ToolTip = "Array of numbers to average"))
    TArray<float> Values;

    virtual FToolExecutionResult OnCalled_Implementation() override
    {
        if (Values.Num() == 0)
        {
            return FToolExecutionResult::Error(TEXT("Empty array"));
        }

        float Sum = 0.0f;
        for (float Val : Values)
        {
            Sum += Val;
        }
        float Average = Sum / Values.Num();

        return FToolExecutionResult::Success(
            FString::Printf(TEXT("%.2f"), Average)
        );
    }
};

// Add tool to agent
Agent->AddToolByClass(UCalculateAverageTool::StaticClass());

// Or add a tool instance
UCalculateAverageTool* ToolInstance = NewObject<UCalculateAverageTool>();
Agent->AddToolInstance(ToolInstance);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Multiple Tools</ExampleTitle>
                        <ExampleContent>
                            Agents can use multiple tools in a single execution. The AI decides which tools to call
                            and in what order based on the task requirements.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Agent->SystemPrompt = TEXT(
    "You are a data analyst. Use tools to perform calculations and provide insights."
);

// Add multiple analysis tools
Agent->AddToolByClass(UCalculateAverageTool::StaticClass());
Agent->AddToolByClass(UCalculateStandardDeviationTool::StaticClass());
Agent->AddToolByClass(UFindOutliersTool::StaticClass());

// Agent can use any combination of these tools
Agent->Prompt(
    TEXT("Analyze this damage data: [45, 52, 38, 61, 48, 50]"),
    OnComplete, OnError
);`}
                        </ExampleCpp>
                    </Example>

                    <h3>Terminating Tools</h3>

                    <p>
                        Terminating tools stop the agent loop when called, useful for final actions or early exits.
                    </p>

                    <Example>
                        <ExampleTitle>Configure Terminating Tool</ExampleTitle>
                        <ExampleContent>
                            When a terminating tool is called, the agent immediately stops execution and returns,
                            even if <code>MaxApiRequests</code> hasn't been reached.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Define a terminating action
UCLASS()
class USubmitFormTool : public UGAiTool
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, Category = "Params")
    FString FormData;

    virtual FToolExecutionResult OnCalled_Implementation() override
    {
        bool bSuccess = SubmitToServer(FormData);
        
        if (bSuccess)
        {
            return FToolExecutionResult::Success(TEXT("Form submitted"));
        }
        return FToolExecutionResult::Error(TEXT("Submission failed"));
    }
};

// Add as terminating tool
Agent->AddTool(SubmitTool, true);  // bIsTerminating = true

// Check if agent terminated via tool
Agent->Prompt(
    TEXT("Fill out the form and submit it"),
    FOnAgentComplete::CreateLambda([](const FGAiAgentRunResult& Result)
    {
        if (Result.TerminatingTool != nullptr)
        {
            UE_LOG(LogTemp, Log, TEXT("Terminated by: %s"),
                *Result.TerminatingTool->GetToolName().ToString());
        }
    }),
    OnError
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Setting Up Sub-Agents</h2>

                    <p>
                        Agents can call other agents as if they were tools, enabling multi-agent collaboration.
                        There are two interaction modes: <strong>Delegation</strong> and <strong>Handoff</strong>.
                    </p>

                    <h3>Delegation Mode</h3>

                    <p>
                        The sub-agent executes its task and returns control to the calling agent. Use this for
                        specialized tasks where you need the result back.
                    </p>

                    <Example>
                        <ExampleTitle>Delegate to Specialist Agent</ExampleTitle>
                        <ExampleContent>
                            Create specialized agents for specific tasks. The main agent delegates work and receives
                            results to incorporate into its reasoning.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Create specialist agent
UGAiAgent* AnalystAgent = NewObject<UGAiAgent>();
AnalystAgent->SystemPrompt = TEXT(
    "You analyze game data and return statistical insights."
);
AnalystAgent->EndpointConfiguration = EndpointConfig;

// Add analysis tools to specialist
AnalystAgent->AddToolByClass(UCalculateStatsTool::StaticClass());

// Create main coordinating agent
UGAiAgent* MainAgent = NewObject<UGAiAgent>();
MainAgent->SystemPrompt = TEXT(
    "You coordinate tasks. Use data_analyst to analyze numerical data."
);
MainAgent->EndpointConfiguration = EndpointConfig;

// Add specialist as sub-agent with delegation
MainAgent->AddAgent(
    AnalystAgent,
    EGAiAgentInteractionMode::Delegation,  // Returns control
    EGAiAgentHistoryMode::NoHistory        // Fresh context each call
);

// Main agent can delegate to specialist
MainAgent->Prompt(
    TEXT("Analyze player stats and suggest balance changes"),
    OnComplete, OnError
);`}
                        </ExampleCpp>
                    </Example>

                    <h3>Handoff Mode</h3>

                    <p>
                        Control is permanently transferred to the sub-agent. The calling agent terminates and the
                        sub-agent produces the final response. Use this for routing scenarios.
                    </p>

                    <Example>
                        <ExampleTitle>Route to Specialist Agent</ExampleTitle>
                        <ExampleContent>
                            Create a router agent that analyzes the request and hands off to the appropriate
                            specialist. The specialist handles the rest of the conversation.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Create specialist agents
UGAiAgent* TechnicalAgent = NewObject<UGAiAgent>();
TechnicalAgent->SystemPrompt = TEXT(
    "You handle technical game issues like bugs and crashes."
);
TechnicalAgent->EndpointConfiguration = EndpointConfig;

UGAiAgent* BalanceAgent = NewObject<UGAiAgent>();
BalanceAgent->SystemPrompt = TEXT(
    "You handle game balance and tuning questions."
);
BalanceAgent->EndpointConfiguration = EndpointConfig;

// Create router agent
UGAiAgent* RouterAgent = NewObject<UGAiAgent>();
RouterAgent->SystemPrompt = TEXT(
    "Route questions to the right specialist:\\n"
    "- technical_support: bugs, crashes, performance\\n"
    "- balance_expert: game balance, tuning, fairness\\n"
    "Hand off immediately after classification."
);
RouterAgent->EndpointConfiguration = EndpointConfig;

// Add specialists with handoff mode
RouterAgent->AddAgent(
    TechnicalAgent,
    EGAiAgentInteractionMode::Handoff,     // Transfers control
    EGAiAgentHistoryMode::FullHistory      // Share context
);

RouterAgent->AddAgent(
    BalanceAgent,
    EGAiAgentInteractionMode::Handoff,
    EGAiAgentHistoryMode::FullHistory
);

// Router analyzes and hands off
RouterAgent->Prompt(
    TEXT("Why does my character deal inconsistent damage?"),
    FOnAgentComplete::CreateLambda([](const FGAiAgentRunResult& Result)
    {
        // Result.RespondingAgent will be BalanceAgent
        UE_LOG(LogTemp, Log, TEXT("Handled by: %s"),
            *Result.RespondingAgent->GetToolName().ToString());
    }),
    OnError
);`}
                        </ExampleCpp>
                    </Example>

                    <h3>History Modes</h3>

                    <p>Control how much context sub-agents receive from the calling agent:</p>

                    <ul>
                        <li><strong>NoHistory</strong>: Sub-agent starts fresh with no prior context. Use for isolated tasks like formatting or validation.</li>
                        <li><strong>FullHistory</strong>: Sub-agent receives complete conversation history. Use for context-dependent tasks like summarization or continuation.</li>
                    </ul>

                    <Example>
                        <ExampleTitle>History Mode Selection</ExampleTitle>
                        <ExampleContent>
                            Choose the appropriate history mode based on whether the sub-agent needs conversation context.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Isolated task - no history needed
MainAgent->AddAgent(
    FormatterAgent,
    EGAiAgentInteractionMode::Delegation,
    EGAiAgentHistoryMode::NoHistory  // Fresh, isolated execution
);

// Context-aware task - needs full history
MainAgent->AddAgent(
    SummarizerAgent,
    EGAiAgentInteractionMode::Delegation,
    EGAiAgentHistoryMode::FullHistory  // Sees entire conversation
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Configuration Options</h2>

                    <h3>Backend Type</h3>

                    <Example>
                        <ExampleTitle>Select API Backend</ExampleTitle>
                        <ExampleContent>
                            Choose between the modern Responses API or the legacy Completions API backend.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Modern API (default, recommended)
Agent->BackendType = EGAiAgentBackendType::ResponsesApi;

// Legacy OpenAI-compatible API
Agent->BackendType = EGAiAgentBackendType::CompletionsApi;`}
                        </ExampleCpp>
                    </Example>

                    <h3>Max API Requests</h3>

                    <Example>
                        <ExampleTitle>Control Loop Iterations</ExampleTitle>
                        <ExampleContent>
                            Set the maximum number of API calls before the agent terminates. Higher values allow
                            more complex reasoning but increase cost.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Simple one-shot tool calling
Agent->MaxApiRequests = 1;

// Standard multi-turn reasoning (default)
Agent->MaxApiRequests = 10;

// Complex multi-step workflows
Agent->MaxApiRequests = 20;

// Highly complex tasks
Agent->MaxApiRequests = 50;`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="warning" title="Cost Considerations">
                        <p>
                            Each API request consumes tokens and incurs cost. Set <code>MaxApiRequests</code>
                            appropriately based on task complexity. Use terminating tools to exit early when done.
                        </p>
                    </Callout>

                    <h2>Monitoring Agent Execution</h2>

                    <Example>
                        <ExampleTitle>Track Tool Calls and Progress</ExampleTitle>
                        <ExampleContent>
                            Use the optional <code>OnToolCall</code> callback to monitor which tools are being executed
                            during the agent's reasoning loop.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Agent->Prompt(
    TEXT("Analyze damage values [10, 15, 20, 25, 30]"),
    
    // On completion
    FOnAgentComplete::CreateLambda([](const FGAiAgentRunResult& Result)
    {
        UE_LOG(LogTemp, Log, TEXT("Final Result: %s"), *Result.Result);
        UE_LOG(LogTemp, Log, TEXT("Responder: %s"),
            *Result.RespondingAgent->GetToolName().ToString());
    }),
    
    // On error
    FOnAgentError::CreateLambda([](const FGAiAgentRunResult& Result)
    {
        UE_LOG(LogTemp, Error, TEXT("Error: %s"), *Result.ErrorMessage);
    }),
    
    // On tool call (optional monitoring)
    FOnAgentToolCall::CreateLambda([](UGAiTool* Tool, const FToolExecutionResult& Result)
    {
        UE_LOG(LogTemp, Log, TEXT("[Tool] %s executed"),
            *Tool->GetToolName().ToString());
        UE_LOG(LogTemp, Log, TEXT("[Result] %s"), *Result.ResultText);
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Managing Conversations</h2>

                    <Example>
                        <ExampleTitle>Multi-Turn Conversations</ExampleTitle>
                        <ExampleContent>
                            Agents maintain conversation history across multiple prompts. Each call to <code>Prompt()</code>
                            builds on previous context.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// First message
Agent->Prompt(TEXT("I have a sword with 50 damage"), OnComplete, OnError);

// Later - agent remembers context
Agent->Prompt(TEXT("What if I increase it by 20%?"), OnComplete, OnError);

// Even later - full context maintained
Agent->Prompt(TEXT("Compare that to a staff"), OnComplete, OnError);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Reset Agent State</ExampleTitle>
                        <ExampleContent>
                            Clear conversation history to start fresh while optionally preserving agent configuration.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Clear history, keep tools and configuration
Agent->ResetSession();

// Next prompt starts fresh
Agent->Prompt(TEXT("New topic..."), OnComplete, OnError);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Best Practices</h2>

                    <h3>System Prompts</h3>

                    <ul>
                        <li>Clearly define the agent's role and expertise</li>
                        <li>List available tools and when to use them</li>
                        <li>Specify output format expectations</li>
                        <li>Include behavioral guidelines and constraints</li>
                    </ul>

                    <Example>
                        <ExampleTitle>Effective System Prompt</ExampleTitle>
                        <ExampleContent>
                            A well-structured system prompt guides the agent's behavior and tool usage.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Agent->SystemPrompt = TEXT(
    "You are a quest design assistant for an RPG game.\\n"
    "\\n"
    "Available Tools:\\n"
    "- generate_quest: Create quest data with objectives and rewards\\n"
    "- validate_quest: Check quest balance and feasibility\\n"
    "- suggest_rewards: Recommend appropriate rewards for quest level\\n"
    "\\n"
    "Always validate quests before finalizing. Keep descriptions under 200 words."
);`}
                        </ExampleCpp>
                    </Example>

                    <h3>Error Handling</h3>

                    <ul>
                        <li>Always provide both <code>OnComplete</code> and <code>OnError</code> callbacks</li>
                        <li>Check <code>Result.IsSuccess()</code> before using results</li>
                        <li>Handle tool execution errors gracefully in your tool implementations</li>
                        <li>Use <code>ResetSession()</code> to recover from error states</li>
                    </ul>

                    <h3>Performance</h3>

                    <ul>
                        <li>Set <code>MaxApiRequests</code> based on task complexity (don't over-allocate)</li>
                        <li>Use terminating tools to exit early when objectives are met</li>
                        <li>Design tools to return complete information in one call when possible</li>
                        <li>Avoid calling agents in critical game loops (they are asynchronous)</li>
                        <li>Consider using faster models for simple tasks and powerful models for complex reasoning</li>
                    </ul>

                    <Callout type="warning" title="Thread Safety">
                        <p>
                            Agents use a critical section to prevent concurrent execution. Don't call <code>Prompt()</code>
                            multiple times simultaneously on the same agent instance. Wait for completion or create
                            separate agent instances for parallel tasks.
                        </p>
                    </Callout>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><a href={LINK.GENERATIVE_AI.AGENTIC.AGENTS_API_REFERENCE}>Agents API Reference</a> - Complete API documentation</li>
                        <li><a href={LINK.GENERATIVE_AI.AGENTIC.MCP_SERVER}>MCP Server</a> - Connect to external tool providers</li>
                    </ul>

                    <PageFooter />
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}
