import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Hosting an MCP Server',
    description: 'Expose your Unreal Engine tools as an MCP server for external AI agents (Editor-Only)',
    order: 305,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import { Callout, Step, StepList } from '@/components/doc-components';
import { CodeExample, CodeBlock, ConsoleOutput } from '@/components/doc-components/code-block';
import { LanguageToggleProvider, LanguageToggle } from '@/components/doc-components/language-toggle';

export default function McpServerPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <div className="flex items-center justify-between mb-4">
                        <PageHeader />
                        <LanguageToggle />
                    </div>

                    <p className="text-muted-foreground">
                        Host your Unreal Engine tools as a Model Context Protocol (MCP) server, making them accessible
                        to external AI agents like Cursor, Claude Desktop, or custom MCP clients. This is an editor-only
                        feature perfect for development workflows.
                    </p>

                    <Callout type="warning" title="Editor-Only Feature">
                        <p>
                            MCP server hosting is only available in the Unreal Engine Editor. It is designed for
                            development workflows and is not available in packaged builds.
                        </p>
                    </Callout>

                    <h2>What is an MCP Server?</h2>

                    <h2>What is an MCP Server?</h2>

                    <p>
                        Model Context Protocol (MCP) is an open standard for connecting AI systems to tools and data sources.
                        When you host an MCP server from Unreal Engine, you expose your custom C++ and Blueprint tools to
                        external AI agents, enabling workflows like:
                    </p>

                    <ul>
                        <li><strong>AI-Assisted Development</strong>: Let Cursor or Claude Desktop call your game's tools while coding</li>
                        <li><strong>External Agent Integration</strong>: Connect custom AI agents to your Unreal Engine tools</li>
                        <li><strong>Cross-Application Workflows</strong>: Bridge Unreal Engine with other MCP-compatible applications</li>
                        <li><strong>Remote Tool Execution</strong>: Call Unreal tools from external scripts and services</li>
                    </ul>

                    <Callout type="info" title="Automatic Tool Discovery">
                        <p>
                            All tools registered in your project (both C++ and Blueprint) are automatically exposed
                            through the MCP server. No additional configuration needed per tool.
                        </p>
                    </Callout>

                    <h2>Setup Instructions</h2>

                    <StepList>
                        <Step title="Enable MCP Server in Project Settings">
                            <p>
                                The MCP server must be enabled in your project settings before it can be started.
                            </p>

                            <ol>
                                <li>Open <strong>Edit → Project Settings</strong></li>
                                <li>Navigate to <strong>Plugins → Generative AI (Editor)</strong></li>
                                <li>Find the <strong>MCP Server</strong> section</li>
                                <li>Check <strong>Enable MCP Server</strong></li>
                                <li>Configure the server port (default: <code>3333</code>)</li>
                            </ol>

                            <Callout type="warning" title="Port Conflicts">
                                <p>
                                    Ensure the configured port is not in use by another application. The default
                                    port is 3333, but you can change it to any available port.
                                </p>
                            </Callout>
                        </Step>

                        <Step title="Start the MCP Server">
                            <p>
                                Once enabled in settings, start the MCP server from the Unreal Engine Editor.
                            </p>

                            <ul>
                                <li>Open the <strong>Tools</strong> menu</li>
                                <li>Select <strong>Start MCP Server</strong></li>
                                <li>The server will start on the configured port</li>
                                <li>A notification will confirm the server is running</li>
                            </ul>

                            <Callout type="info" title="Auto-Start">
                                <p>
                                    You can configure the MCP server to start automatically when the editor opens
                                    in the same settings panel.
                                </p>
                            </Callout>
                        </Step>

                        <Step title="Verify Server is Running">
                            <p>
                                Check that the MCP server is accessible and responding.
                            </p>

                            <CodeBlock language="bash">
                                {`# Test server connectivity
curl http://localhost:3333/health

# List available tools
curl http://localhost:3333/mcp/tools

# Get tool schema
curl http://localhost:3333/mcp/tools/MyCustomTool`}
                            </CodeBlock>

                            <p>
                                You should see JSON responses indicating the server is active and exposing your tools.
                            </p>
                        </Step>

                        <Step title="Configure External Client">
                            <p>
                                Connect your external AI agent or application to the MCP server.
                            </p>

                            <h4>Example: Cursor Configuration</h4>
                            <p>
                                Add the Unreal Engine MCP server to your Cursor settings:
                            </p>

                            <CodeBlock language="json">
                                {`{
  "mcpServers": {
    "unreal-engine": {
      "url": "http://localhost:3333/mcp",
      "description": "Unreal Engine Tools"
    }
  }
}`}
                            </CodeBlock>

                            <h4>Example: Claude Desktop Configuration</h4>
                            <p>
                                Add to your Claude Desktop <code>claude_desktop_config.json</code>:
                            </p>

                            <CodeBlock language="json">
                                {`{
  "mcpServers": {
    "unreal-engine": {
      "command": "curl",
      "args": ["http://localhost:3333/mcp"]
    }
  }
}`}
                            </CodeBlock>
                        </Step>

                        <Step title="Create Tools for MCP Exposure">
                            <p>
                                Any tool you create (C++ or Blueprint) is automatically available through MCP.
                                Ensure your tools have clear names and descriptions.
                            </p>

                            <CodeExample
                                title="C++ Tool for MCP"
                                description="Create a tool that will be exposed via MCP"
                                cppCode={`UCLASS()
class USpawnActorTool : public UGAiTool
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, Category = "Params",
              meta = (ToolTip = "Class of actor to spawn"))
    TSubclassOf<AActor> ActorClass;

    UPROPERTY(EditAnywhere, Category = "Params",
              meta = (ToolTip = "World location to spawn actor"))
    FVector Location;

    virtual FName GetToolName_Implementation() const override
    {
        return TEXT("spawn_actor");
    }

    virtual FString GetToolDescription_Implementation() const override
    {
        return TEXT("Spawns an actor in the Unreal Engine world at the specified location");
    }

    virtual FToolExecutionResult OnCalled_Implementation() override
    {
        if (!ActorClass)
        {
            return FToolExecutionResult::Error(TEXT("ActorClass is required"));
        }

        UWorld* World = GetWorld();
        if (!World)
        {
            return FToolExecutionResult::Error(TEXT("No valid world"));
        }

        AActor* SpawnedActor = World->SpawnActor<AActor>(
            ActorClass, Location, FRotator::ZeroRotator
        );

        if (SpawnedActor)
        {
            return FToolExecutionResult::Success(
                FString::Printf(TEXT("Spawned %s at %s"),
                    *ActorClass->GetName(), *Location.ToString())
            );
        }

        return FToolExecutionResult::Error(TEXT("Failed to spawn actor"));
    }
};`}
                            />

                            <p>
                                This tool is now automatically available to external MCP clients as <code>spawn_actor</code>.
                            </p>
                        </Step>
                    </StepList>

                    <h2>Using the MCP Server</h2>

                    <h3>From Cursor</h3>

                    <p>
                        Once configured, you can use Unreal Engine tools directly in Cursor chat:
                    </p>

                    <ConsoleOutput title="Cursor Chat">
                        {`User: Spawn a cube at coordinates (100, 200, 0)

AI: I'll spawn a cube at the specified location using the spawn_actor tool.

[Tool Call: spawn_actor]
- ActorClass: CubeBlueprint
- Location: (100, 200, 0)

Result: Spawned CubeBlueprint at X=100.000 Y=200.000 Z=0.000

The cube has been successfully spawned in your Unreal Engine level.`}
                    </ConsoleOutput>

                    <h3>From Claude Desktop</h3>

                    <p>
                        Claude Desktop can call your Unreal Engine tools through the MCP connection:
                    </p>

                    <ConsoleOutput title="Claude Desktop">
                        {`User: Use the Unreal Engine tools to create 5 enemies around the player

Claude: I'll use the spawn_actor tool to place enemies in a circle around the player.

[Calling spawn_actor 5 times with different positions]

All 5 enemies have been spawned in a circular formation around the player's position.`}
                    </ConsoleOutput>

                    <h3>Custom MCP Client</h3>

                    <CodeExample
                        title="Python MCP Client"
                        description="Call Unreal Engine tools from a Python script"
                        cppCode={`import requests

# Connect to Unreal MCP server
mcp_url = "http://localhost:3333/mcp"

# List available tools
response = requests.get(f"{mcp_url}/tools")
tools = response.json()
print(f"Available tools: {tools}")

# Call a tool
tool_call = {
    "tool": "spawn_actor",
    "parameters": {
        "ActorClass": "EnemyBlueprint",
        "Location": {"X": 100, "Y": 200, "Z": 0}
    }
}

response = requests.post(f"{mcp_url}/call", json=tool_call)
result = response.json()
print(f"Result: {result['message']}")`}
                    />

                    <h2>Security Considerations</h2>

                    <Callout type="warning" title="Local Development Only">
                        <p>
                            The MCP server is designed for local development and should only be accessible on localhost.
                            Do not expose it to external networks or the internet.
                        </p>
                    </Callout>

                    <h3>Access Control</h3>

                    <ul>
                        <li><strong>Localhost Only</strong>: Server binds to 127.0.0.1 by default</li>
                        <li><strong>No Authentication</strong>: Assumes trusted local environment</li>
                        <li><strong>Tool Filtering</strong>: Optionally mark tools as MCP-excluded</li>
                        <li><strong>Editor-Only</strong>: Cannot be packaged into shipping builds</li>
                    </ul>

                    <h3>Excluding Tools from MCP</h3>

                    <p>
                        If you have sensitive tools that shouldn't be exposed via MCP, mark them as excluded:
                    </p>

                    <CodeExample
                        title="Exclude Tool from MCP"
                        description="Prevent specific tools from being exposed"
                        cppCode={`UCLASS()
class USensitiveOperationTool : public UGAiTool
{
    GENERATED_BODY()

public:
    // Override to exclude from MCP
    virtual bool IsAvailableForMCP_Implementation() const override
    {
        return false;  // Not exposed via MCP
    }

    virtual FToolExecutionResult OnCalled_Implementation() override
    {
        // Sensitive operation
        DeleteAllProjectFiles();
        return FToolExecutionResult::Success(TEXT("Done"));
    }
};`}
                    />

                    <h2>Monitoring and Debugging</h2>

                    <h3>Server Logs</h3>

                    <p>
                        The MCP server logs all requests to the Output Log. Enable verbose logging for detailed information:
                    </p>

                    <CodeBlock language="ini">
                        {`[Core.Log]
LogMcpServer=VeryVerbose`}
                    </CodeBlock>

                    <h3>Connection Status</h3>

                    <p>
                        Check the server status from the editor:
                    </p>

                    <ul>
                        <li>Look for "MCP Server Running" indicator in the status bar</li>
                        <li>Check <strong>Tools → MCP Server Status</strong> for connection details</li>
                        <li>View active client connections and recent tool calls</li>
                    </ul>

                    <h3>Common Issues</h3>

                    <h4>Port Already in Use</h4>
                    <p>
                        If the configured port is in use, either change the port in settings or stop the conflicting application.
                    </p>

                    <CodeBlock language="bash">
                        {`# Check what's using port 3333
netstat -ano | findstr :3333

# Kill the process (Windows)
taskkill /PID <process_id> /F`}
                    </CodeBlock>

                    <h4>Tools Not Appearing</h4>
                    <p>
                        If your tools aren't visible to MCP clients:
                    </p>

                    <ul>
                        <li>Verify tools are registered in the JSON schema cache</li>
                        <li>Check <code>IsAvailableForMCP()</code> returns true</li>
                        <li>Restart the MCP server after adding new tools</li>
                        <li>Refresh your external client's tool list</li>
                    </ul>

                    <h4>Connection Refused</h4>
                    <p>
                        If external clients can't connect:
                    </p>

                    <ul>
                        <li>Ensure MCP server is enabled in settings</li>
                        <li>Check that server has been started (Tools → Start MCP Server)</li>
                        <li>Verify firewall isn't blocking localhost connections</li>
                        <li>Confirm correct port in client configuration</li>
                    </ul>

                    <h2>Advanced Configuration</h2>

                    <h3>Custom Transport</h3>

                    <p>
                        The MCP server supports multiple transport protocols configured in settings:
                    </p>

                    <ul>
                        <li><strong>HTTP</strong>: Default, RESTful API (recommended)</li>
                        <li><strong>stdio</strong>: Standard input/output for process integration</li>
                        <li><strong>SSE</strong>: Server-Sent Events for streaming</li>
                    </ul>

                    <h3>Tool Metadata</h3>

                    <p>
                        Enhance tool discoverability by providing rich metadata:
                    </p>

                    <CodeExample
                        title="Enhanced Tool Metadata"
                        description="Provide detailed information for MCP clients"
                        cppCode={`UCLASS()
class UCreateQuestTool : public UGAiTool
{
    GENERATED_BODY()

public:
    virtual FString GetToolDescription_Implementation() const override
    {
        return TEXT(
            "Creates a new quest in the game. Generates quest objectives, "
            "rewards, and adds it to the player's quest log. Use this to "
            "dynamically create content during gameplay."
        );
    }

    virtual TArray<FString> GetToolTags_Implementation() const override
    {
        return {TEXT("quest"), TEXT("content"), TEXT("gameplay")};
    }

    virtual FString GetToolCategory_Implementation() const override
    {
        return TEXT("Content Generation");
    }
};`}
                    />

                    <h2>Best Practices</h2>

                    <h3>Tool Design for MCP</h3>

                    <ul>
                        <li><strong>Clear Names</strong>: Use descriptive snake_case names (e.g., <code>spawn_actor</code>, <code>create_quest</code>)</li>
                        <li><strong>Detailed Descriptions</strong>: External clients rely on descriptions to understand tool purpose</li>
                        <li><strong>Parameter Tooltips</strong>: Document all parameters with <code>meta=(ToolTip="...")</code></li>
                        <li><strong>Error Handling</strong>: Return clear error messages that help external clients</li>
                        <li><strong>Idempotency</strong>: Design tools to be safely called multiple times</li>
                    </ul>

                    <h3>Performance</h3>

                    <ul>
                        <li>MCP adds network overhead - avoid in performance-critical paths</li>
                        <li>Long-running tools should return quickly and use callbacks</li>
                        <li>Consider rate limiting for tools that modify game state</li>
                        <li>Cache tool schemas to reduce discovery overhead</li>
                    </ul>

                    <h3>Development Workflow</h3>

                    <ul>
                        <li>Keep MCP server running during development sessions</li>
                        <li>Use external AI agents to test tool implementations</li>
                        <li>Monitor tool calls in Output Log for debugging</li>
                        <li>Version your tool schemas to track compatibility</li>
                    </ul>

                    <h2>Use Cases</h2>

                    <h3>AI-Assisted Level Design</h3>

                    <p>
                        Use Cursor or Claude Desktop to rapidly iterate on level layouts by calling Unreal Engine
                        placement tools through MCP while discussing design goals with the AI.
                    </p>

                    <h3>Automated Testing</h3>

                    <p>
                        Build external test scripts that use MCP to drive Unreal Engine, spawn test scenarios,
                        and validate game behavior.
                    </p>

                    <h3>Content Generation Pipelines</h3>

                    <p>
                        Create content generation workflows where external AI services call Unreal Engine tools
                        to import, process, and validate generated assets.
                    </p>

                    <h3>Cross-Tool Integration</h3>

                    <p>
                        Bridge Unreal Engine with other game development tools using MCP as a common protocol,
                        enabling tools from different applications to work together.
                    </p>

                    <h2>Limitations</h2>

                    <ul>
                        <li><strong>Editor-Only</strong>: MCP server cannot run in packaged builds</li>
                        <li><strong>Local Development</strong>: Designed for localhost, not production deployment</li>
                        <li><strong>No Authentication</strong>: Assumes trusted environment</li>
                        <li><strong>Single Instance</strong>: Only one MCP server per editor instance</li>
                        <li><strong>HTTP Only</strong>: Currently limited to HTTP transport (stdio and SSE planned)</li>
                    </ul>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><a href="/generative-ai/agentic/using-agents">Using Agents</a> - Learn how to create agents that use tools</li>
                        <li><a href="/generative-ai/agentic/agents-api-reference">Agents API Reference</a> - Complete API documentation</li>
                        <li><a href="/generative-ai/features/tools">Creating Tools</a> - Tool implementation guide</li>
                        <li><a href="/generative-ai/hosted-tools/mcp-tools">MCP Tools</a> - Using external MCP servers in agents</li>
                    </ul>

                    <PageFooter />
                    <PageFooter />
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}