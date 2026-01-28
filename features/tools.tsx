import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Tools',
    description: 'Enable AI to execute custom functions and interact with your game systems through automatic tool calling',
    order: 203
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

export default function ToolsPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <p>
                        Tools allow AI models to execute functions and interact with your game systems. When the AI determines
                        it needs to perform an action or query data, it calls a tool, receives the result, and continues reasoning
                        with that information.
                    </p>

                    <h2>Automatic Tool Execution Loop</h2>

                    <p>
                        When generating a response, the plugin automatically handles tool execution in a loop. If the AI requests
                        a tool call, the plugin executes it, appends the result to the conversation history, and requests the
                        next response. This continues until the AI generates a final text response or the <code>MaxApiRequests</code> limit
                        is reached.
                    </p>

                    <Example>
                        <ExampleTitle>Tool Execution Flow</ExampleTitle>
                        <ExampleContent>
                            Configure the maximum number of API requests to control how many tool execution rounds are allowed.
                            If a response contains multiple tool calls, all results will be collected, before sending an additional request including the function call outputs.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Allow up to 5 API requests (initial + 4 tool execution rounds)
Session->MaxApiRequests = 5;

// Add tools
Session->AddToolByClass(UGetPlayerHealthTool::StaticClass());
Session->AddToolByClass(USpawnEnemyTool::StaticClass());

