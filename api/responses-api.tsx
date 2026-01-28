import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Responses API',
    description: 'Complete guide to using the Responses API (recommended)',
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
} from '@/components/doc-components';

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
                        <li><strong>Rich Responses</strong>: Citations, reasoning traces, structured items</li>
                        <li><strong>Modern Features</strong>: Latest AI capabilities as they're released</li>
                    </ul>

                    <h2>Creating a Session</h2>

                    <h3>Chat Session</h3>

                    <Example>
                        <ExampleTitle>Chat Session</ExampleTitle>
                        <ExampleContent>
                            Create a chat session with system prompt and initial message for conversations.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "GenerativeAi/Sessions/GAiResponsesApiSession.h"

// Create chat session with system prompt and initial message
auto* Session = UGAiResponsesApiSession::CreateChatSession(
    EndpointConfig,
    this,
    TEXT("You are a helpful quest designer."),
    TEXT("Create a quest for a fantasy RPG.")
);`}
                        </ExampleCpp>
                    </Example>

                    <h3>Completion Session</h3>

                    <Example>
                        <ExampleTitle>Completion Session</ExampleTitle>
                        <ExampleContent>
                            Create a completion session for text generation without conversation history.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Simple completion-style session
auto* Session = UGAiResponsesApiSession::CreateCompletionSession(
    EndpointConfig,
    this,
    TEXT("Generate a fantasy character name: ")
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Request Configuration</h2>

                    <p>Configure via <code>Session-&gt;Request</code>:</p>

                    <Example>
                        <ExampleTitle>Request Parameters</ExampleTitle>
                        <ExampleContent>
                            Configure generation parameters including output limits, sampling, penalties, and tool execution settings.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Output limits
Session->Request.MaxOutputTokens = 1024;    // Max output length
Session->Request.MaxPromptTokens = 4096;    // Max input length (optional)

// Sampling parameters
Session->Request.Temperature = 0.7f;        // Creativity (0.0-2.0)
Session->Request.TopP = 0.9f;               // Nucleus sampling
Session->Request.TopK = 40;                 // Top-K sampling

// Penalties
Session->Request.FrequencyPenalty = 0.0f;   // Reduce repetition
Session->Request.PresencePenalty = 0.0f;    // Encourage new topics

// Stop sequences
Session->Request.Stop = {TEXT("\\n\\n"), TEXT("END")};

// Reproducibility
Session->Request.Seed = 12345;

// Parallel tool calls
Session->Request.ParallelToolCalls = true;  // Execute tools in parallel`}
                        </ExampleCpp>
                    </Example>

                    <h3>Common Configurations</h3>

                    <Example>
                        <ExampleTitle>Common Configurations</ExampleTitle>
                        <ExampleContent>
                            Preset configurations for different use cases like creative writing, factual responses, and performance optimization.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Creative writing
Session->Request.Temperature = 1.2f;
Session->Request.TopP = 0.95f;

// Precise/factual
Session->Request.Temperature = 0.2f;
Session->Request.Seed = 42;

// Fast responses
Session->Request.MaxOutputTokens = 150;

// Long-form content
Session->Request.MaxOutputTokens = 4096;`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Response Handling">
                        <p>
                            For details on processing AI responses, working with response items, token usage, and error handling,
                            see the <strong>Response Handling</strong> feature page.
                        </p>
                    </Callout>

                    <h2>Custom Tools</h2>

                    <p>Add custom tools to enable AI to execute game functions:</p>

                    <Example>
                        <ExampleTitle>Using Custom Tools</ExampleTitle>
                        <ExampleContent>
                            Create a session and register custom tools. Tools execute automatically during generation.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Create session
auto* Session = UGAiResponsesApiSession::CreateChatSession(
    EndpointConfig, this,
    TEXT("You are an NPC AI. Use tools to perform actions."),
    TEXT("The player asks for help finding the inn.")
);

// Add custom tools
Session->AddToolByClass(UGetLocationTool::StaticClass());
Session->AddToolByClass(UGiveDirectionsTool::StaticClass());

// Tools execute automatically during generation
Session->Generate(/* ... */);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Custom Tools">
                        <p>
                            For complete documentation on creating custom tools, see the <strong>Tools</strong> feature page.
                        </p>
                    </Callout>

                    <h3>Hosted Tools (Responses API Exclusive)</h3>

                    <p>The Responses API supports provider-integrated hosted tools:</p>

                    <ul>
                        <li><strong>Web Search</strong>: Search the internet for current information</li>
                        <li><strong>File Search</strong>: Search through uploaded documents</li>
                        <li><strong>Code Interpreter</strong>: Execute Python code in a sandbox</li>
                        <li><strong>Image Generation</strong>: Generate images with DALL-E</li>
                    </ul>

                    <Example>
                        <ExampleTitle>Using Hosted Tools</ExampleTitle>
                        <ExampleContent>
                            Add provider-integrated hosted tools like web search, file search, code interpreter, and image generation.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "GenerativeAi/Sessions/GAiResponsesApi.h"
#include "GenerativeAi/Utility/InstancedStructUtils.h"

// Web search tool
FResponsesApiWebSearchTool WebSearch;
WebSearch.SearchContextSize = EResponsesApiWebSearchContextSize::Medium;
Session->Request.Tools.Add(MakeInstancedStruct(WebSearch));`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Hosted Tools Documentation">
                        <p>
                            For detailed guides on each hosted tool type including configuration options,
                            use cases, and examples, see the <strong>Tools → Hosted Tools</strong> section.
                        </p>
                    </Callout>

                    <h2>Tool Choice Control</h2>

                    <Example>
                        <ExampleTitle>Tool Choice Control</ExampleTitle>
                        <ExampleContent>
                            Control how the AI uses tools: auto-select, require tool use, force specific tools, or disable tools entirely.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Let AI decide
