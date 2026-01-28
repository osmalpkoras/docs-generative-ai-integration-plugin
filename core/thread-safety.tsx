import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Thread Safety',
    description: `The plugin is designed to never block any named thread, including the game thread. Learn how
                  to use sessions and tools safely in multi-threaded environments.`,
    order: 14
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

export default function ThreadSafetyPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <h2>Session Blocking Behavior</h2>

                    <p>
                        When you call <code>Generate()</code> on a session, the calling thread will block until
                        the previous generation completes. This prevents race conditions but means you cannot make
                        concurrent <code>Generate()</code> calls on the same session instance.
                    </p>

                    <Callout type="warning" title="One Generate() Call Per Session">
                        <p>
                            Each session accepts only one <code>Generate()</code> call at a time. Attempting to call
                            <code>Generate()</code> while a previous operation is in progress will cause the calling thread
                            to block until completion to prevent unpredictable behavior from concurrent state modifications.
                            All your <code>Generate()</code> calls should wait for the <code>OnComplete</code> callback
                            before issuing the next request. See{' '}
                            <a href="/generative-ai/core/using-sessions">Using Sessions</a> for callback patterns.
                        </p>
                    </Callout>

                    <h2>Tool Execution on Game Thread</h2>

                    <p>
                        Tools have a <code>bExecuteOnGameThread</code> property that controls whether tool execution
                        should be marshalled to the game thread. This is <code>true</code> by default and should remain
                        true if your tool accesses any Unreal Engine APIs.
                    </p>

                    <h3>When bExecuteOnGameThread Must Be True</h3>

                    <p>Set <code>bExecuteOnGameThread = true</code> if your tool uses any of these:</p>

                    <ul>
                        <li><strong>Actor/Pawn Operations:</strong> <code>GetWorld()</code>, <code>SpawnActor()</code>, <code>DestroyActor()</code></li>
                        <li><strong>Component Access:</strong> Getting or modifying components on actors</li>
                        <li><strong>Level/World Queries:</strong> Line traces, overlaps, physics queries</li>
                        <li><strong>Audio:</strong> <code>UGameplayStatics::PlaySound2D()</code>, sound cues</li>
                        <li><strong>Visual Effects:</strong> Particle systems, decals, animations</li>
                        <li><strong>Damage/Events:</strong> <code>TakeDamage()</code>, triggering game events</li>
                        <li><strong>Player/Controller Access:</strong> Getting player controller, pawn possession</li>
                        <li><strong>Game State:</strong> Accessing or modifying game mode, game state, player state</li>
                        <li><strong>UMG/UI:</strong> Creating or modifying widgets</li>
                        <li><strong>Async Operations:</strong> Starting timers, async tasks that touch game objects</li>
                    </ul>

                    <Example>
                        <ExampleTitle>Tool That Spawns an Actor (Needs Game Thread)</ExampleTitle>
                        <ExampleContent>
                            This tool spawns an actor in the world, which requires game thread access. Leave
                            <code>bExecuteOnGameThread = true</code> (the default).
                        </ExampleContent>
                        <ExampleCpp>
                            {`UCLASS(meta = (ToolTip = "Spawn an enemy at a location"))\nclass USpawnEnemyTool : public UGAiTool\n{\n    GENERATED_BODY()\n\npublic:\n    UPROPERTY(BlueprintReadWrite, meta = (ToolTip = "Enemy class to spawn", JsonSchema_ExcludeFromSchema))\n    TSubclassOf<ACharacter> EnemyClass;\n\n    UPROPERTY(BlueprintReadWrite, meta = (ToolTip = "X coordinate"))\n    float X = 0.0f;\n\n    UPROPERTY(BlueprintReadWrite, meta = (ToolTip = "Y coordinate"))\n    float Y = 0.0f;\n\n    UPROPERTY(BlueprintReadWrite, meta = (ToolTip = "Z coordinate"))\n    float Z = 0.0f;\n\n    virtual FToolExecutionResult OnCalled_Implementation() override\n    {\n        // bExecuteOnGameThread = true, so this runs on game thread\n        // Safe to use GetWorld() and SpawnActor()\n        UWorld* World = GetWorld();\n        if (!World)\n            return FToolExecutionResult::Error(TEXT(\"No world available\"));\n\n        FVector Location(X, Y, Z);\n        ACharacter* Enemy = World->SpawnActor<ACharacter>(EnemyClass, Location, FRotator::ZeroRotator);\n\n        return FToolExecutionResult::Success(FString::Printf(\n            TEXT(\"Spawned enemy at (%.0f, %.0f, %.0f)\"), X, Y, Z\n        ));\n    }\n};`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Tool for Pure Data Processing (Can Skip Game Thread)</ExampleTitle>
                        <ExampleContent>
                            This tool performs calculations without accessing Unreal objects. You can set
                            <code>bExecuteOnGameThread = false</code> to avoid the thread marshalling overhead.
                        </ExampleContent>
                        <ExampleCpp>
                            {`UCLASS(meta = (ToolTip = "Calculate physics-based trajectory"))\nclass UCalculateTrajectoryTool : public UGAiTool\n{\n    GENERATED_BODY()\n\npublic:\n    UPROPERTY(BlueprintReadWrite, meta = (ToolTip = "Initial velocity magnitude"))\n    float InitialVelocity = 1000.0f;\n\n    UPROPERTY(BlueprintReadWrite, meta = (ToolTip = "Launch angle in degrees"))\n    float LaunchAngle = 45.0f;\n\n    UCalculateTrajectoryTool()\n    {\n        // Pure math calculation, no UE API access needed\n        bExecuteOnGameThread = false;\n    }\n\n    virtual FToolExecutionResult OnCalled_Implementation() override\n    {\n        // This runs on the HTTP thread (no game thread overhead)\n        // Safe because we only do math, no UE object access\n        float AngleRad = FMath::DegreesToRadians(LaunchAngle);\n        float MaxRange = (InitialVelocity * InitialVelocity * FMath::Sin(2.0f * AngleRad)) / 9.81f;\n        float MaxHeight = (InitialVelocity * InitialVelocity * FMath::Square(FMath::Sin(AngleRad))) / (2.0f * 9.81f);\n\n        return FToolExecutionResult::Success(FString::Printf(\n            TEXT(\"Max range: %.1f m, Max height: %.1f m\"), MaxRange, MaxHeight\n        ));\n    }\n};`}
                        </ExampleCpp>
                    </Example>

                    <h2>No Thread Blocking Design</h2>

                    <Callout type="info" title="Plugin Thread Safety Guarantees">
                        <ul>
                            <li>
                                <strong>Game thread is never blocked</strong> - HTTP requests and API calls happen on
                                dedicated threads. Generation callbacks always execute on the game thread.
                            </li>
                            <li>
                                <strong>HTTP thread is never blocked</strong> - The plugin never performs blocking operations
                                (like waiting for UI or expensive computations) on the HTTP thread.
                            </li>
                            <li>
                                <strong>Tool execution is flexible</strong> - Tools can execute on game thread (for Unreal API
                                access) or on the HTTP thread (for performance-critical operations). Control this with
                                <code>bExecuteOnGameThread</code>.
                            </li>
                            <li>
                                <strong>Callbacks always safe</strong> - All generation callbacks (OnComplete, OnError,
                                OnStreamChunk, OnToolCall) are automatically marshalled to the game thread and can safely access
                                Unreal objects.
                            </li>
                        </ul>
                    </Callout>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><a href="/generative-ai/core/using-sessions">Using Sessions</a> - Learn about session creation and callback patterns</li>
                        <li><a href="/generative-ai/features/tools">Tools</a> - Create custom tools and understand tool parameters</li>
                        <li><a href="/generative-ai/core/error-handling">Error Handling</a> - Handle errors gracefully in callbacks</li>
                    </ul>

                </LanguageToggleProvider>

                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