// Generate - tools execute automatically
Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        // AI may have called tools multiple times
        // Final response includes results from all tool executions
        FString Response = Ctx->GetAggregatedResponseText();
        UE_LOG(LogTemp, Log, TEXT("AI: %s"), *Response);
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Automatic vs Manual Execution">
                        <p>
                            Tools are executed automatically by default. You can intercept tool calls using the
                            <code>OnToolCall</code> callback to customize validation, logging, or execution logic.
                        </p>
                    </Callout>

                    <h2>Defining Tools</h2>

                    <p>
                        Create tools by deriving from <code>UGAiTool</code> and defining parameters as <code>UPROPERTY</code> members.
                        The plugin automatically generates JSON schemas from your properties and handles parameter parsing.
                        Use the class tooltip to describe what the tool does, and property tooltips to describe individual parameters.
                    </p>

                    <Example>
                        <ExampleTitle>Basic Tool Definition</ExampleTitle>
                        <ExampleContent>
                            Add UPROPERTY members to define parameters that the AI can provide. The plugin automatically
                            generates the JSON schema and parses AI-provided values into your properties.
                        </ExampleContent>
                        <ExampleCpp>
                            {`UCLASS(meta = (ToolTip = "Spawns an enemy at a specified location"))
class USpawnEnemyTool : public UGAiTool
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite,
              meta = (ToolTip = "Enemy type to spawn (e.g., 'Goblin', 'Orc')"))
    FString EnemyType;

    UPROPERTY(EditAnywhere, BlueprintReadWrite,
              meta = (ToolTip = "X coordinate for spawn location"))
    float X = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite,
              meta = (ToolTip = "Y coordinate for spawn location"))
    float Y = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite,
              meta = (ToolTip = "Z coordinate for spawn location"))
    float Z = 0.0f;

    virtual FToolExecutionResult OnCalled_Implementation() override
    {
        FVector Location(X, Y, Z);
        SpawnEnemyAt(EnemyType, Location);

        return FToolExecutionResult::Success(
            FString::Printf(TEXT("Spawned %s at (%.0f, %.0f, %.0f)"),
                *EnemyType, X, Y, Z)
        );
    }
};`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Excluding Properties from Schema</ExampleTitle>
                        <ExampleContent>
                            Use the <code>JsonSchema_ExcludeFromSchema</code> metadata to exclude properties from the AI-visible
                            schema. Useful for runtime state that should be set by your code, not the AI.
                        </ExampleContent>
                        <ExampleCpp>
                            {`UCLASS(meta = (ToolTip = "Attacks a target"))
class UAttackTool : public UGAiTool
{
    GENERATED_BODY()

public:
    // AI provides the target name
    UPROPERTY(EditAnywhere, BlueprintReadWrite,
              meta = (ToolTip = "Target to attack"))
    FString TargetName;

    // Runtime state - not exposed to AI
    UPROPERTY(EditAnywhere, BlueprintReadWrite,
              meta = (JsonSchema_ExcludeFromSchema))
    APawn* ActorPawn = nullptr;

    virtual FToolExecutionResult OnCalled_Implementation() override
    {
        if (!ActorPawn)
            return FToolExecutionResult::Error(TEXT("No actor assigned"));

        // Execute attack using both AI-provided and runtime data
        ExecuteAttack(ActorPawn, TargetName);

        return FToolExecutionResult::Success(
            FString::Printf(TEXT("%s attacks %s"),
                *ActorPawn->GetName(), *TargetName)
        );
    }
};`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="JSON Schema Plugin">
                        <p>
                            Tool parameter schemas are generated using the <a href="/json-schema">JSON Schema Plugin</a>.
                            See the JSON Schema documentation for advanced features like validation constraints, nested objects,
                            arrays, enums, and more.
                        </p>
                    </Callout>

                    <Example>
                        <ExampleTitle>Adding Tools to Sessions</ExampleTitle>
                        <ExampleContent>
                            Tools must be added to a session before generation. Add tools by class (plugin creates instances) or by instance (you control initialization).
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Add by class (simplest approach)
Session->AddToolByClass(UGetPlayerHealthTool::StaticClass());
Session->AddToolByClass(USpawnEnemyTool::StaticClass());

// Or add by instance (useful for configuring runtime state)
UAttackTool* AttackTool = NewObject<UAttackTool>(this);
AttackTool->ActorPawn = MyPawn;
Session->AddToolInstance(AttackTool);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Intercepting Tool Calls</h2>

                    <p>
                        Use the <code>OnToolCall</code> callback to intercept tool execution. This allows you to validate
                        tool calls, log execution, or implement custom execution logic. Return a <code>FToolExecutionResult</code>
                        to control the outcome.
                    </p>

                    <Example>
                        <ExampleTitle>Custom Tool Call Handling</ExampleTitle>
                        <ExampleContent>
                            Intercept tool calls for validation, logging, or custom execution. Return <code>Unhandled()</code>
                            to allow the plugin to execute the tool automatically.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationStreamChunk(),
    FOnGenerationToolCall::CreateLambda([](const UGAiSession* Ctx, const FUnifiedToolCall& ToolCall)
    {
        UE_LOG(LogTemp, Log, TEXT("AI called tool: %s"), *ToolCall.Name.ToString());

        // Validate tool calls
        if (ToolCall.Name == TEXT("SpawnEnemy"))
        {
            if (!CanSpawnEnemies())
            {
                return FToolExecutionResult::Error(TEXT("Cannot spawn enemies right now"));
            }
        }

        // Log important tool calls
        if (ToolCall.Name == TEXT("DeleteData"))
        {
            UE_LOG(LogTemp, Warning, TEXT("AI requested data deletion: %s"),
                *ToolCall.Arguments);
        }

        // Let the plugin execute the tool automatically
        return FToolExecutionResult::Unhandled();
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Manual Tool Execution</ExampleTitle>
                        <ExampleContent>
                            Completely override tool execution by returning a success or error result instead of unhandled.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationStreamChunk(),
    FOnGenerationToolCall::CreateLambda([](const UGAiSession* Ctx, const FUnifiedToolCall& ToolCall)
    {
        // Execute tool with custom logic
        if (ToolCall.Name == TEXT("GetWeather"))
        {
            FString WeatherData = FetchWeatherFromAPI(ToolCall.Arguments);
            return FToolExecutionResult::Success(WeatherData);
        }

        // Let other tools execute automatically
        return FToolExecutionResult::Unhandled();
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Tool Choice Control</h2>

                    <p>
                        Control when and how the AI uses tools with the <code>ToolChoice</code> configuration. This determines
                        whether the AI can decide to use tools, must use tools, or should avoid them.
                    </p>

                    <Example>
                        <ExampleTitle>Configuring Tool Choice</ExampleTitle>
                        <ExampleContent>
                            Set the tool choice mode to control AI tool usage behavior.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Let AI decide when to use tools (default)
Session->Request.ToolChoice = FResponsesApiToolChoice{};
Session->Request.ToolChoice->Mode = EResponsesApiToolChoiceMode::Auto;

// Require the AI to use at least one tool
Session->Request.ToolChoice->Mode = EResponsesApiToolChoiceMode::Required;

// Force AI to use a specific tool
Session->Request.ToolChoice->Mode = EResponsesApiToolChoiceMode::Function;
Session->Request.ToolChoice->FunctionName = TEXT("GetPlayerHealth");

// Disable all tools for this request
Session->Request.ToolChoice->Mode = EResponsesApiToolChoiceMode::None;`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="warning" title="Required Mode and Auto-Execution">
                        <p>
                            When <code>ToolChoice</code> is set to <code>Required</code>, it is automatically changed
                            to <code>Auto</code> after the first tool call. This prevents infinite loops where the AI
                            is forced to call tools repeatedly without generating a final response.
                        </p>
                    </Callout>

                    <h2>Best Practices</h2>

                    <ul>
                        <li><strong>Clear Tool Names</strong> - Tool names are derived from class names. Use descriptive class names like <code>UGetPlayerHealthTool</code></li>
                        <li><strong>Detailed Descriptions</strong> - Use class and property tooltips to guide the AI on when and how to use tools</li>
                        <li><strong>Validate Results</strong> - Check tool execution results before using them in game logic</li>
                        <li><strong>Limit API Requests</strong> - Set <code>MaxApiRequests</code> to prevent excessive tool calling loops</li>
                        <li><strong>Use OnToolCall</strong> - Intercept tool calls for validation, logging, or custom execution logic</li>
                        <li><strong>Thread Safety</strong> - Tools execute on the game thread by default. Set <code>bExecuteOnGameThread = false</code> for pure computation</li>
                    </ul>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><a href="/generative-ai/hosted-tools">Hosted Tools</a> - Use provider-integrated tools for web search, code execution, and more</li>
                        <li><a href="/json-schema">JSON Schema Plugin</a> - Learn about advanced schema features and constraints</li>
                        <li><a href="/generative-ai/core/generation-callbacks">Generation Callbacks</a> - All available callback types</li>
                        <li><a href="/generative-ai/agentic">Agentic</a> - Build autonomous agents with tools and sub-agents</li>
                    </ul>

                </LanguageToggleProvider>

                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
