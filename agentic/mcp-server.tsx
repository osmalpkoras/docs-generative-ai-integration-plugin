import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'MCP Server',
    description: 'Expose your Unreal Engine tools to external AI agents via Model Context Protocol',
    order: 305,
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

export default function McpServerPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <p>
                        The MCP (Model Context Protocol) server exposes your Unreal Engine tools to external AI
                        systems like Cursor, Claude Desktop, and custom MCP clients. Tools you create are
                        automatically available to these external agents.
                    </p>

                    <Callout type="warning" title="Editor-Only Feature">
                        <p>
                            MCP server hosting is only available in the Unreal Engine Editor. It cannot be packaged
                            into shipping builds and is designed exclusively for development workflows.
                        </p>
                    </Callout>

                    <h2>How It Works</h2>

                    <p>
                        When enabled, the plugin starts a Python MCP server and an HTTP Tool server that expose
                        your registered tools. External AI agents can discover and call these tools through the
                        standard MCP protocol. The system consists of:
                    </p>

                    <ul>
                        <li><strong>Python MCP Server</strong>: Implements the MCP protocol on a configurable port</li>
                        <li><strong>HTTP Tool Server</strong>: Internal server that executes tool calls from MCP clients</li>
                        <li><strong>Tool Definition</strong>: A Blueprint or C++ class that specifies which tools to expose</li>
                    </ul>

                    <h2>Setup</h2>

                    <StepList>
                        <Step title="Enable MCP Server">
                            <p>Configure the MCP server in Project Settings:</p>

                            <ol>
                                <li>Go to <strong>Edit → Project Settings</strong></li>
                                <li>Navigate to <strong>Plugins → Generative AI (Editor)</strong></li>
                                <li>In the <strong>MCP Server</strong> section:
                                    <ul>
                                        <li>Check <strong>Enable MCP Server</strong></li>
                                        <li>Set <strong>MCP Server Port</strong> (default: 3000)</li>
                                        <li>Set <strong>Tool Server Port</strong> (default: 8080)</li>
                                        <li>Configure <strong>Tool Execution Timeout Seconds</strong> (default: 5)</li>
                                        <li>Enable <strong>Auto Kill Port Process</strong> to automatically terminate conflicting processes</li>
                                    </ul>
                                </li>
                            </ol>

                            <Callout type="info" title="Port Configuration">
                                <p>
                                    Ensure both ports are available. The MCP server port is exposed to external
                                    clients, while the Tool server port is used internally.
                                </p>
                            </Callout>
                        </Step>

                        <Step title="Create MCP Server Definition">
                            <p>
                                Create a Blueprint or C++ class deriving from <code>UGAiMCPServerDefinition</code>
                                to specify which tools should be available through MCP:
                            </p>

                            <Example>
                                <ExampleTitle>Blueprint MCP Definition</ExampleTitle>
                                <ExampleContent>
                                    Create a Blueprint class derived from <code>GAi MCP Server Definition</code> and
                                    override <code>Get Tools To Serve</code> to return an array of tool instances.
                                </ExampleContent>
                                <ExampleCpp>
                                    {`1. Right-click in Content Browser → Blueprint Class
2. Search for "GAi MCP Server Definition" as parent class
3. Name it (e.g., "BP_MyMCPDefinition")
4. Open and override "Get Tools To Serve"
5. Return an array of tool instances you want to expose`}
                                </ExampleCpp>
                            </Example>

                            <Example>
                                <ExampleTitle>C++ MCP Definition</ExampleTitle>
                                <ExampleContent>
                                    Derive from <code>UGAiMCPServerDefinition</code> and override
                                    <code>GetToolsToServe_Implementation</code>.
                                </ExampleContent>
                                <ExampleCpp>
                                    {`UCLASS()
class UMyMCPServerDefinition : public UGAiMCPServerDefinition
{
    GENERATED_BODY()

public:
    virtual TArray<UGAiTool*> GetToolsToServe_Implementation() override
    {
        TArray<UGAiTool*> Tools;

        // Add tool instances to expose
        Tools.Add(NewObject<USpawnActorTool>());
        Tools.Add(NewObject<UCreateQuestTool>());
        Tools.Add(NewObject<UGetPlayerLocationTool>());

        return Tools;
    }
};`}
                                </ExampleCpp>
                            </Example>
                        </Step>

                        <Step title="Configure MCP Definition Class">
                            <p>
                                Set your MCP Server Definition class in Project Settings:
                            </p>

                            <ol>
                                <li>In <strong>Project Settings → Plugins → Generative AI (Editor)</strong></li>
                                <li>Under <strong>MCP Server</strong>, find <strong>MCP Server Definition Class</strong></li>
                                <li>Select your Blueprint or C++ definition class</li>
                                <li>The server will automatically load this class when starting</li>
                            </ol>
                        </Step>

                        <Step title="Start the MCP Server">
                            <p>
                                The MCP server starts automatically when the editor opens if enabled in settings.
                                You can also restart it manually:
                            </p>

                            <ul>
                                <li>Changes to settings automatically restart the server</li>
                                <li>The server monitors its own health and restarts if needed</li>
                                <li>Check the Output Log for startup messages and status</li>
                            </ul>

                            <Callout type="info" title="Automatic Management">
                                <p>
                                    The MCP server subsystem handles lifecycle automatically. It starts on editor
                                    launch, restarts when settings change, and shuts down when the editor closes.
                                </p>
                            </Callout>
                        </Step>
                    </StepList>

                    <h2>Connecting External Clients</h2>

                    <Example>
                        <ExampleTitle>Cursor Configuration</ExampleTitle>
                        <ExampleContent>
                            Add the MCP server to your Cursor configuration to use Unreal tools while coding.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// In Cursor settings (cursor_config.json):
{
  "mcpServers": {
    "unreal-engine": {
      "url": "http://localhost:3000",
      "description": "Unreal Engine Game Tools"
    }
  }
}`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Claude Desktop Configuration</ExampleTitle>
                        <ExampleContent>
                            Configure Claude Desktop to access Unreal Engine tools.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// In claude_desktop_config.json:
{
  "mcpServers": {
    "unreal-engine": {
      "command": "node",
      "args": ["path/to/mcp-client.js", "http://localhost:3000"]
    }
  }
}`}
                        </ExampleCpp>
                    </Example><h2>Debugging</h2>

                    <p>
                        The MCP server logs extensively to the Output Log. Key log categories:
                    </p>

                    <ul>
                        <li><strong>LogGAiEditor</strong>: Server lifecycle, startup, shutdown, and errors</li>
                        <li><strong>LogMCPServer</strong>: Request handling and tool calls</li>
                        <li>Enable <code>VeryVerbose</code> in <code>DefaultEngine.ini</code> for detailed logs</li>
                    </ul>

                    <Example>
                        <ExampleTitle>Enable Verbose Logging</ExampleTitle>
                        <ExampleContent>
                            Add to your project's <code>Config/DefaultEngine.ini</code>:
                        </ExampleContent>
                        <ExampleCpp>
                            {`[Core.Log]
LogGAiEditor=VeryVerbose
LogMCPServer=VeryVerbose`}
                        </ExampleCpp>
                    </Example>

                    <h3>Common Issues</h3>

                    <h4>Port Already in Use</h4>
                    <p>
                        If <code>Auto Kill Port Process</code> is disabled and a port is occupied, the server
                        won't start. Enable the setting or manually free the port.
                    </p>

                    <h4>Tools Not Appearing</h4>
                    <p>
                        If external clients don't see your tools:
                    </p>
                    <ul>
                        <li>Verify your MCP definition class is configured in settings</li>
                        <li>Check that <code>GetToolsToServe</code> returns tool instances</li>
                        <li>Ensure tools are properly registered in the JSON schema cache</li>
                        <li>Restart the editor to reload tool definitions</li>
                    </ul>

                    <h4>Connection Failures</h4>
                    <p>
                        If external clients can't connect:
                    </p>
                    <ul>
                        <li>Confirm MCP server is enabled and started (check Output Log)</li>
                        <li>Verify the correct port in your client configuration</li>
                        <li>Check firewall settings aren't blocking localhost connections</li>
                        <li>Ensure no other application is using the configured ports</li>
                    </ul>

                    <h2>Use Cases</h2>

                    <h3>AI-Assisted Development</h3>
                    <p>
                        Use Cursor with access to your game's tools while writing code. Ask the AI to spawn test
                        actors, create quests, or query game state without leaving your editor.
                    </p>

                    <h3>External Automation</h3>
                    <p>
                        Build Python scripts or Node.js services that control your game through the MCP interface.
                        Automate testing, content generation, or level design workflows.
                    </p>

                    <h3>Cross-Tool Integration</h3>
                    <p>
                        Bridge Unreal Engine with other development tools using MCP as a common protocol. Enable
                        AI agents to coordinate actions across multiple applications.
                    </p>

                    <h2>Limitations</h2>

                    <ul>
                        <li><strong>Editor-Only</strong>: MCP server cannot be packaged into shipping builds</li>
                        <li><strong>Localhost Only</strong>: Designed for local development, not remote access</li>
                        <li><strong>No Authentication</strong>: Assumes a trusted local environment</li>
                        <li><strong>Single Instance</strong>: One MCP server per editor instance</li>
                        <li><strong>Tool Timeout</strong>: Long-running tools may be aborted by timeout setting</li>
                    </ul>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><a href={LINK.GENERATIVE_AI.AGENTIC.USING_AGENTS}>Using Agents</a> - Create agents that use tools internally</li>
                        <li><a href={LINK.GENERATIVE_AI.FEATURES.TOOLS}>Creating Tools</a> - Tool implementation guide</li>
                        <li><a href={LINK.GENERATIVE_AI.HOSTED_TOOLS.MCP_TOOLS}>MCP Tools</a> - Use external MCP servers in your agents</li>
                    </ul>

                    <PageFooter />
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}
