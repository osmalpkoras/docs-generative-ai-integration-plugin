import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Tool Calling',
    description: 'Enable AI models to execute custom functions and interact with game systems',
    order: 7,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer } from '@/components/layout';
import {
    LanguageToggleProvider,
    LanguageToggle,
    LanguageContent,
    Callout,
    CodeExample,
    ConsoleOutput,
    EnumReference,
    StepList,
    Step,
} from '@/components/doc-components';
import { LINK } from '@/lib/pages.generated';

export default function ToolCallingPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="font-bold">Tool Calling</h1>
                        <LanguageToggle />
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        Tool calling allows AI models to execute predefined Unreal functions during generation. Tools bridge
                        the gap between natural language reasoning and in-game systems by letting the AI choose, configure,
                        and invoke game logic in real time.
                    </p>

                    <h2>Tool Schema & Parameter Definition</h2>

                    <p>
                        Tools are implemented as <code>UObject</code> classes inheriting from <code>UGAiTool</code>, which itself
                        derives from <code>UJsonSchemaConvertableObject</code>. This means tool parameters are defined in the same
                        way as <a href={LINK.GENERATIVE_AI.COMPLETIONS_API.STRUCTURED_OUTPUT}>Structured Output</a> classes:
                        the framework uses the Unreal Engine reflection system to automatically generate a JSON Schema for the tools function signature from UPROPERTY declarations.
                    </p>

                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Schema Parameters:</strong> Standard UPROPERTYs that become tool arguments exposed to the AI model.</li>
                        <li><strong>Runtime Parameters:</strong> UPROPERTYs excluded with <code>JsonSchema_ExcludeFromSchema</code>,
                            used for passing internal context (not visible to the model).</li>
                        <li><strong>Metadata:</strong> Use <code>ToolTip</code> or <code>JsonSchema_Description</code> for descriptions,
                            <code>JsonSchema_Optional</code> to mark fields optional, and other Structured Output metadata specifiers
                            to control constraints.</li>
                    </ul>

                    <Callout type="info" title="Schema Reference">
                        <p>
                            For a complete list of supported datatypes and metadata specifiers, see the{" "}
                            <a href={LINK.GENERATIVE_AI.COMPLETIONS_API.STRUCTURED_OUTPUT}>Structured Output</a> documentation.
                            The same rules apply to tools since they share the same schema system.
                        </p>
                    </Callout>

                    <h2>Tool Calling Lifecycle</h2>

                    <StepList>
                        <Step title="Tool Registration">
                            <p>Register tool instances or classes with the session using <code>AddToolInstance()</code> or related methods.
                                The system introspects properties to generate the function signature.</p>
                        </Step>
                        <Step title="Tool Invocation">
                            <p>The AI model decides when and which tools to call. When selected, the model emits a tool call with arguments as JSON.</p>
                        </Step>
                        <Step title="Parameter Resolution">
                            <p>Arguments are parsed and marshaled into the tool’s UPROPERTYs. If you registered an instance,
                                runtime context can be pre-initialized and combined with AI-supplied parameters.</p>
                        </Step>
                        <Step title="Execution">
                            <p><code>OnCalled()</code> (or <code>OnCalled_Implementation()</code> in C++) is executed. The return value
                                (<code>FToolExecutionResult</code>) is sent back to the model upon success as the tool’s output.</p>
                        </Step>
                        <Step title="Conversation Continuation">
                            <p>Tool call results are automatically appended to the session history. The AI model then continues its turn,
                                generating its next response.</p>
                        </Step>
                    </StepList>

                    <h2>Tool Implementation</h2>

                    <LanguageContent language="cpp">
                        <CodeExample
                            title="Tool Class Definition"
                            description="Example tool showing schema parameters, runtime context, and execution logic"
                            cppCode={`UCLASS(BlueprintType, Blueprintable, meta = (ToolTip = "Attack action: NPC attacks a named target."))
class UCompletionNpcAttackTool : public UGAiTool
{
    GENERATED_BODY()
public:
    // Schema parameter: visible to the AI model
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Params", meta = (ToolTip = "Target to attack (name or tag)"))
    FString Target;

    // Runtime parameter: excluded from schema, only used internally
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Runtime", meta = (JsonSchema_ExcludeFromSchema = "true"))
    APawn* TargetPawn = nullptr;

    virtual FToolExecutionResult OnCalled_Implementation() override
    {
        const FString PawnName = (TargetPawn && TargetPawn->GetName().Len() > 0) ? TargetPawn->GetName() : TEXT("UnknownPawn");
        const FString Msg = FString::Printf(TEXT("%s attacks %s!"), *PawnName, *Target);
        UE_LOG(LogTemp, Log, TEXT("[Completion Tool] %s"), *Msg);
        return FToolExecutionResult::Success(Msg);
    }
};`}
                        />
                    </LanguageContent>

                    <h2>ToolChoice Configuration</h2>

                    <p>
                        The AI model’s decision-making around tools is controlled by the <code>ToolChoice</code> request parameter:
                    </p>

                    <EnumReference
                        enumName="EResponsesApiToolChoiceMode"
                        description="Controls AI tool selection behavior"
                        values={[
                            {
                                name: "Auto",
                                description: "AI decides whether to call tools based on context",
                                usage: "Default mode — recommended when tools are optional helpers"
                            },
                            {
                                name: "Required",
                                description: "AI must call at least one tool before producing a text response",
                                usage: "Use when tool execution is mandatory for the task"
                            },
                            {
                                name: "None",
                                description: "AI cannot call tools, only generates text",
                                usage: "Disable tool calling while still keeping tools registered"
                            }
                        ]}
                    />

                    <h2>Session Configuration</h2>

                    <LanguageContent language="cpp">
                        <CodeExample
                            title="Tool Registration and Configuration"
                            description="Registering tools and configuring session behavior"
                            cppCode={`UGAiCompletionApiSession* UGAiCompletions_ToolCallingExample::Run(UGAiEndpointConfig* EndpointConfig, UObject* WorldContextObject)
{
    if (!ensureMsgf(EndpointConfig != nullptr, TEXT("EndpointConfig is required")))
    {
        return nullptr;
    }

    UGAiCompletionApiSession* Session = UGAiCompletionApiSession::CreateChatGenerationContext(
        EndpointConfig,
        WorldContextObject ? WorldContextObject : GetTransientPackage(),
        TEXT("You decide the appropriate NPC action by calling one of the available tools."),
        TEXT("An NPC encounters the player near a gate at sunset. If friendly, wave. If hostile, attack the gate guard named 'Roland'.")
    );

    // Create tools and provide runtime context
    UCompletionNpcAttackTool* AttackTool = NewObject<UCompletionNpcAttackTool>(Session);
    UCompletionNpcWaveTool* WaveTool = NewObject<UCompletionNpcWaveTool>(Session);

    if (const APawn* AsPawnConst = Cast<APawn>(WorldContextObject))
    {
        AttackTool->TargetPawn = const_cast<APawn*>(AsPawnConst);
        WaveTool->TargetPawn = const_cast<APawn*>(AsPawnConst);
    }

    // Register tools with the session
    Session->AddToolInstance(AttackTool);
    Session->AddToolInstance(WaveTool);

    // Configure tool choice behavior
    Session->Request.ToolChoice = FResponsesApiToolChoice{};
    Session->Request.ToolChoice->Mode = EResponsesApiToolChoiceMode::Auto;

    Session->Generate(
        FOnGenerationComplete::CreateLambda([](const UGAiCompletionApiSession* Ctx)
        {
            UE_LOG(LogTemp, Log, TEXT("Completion ToolCalling result: %s"), *Ctx->GetResponseText());
        }),
        FOnGenerationStreamChunk(),
        FOnGenerationError::CreateLambda([](const UGAiCompletionApiSession* Ctx)
        {
            UE_LOG(LogTemp, Error, TEXT("Completion ToolCalling error: %s"), *Ctx->GetErrorMessage());
        })
    );

    return Session;
}`}
                        />
                    </LanguageContent>

                    <h2>Execution Results</h2>

                    <p>
                        Tool execution returns an <code>FToolExecutionResult</code> object that communicates success or failure.
                        On success, the result is passed back to the AI model. On failure, the request is aborted.
                    </p>

                    <ConsoleOutput title="Friendly Encounter - Wave Tool Called">
                        {`[Completion Tool] NPC_Guard waves (friendly)!
LogTemp: Log: Completion ToolCalling result: I've greeted you with a friendly wave. Welcome to our village!`}
                    </ConsoleOutput>

                    <ConsoleOutput title="Hostile Encounter - Attack Tool Called">
                        {`[Completion Tool] NPC_Guard attacks Roland!
LogTemp: Log: Completion ToolCalling result: The situation has escalated - I've engaged the gate guard in combat.`}
                    </ConsoleOutput>

                    <h2>Best Practices</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Use metadata wisely:</strong> Add descriptions and constraints to make AI tool use reliable.</li>
                        <li><strong>Hide runtime state:</strong> Exclude internal fields with <code>JsonSchema_ExcludeFromSchema</code>.</li>
                        <li><strong>Validate inputs:</strong> Always check parsed arguments in <code>OnCalled()</code> before executing game logic.</li>
                        <li><strong>Keep tools focused:</strong> Smaller, single-purpose tools are easier for the model to choose correctly.</li>
                        <li><strong>Manage lifecycle:</strong> Registered tools persist with the session until cleared. Reset when starting a new interaction.</li>
                    </ul>
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}