Session->Request.ToolChoice = FResponsesApiToolChoice{};
Session->Request.ToolChoice->Mode = EResponsesApiToolChoiceMode::Auto;

// Require tool use
Session->Request.ToolChoice->Mode = EResponsesApiToolChoiceMode::Required;

// Force specific tool
Session->Request.ToolChoice->Mode = EResponsesApiToolChoiceMode::Function;
Session->Request.ToolChoice->FunctionName = TEXT("GetLocation");

// Disable tools for this request
Session->Request.ToolChoice->Mode = EResponsesApiToolChoiceMode::None;`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Streaming">
                        <p>
                            For real-time response streaming and stream options configuration,
                            see the <strong>Streaming</strong> feature page.
                        </p>
                    </Callout>

                    <Callout type="info" title="Multimodal Inputs">
                        <p>
                            For working with images and vision capabilities, see the <strong>Multimodal Inputs</strong> feature page.
                        </p>
                    </Callout>

                    <Callout type="info" title="Structured Output">
                        <p>
                            For type-safe structured data and JSON schema configuration,
                            see the <strong>Structured Output</strong> feature page.
                        </p>
                    </Callout>

                    <h2>Reasoning Models</h2>

                    <p>Some models (like o1) support extended reasoning:</p>

                    <Example>
                        <ExampleTitle>Reasoning Models</ExampleTitle>
                        <ExampleContent>
                            Enable extended reasoning on models that support it (like o1). Control reasoning effort and stream reasoning traces.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Enable reasoning options
Session->Request.Reasoning = FResponsesApiReasoningOptions();
Session->Request.Reasoning->Effort = TEXT("high");  // or "medium", "low"

// Stream reasoning traces
Session->SetStreamOptions(
    static_cast<int32>(EResponsesApiStreamOption::ReasoningEncryptedContent)
);

Session->Generate(/* ... */);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Complete Example: Chat with Hosted Tools</h2>

                    <Example>
                        <ExampleTitle>Chat with Hosted Tools</ExampleTitle>
                        <ExampleContent>
                            A complete example showing how to create a chat session with web search, configure parameters, and handle tool execution.
                        </ExampleContent>
                        <ExampleCpp>
                            {`class UEnhancedChatSystem : public UObject
{
    UPROPERTY()
    UGAiResponsesApiSession* Session;

public:
    void Initialize(UGAiEndpointConfig* Config)
    {
        // Create session
        Session = UGAiResponsesApiSession::CreateChatSession(
            Config, this,
            TEXT("You are a helpful assistant with access to web search. "
                 "Use web search when you need current information."),
            TEXT("")
        );

        // Configure request
        Session->Request.MaxOutputTokens = 512;
        Session->Request.Temperature = 0.7f;

        // Add web search tool
        FResponsesApiWebSearchTool WebSearch;
        WebSearch.SearchContextSize = EResponsesApiWebSearchContextSize::Medium;
        Session->Request.Tools.Add(MakeInstancedStruct(WebSearch));

        // Allow AI to decide when to use tools
        Session->Request.ToolChoice = FResponsesApiToolChoice{};
        Session->Request.ToolChoice->Mode = EResponsesApiToolChoiceMode::Auto;

        // Limit tool execution loops
        Session->MaxApiRequests = 3;
    }

    void SendMessage(const FString& Message)
    {
        Session->AddUserMessage(Message);

        Session->Generate(
            FOnGenerationComplete::CreateLambda([this](const UGAiSession* Ctx)
            {
                if (Ctx->HasError())
                {
                    HandleError(Ctx->GetErrorMessage());
                    return;
                }

                FString Response = Ctx->GetAggregatedResponseText();
                DisplayResponse(Response);
            }),
            FOnGenerationError::CreateLambda([this](const UGAiSession* Ctx)
            {
                HandleError(Ctx->GetErrorMessage());
            })
        );
    }

private:
    void DisplayResponse(const FString& Text)
    {
        UE_LOG(LogTemp, Log, TEXT("[AI] %s"), *Text);
        // Update UI...
    }

    void HandleError(const FString& Error)
    {
        UE_LOG(LogTemp, Error, TEXT("[Error] %s"), *Error);
        // Show error message...
    }
};`}
                        </ExampleCpp>
                    </Example>

                    <h2>MCP Integration</h2>

                    <p>Use Model Context Protocol tools:</p>

                    <Example>
                        <ExampleTitle>MCP Integration</ExampleTitle>
                        <ExampleContent>
                            Use Model Context Protocol (MCP) tools configured via the MCP server subsystem. MCP tools work like other tools.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// MCP tool (configured via MCP server subsystem)
FResponsesApiMcpTool McpTool;
McpTool.ToolName = TEXT("my_external_tool");
Session->Request.Tools.Add(MakeInstancedStruct(McpTool));

// MCP tools work like any other tool
Session->Generate(/* ... */);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="MCP Server">
                        <p>
                            See the <strong>Agentic / MCP Server</strong> page for complete documentation
                            on setting up and using the MCP server subsystem.
                        </p>
                    </Callout>

                    <h2>Metadata</h2>

                    <p>Attach metadata to requests:</p>

                    <Example>
                        <ExampleTitle>Request Metadata</ExampleTitle>
                        <ExampleContent>
                            Add custom metadata to track and identify requests in your application.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Request.Metadata.Add(TEXT("user_id"), TEXT("player_123"));
Session->Request.Metadata.Add(TEXT("session_id"), TEXT("game_session_456"));
Session->Request.Metadata.Add(TEXT("context"), TEXT("quest_dialogue"));`}
                        </ExampleCpp>
                    </Example>

                    <h2>Provider Compatibility</h2>

                    <p>Responses API works best with:</p>

                    <ul>
                        <li><strong>OpenAI</strong>: Full support including all hosted tools</li>
                        <li><strong>Anthropic (Claude)</strong>: Native Messages API support</li>
                        <li><strong>Others</strong>: May have limited feature support</li>
                    </ul>

                    <Callout type="warning" title="Feature Availability">
                        <p>
                            Hosted tools (web search, file search, etc.) are provider-specific.
                            Check your provider's documentation for supported features.
                        </p>
                    </Callout>

                    <h2>Completions API vs Responses API</h2>

                    <div className="mb-4">
                        <table className="w-full border-collapse border border-border">
                            <thead>
                                <tr className="bg-muted">
                                    <th className="border border-border p-2 text-left">Feature</th>
                                    <th className="border border-border p-2 text-left">Completions API</th>
                                    <th className="border border-border p-2 text-left">Responses API</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-border p-2">Provider Compatibility</td>
                                    <td className="border border-border p-2">Wide</td>
                                    <td className="border border-border p-2">OpenAI, Claude</td>
                                </tr>
                                <tr>
                                    <td className="border border-border p-2">Custom Tools</td>
                                    <td className="border border-border p-2">✓</td>
                                    <td className="border border-border p-2">✓</td>
                                </tr>
                                <tr>
                                    <td className="border border-border p-2">Hosted Tools</td>
                                    <td className="border border-border p-2">✗</td>
                                    <td className="border border-border p-2">✓</td>
                                </tr>
                                <tr>
                                    <td className="border border-border p-2">MCP Integration</td>
                                    <td className="border border-border p-2">✗</td>
                                    <td className="border border-border p-2">✓</td>
                                </tr>
                                <tr>
                                    <td className="border border-border p-2">Rich Response Items</td>
                                    <td className="border border-border p-2">✗</td>
                                    <td className="border border-border p-2">✓</td>
                                </tr>
                                <tr>
                                    <td className="border border-border p-2">Reasoning Traces</td>
                                    <td className="border border-border p-2">✗</td>
                                    <td className="border border-border p-2">✓</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><strong>Response Handling</strong>: Work with response items and process outputs</li>
                        <li><strong>Hosted Tools</strong>: Learn about web search, file search, code interpreter, and image generation</li>
                        <li><strong>Tools</strong>: Create custom AI functions</li>
                        <li><strong>Streaming</strong>: Real-time response generation</li>
                        <li><strong>Multimodal Inputs</strong>: Work with images and vision</li>
                        <li><strong>Structured Output</strong>: Get type-safe, validated responses</li>
                        <li><strong>Agentic</strong>: Build autonomous AI agents</li>
                    </ul>

                </LanguageToggleProvider>


                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
