import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Generative AI Integration Plugin',
    description: 'Generative AI, native to Unreal Engine',
    order: 1,
} satisfies ContentPage;

import Image from 'next/image';
import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import { Callout, Example, ExampleTitle, ExampleContent, ExampleCpp, LanguageToggleProvider } from '@/components/doc-components';
import { Button } from '@/components/ui/button';
import gaiLogo from '@/assets/GAI Logo.png';
import { LINK } from '@/lib/pages.generated';
import Link from "next/link";
import siteConfig from './site.config';

export default function HomePage() {

    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row gap-4 items-start my-4">
                        <Image
                            src={gaiLogo}
                            alt="Generative AI Plugin Logo"
                            width={160}
                            height={160}
                            className="rounded-lg border shadow-sm m-0!"
                        />
                        <p className="flex-1 text-sm text-muted-foreground leading-relaxed m-0!">
                            The Generative AI Integration Plugin brings state-of-the-art AI models directly into Unreal Engine, enabling rapid prototyping and production-ready development within the Unreal Engine editor. It fully supports OpenAI's Responses API, as well as the legacy Completions and Chat Completions APIs. Since the Chat Completions API is widely adopted, the plugin also works seamlessly with providers like Claude, Gemini, Ollama, and vLLM.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs my-6">
                        <div className="bg-muted/50 rounded px-3 py-2">
                            <div className="font-medium text-amber-400">Multi-Provider</div>
                            <div>OpenAI, Claude, Gemini, Ollama, vLLM</div>
                        </div>
                        <div className="bg-muted/50 rounded px-3 py-2">
                            <div className="font-medium text-amber-400">Streaming</div>
                            <div>in real-time token-by-token</div>
                        </div>
                        <div className="bg-muted/50 rounded px-3 py-2">
                            <div className="font-medium text-amber-400">Auto Tool Calling</div>
                            <div>and schema generation from UClass</div>
                        </div>
                        <div className="bg-muted/50 rounded px-3 py-2">
                            <div className="font-medium text-amber-400">Structured Output</div>
                            <div>via JSON to UObject conversion</div>
                        </div>
                        <div className="bg-muted/50 rounded px-3 py-2">
                            <div className="font-medium text-amber-400">Multimodal</div>
                            <div>using text, images, audio input</div>
                        </div>
                        <div className="bg-muted/50 rounded px-3 py-2">
                            <div className="font-medium text-amber-400">Hosted Tools</div>
                            <div>Code Interpreter, Web Search, File Search</div>
                        </div>
                        <div className="bg-muted/50 rounded px-3 py-2">
                            <div className="font-medium text-amber-400">Agents</div>
                            <div>Multi-turn agents with delegation & handoff</div>
                        </div>
                        <div className="bg-muted/50 rounded px-3 py-2">
                            <div className="font-medium text-amber-400">MCP Server</div>
                            <div>Expose custom tools to external agents</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center justify-center">
                        <Button asChild>
                            <a href={siteConfig.headerLinks["fab"].href} target="_blank" rel="noopener noreferrer">
                                Buy on FAB
                            </a>
                        </Button>
                        <Button asChild variant="outline">
                            <a href={siteConfig.headerLinks["github"].href} target="_blank" rel="noopener noreferrer">
                                View on GitHub
                            </a>
                        </Button>
                        <Button asChild variant="outline">
                            <a href={siteConfig.headerLinks["discord"].href} target="_blank" rel="noopener noreferrer">
                                Join Discord
                            </a>
                        </Button>
                    </div>

                    <p>
                        The plugin is designed to make it easy to work with and integrate Generative AI into your projects: stream responses as they're generated, produce structured outputs with strongly-typed schemas, call custom tools defined in your own code, and work across text, images, and audio. Whether for in-editor automation or runtime gameplay, the plugin provides a solid foundation for building advanced frameworks, especially agentic systems, while striving to remain accessible for anyone and adaptable to many kinds of tasks.
                    </p>

                    <Callout type="info" title="Beta Release">
                        <p>
                            This plugin is currently in beta. We encourage you to report any issues, request features, or provide feedback to help us improve the plugin before its stable release.
                        </p>
                        <p>
                            The plugin fully implements all low-level features and some convenience methods. More convenience methods will be added in the future.
                        </p>
                    </Callout>

                    <h2>Key Features</h2>

                    <h3>Multi-API Support with Thread-Safe Sessions</h3>

                    <p>
                        The plugin provides a unified session interface that supports three different API types, each optimized for different use cases.
                        All sessions are thread-safe and available in both C++ and Blueprints.
                    </p>

                    <Example>
                        <ExampleTitle>Responses API - Modern Agentic Workflows</ExampleTitle>
                        <ExampleContent>
                            The Responses API is OpenAI's modern interface designed for agentic workflows. It provides hosted tools like
                            Code Interpreter, File Search, Image Generation, and Web Search. Sessions manage multi-turn conversations
                            automatically, making it ideal for building agents that need to maintain context and execute complex tasks.
                        </ExampleContent>
                        <ExampleCpp>
                            {`auto* Session = UGAiResponsesApiSession::CreateChatSession(
    EndpointConfig,
    this,
    TEXT("You are a helpful assistant."),
    TEXT("Hello!")
);

Session->Generate(/* callbacks */);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Chat Completions API - Broad Provider Support</ExampleTitle>
                        <ExampleContent>
                            The Chat Completions API follows OpenAI's widely-adopted standard, making it compatible with most providers
                            including OpenAI, Claude, Gemini, Ollama, and vLLM. Use this for maximum provider flexibility.
                        </ExampleContent>
                        <ExampleCpp>
                            {`auto* Session = UGAiCompletionsApiSession::CreateChatGenerationContext(
    EndpointConfig,
    this,
    TEXT("You are a quest narrator."),
    TEXT("Begin the adventure!")
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Completions API - Simple Text Generation</ExampleTitle>
                        <ExampleContent>
                            The legacy Completions API is designed for straightforward text completion tasks without conversation history.
                            Perfect for simple prompts and single-turn generations.
                        </ExampleContent>
                        <ExampleCpp>
                            {`auto* Session = UGAiCompletionsApiSession::CreateTextGenerationContext(
    EndpointConfig,
    this,
    TEXT("Complete this story: Once upon a time...")
);`}
                        </ExampleCpp>
                    </Example>

                    <h3>Extensive Provider Support</h3>

                    <p>
                        The plugin works with all major AI providers through flexible endpoint configurations. Switch between providers
                        seamlessly or use multiple providers in the same project.
                    </p>

                    <ul>
                        <li><strong>OpenAI</strong> - Full support for GPT-4, GPT-4o, o1-preview, and other models</li>
                        <li><strong>Anthropic Claude</strong> - Claude 3.5 Sonnet, Claude 3 Opus, and other Claude models</li>
                        <li><strong>Google Gemini</strong> - Gemini 2.0 Flash and other Gemini models</li>
                        <li><strong>Ollama</strong> - Local deployment for offline development and testing</li>
                        <li><strong>vLLM</strong> - High-performance inference for self-hosted models</li>
                        <li><strong>Custom Endpoints</strong> - Any OpenAI-compatible API endpoint</li>
                    </ul>

                    <Example>
                        <ExampleTitle>Powerful Tool System with Automatic Execution</ExampleTitle>
                        <ExampleContent>
                            Define custom tools via UClasses and let the plugin handle everything else. The plugin automatically generates
                            JSON schemas, manages tool execution, and converts between JSON and Unreal Engine objects. You maintain full
                            control over the execution flow while the plugin handles the tedious parts.
                        </ExampleContent>
                        <ExampleCpp>
                            {`UCLASS(BlueprintType, Blueprintable, meta = (ToolTip = "Attack action: NPC attacks a named target."))
class UExampleNpcAttackTool : public UGAiTool
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite, 
              meta = (ToolTip = "Target to attack (name or tag)"))
    FString Target;

    // Excluded from schema; set by game code so tools can act on a pawn without exposing it to the model
    UPROPERTY(EditAnywhere, BlueprintReadWrite, 
              meta = (JsonSchema_ExcludeFromSchema))
    APawn* TargetPawn = nullptr;

    virtual FToolExecutionResult OnCalled_Implementation() override
    {
        const FString PawnName = (TargetPawn && TargetPawn->GetName().Len() > 0) ? TargetPawn->GetName() : TEXT("UnknownPawn");
        const FString Msg = FString::Printf(TEXT("%s attacks %s!"), *PawnName, *Target);
        UE_LOG(LogTemp, Log, TEXT("[Tool] %s"), *Msg);
        return FToolExecutionResult::Success(Msg);
    }
};

// Use the tool
Session->AddToolByClass(UMyCustomTool::StaticClass());`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Automatic Tool Execution">
                        <p>
                            Tools are executed automatically by default. You can also intercept tool calls with the
                            <code>OnToolCall</code> callback for custom validation, logging, or execution logic.
                        </p>
                    </Callout>

                    <Example>
                        <ExampleTitle>Real-Time Streaming with Granular Control</ExampleTitle>
                        <ExampleContent>
                            Stream AI responses in real-time for responsive user experiences. Access individual streaming deltas and react to specific content types. Perfect for building
                            responsive UIs that show different types of content as they arrive. The Responses API additionally provides granular control
                            over streaming chunks, allowing you to select the specific deltas to react to (text, tool calls, reasoning, etc.).
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Configure which streaming events to react to (Responses API only)
Session->StreamOptions = static_cast<int32>(EResponsesApiStreamOption::OutputText | EResponsesApiStreamOption::RefusalText);

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx) { /* ... */ }),
    FOnGenerationStreamChunk::CreateLambda([](const UGAiSession* Ctx)
    {
        // Get the current chunk text
        FString ChunkText = Ctx->GetCurrentStreamChunkText();

        // Or access granular delta information
        const auto* ResponsesSession = Cast<UGAiResponsesApiSession>(Ctx);
        if (ResponsesSession)
        {
            const auto& Delta = ResponsesSession->CurrentStreamChunk;
            // React to specific delta types: text, tool calls, reasoning, etc.
        }
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Structured Output with Type Safety</ExampleTitle>
                        <ExampleContent>
                            Define output schemas using UClasses and receive strongly-typed objects instead of JSON. The plugin
                            automatically generates JSON schemas, validates responses, and converts JSON to UClass instances. See the <a href={LINK.JSON_SCHEMA.INDEX}>JSON Schema Plugin</a> for more details.
                        </ExampleContent>
                        <ExampleCpp>
                            {`UCLASS()
class UCharacterStats : public UObject, public IJsonSchema
{
    GENERATED_BODY()

    UPROPERTY()
    FString Name;

    UPROPERTY()
    int32 Health;

    UPROPERTY()
    int32 Strength;
};

// Configure session for structured output
Session->SetResponseFormat(EResponsesApiTextFormatType::JsonSchema, UCharacterStats::StaticClass());

// After generation, access the parsed object
Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        // Strongly-typed access, no JSON parsing!
        auto* CharStats = Cast<UCharacterStats>(Ctx->StructuredOutput);
        UE_LOG(LogTemp, Log, TEXT("Character: %s, HP: %d"),
            *CharStats->Name, CharStats->Health);
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h3>Multi-Modal Input and Output</h3>

                    <p>
                        Work with text, images, and audio seamlessly. Send images for analysis, generate images with hosted tools,
                        or process audio inputs depending on your provider's capabilities.
                    </p>

                    <h3>Comprehensive JSON Schema Support</h3>

                    <p>
                        The plugin includes everything from the <a href={LINK.JSON_SCHEMA.INDEX}>JSON Schema Plugin</a>, providing automatic
                        schema generation and bidirectional conversion between JSON and UClass instances. This powers both the tool
                        system and structured output features.
                    </p>

                    <ul>
                        <li>Make any UClass JSON schema-aware with automatic schema generation</li>
                        <li>Bidirectional conversion between JSON objects and UClass instances</li>
                        <li>Support for complex types, arrays, nested objects, and enums</li>
                        <li>No manual schema writing required</li>
                    </ul>

                    <h3>Agentic Framework Support</h3>

                    <p>
                        Build sophisticated AI agents with a flexible framework that supports multi-turn conversations, tool execution,
                        and sub-agent hierarchies via <b>Delegation</b> or <b>Handoff</b>. The Responses API's automatic conversation management makes building agents
                        straightforward.
                    </p>

                    <h3>MCP Server Integration</h3>

                    <p>
                        Host your Unreal Engine tools as an MCP (Model Context Protocol) server, making them accessible to external
                        agents and applications. Connect Cursor, Claude Desktop, or any MCP-compatible client to your Unreal Engine
                        code.
                    </p>

                    <Example>
                        <ExampleTitle>Expose UE Tools Externally</ExampleTitle>
                        <ExampleContent>
                            Run an MCP server that exposes your Unreal Engine tools to external AI agents. Both Blueprint and C++ tools
                            can be called from external applications like Cursor, Claude Desktop, or custom MCP clients.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Your tools are automatically available via MCP
// External agents can call your Unreal Engine code!`}
                        </ExampleCpp>
                    </Example>

                    <h2>API Compatibility</h2>

                    <p>
                        The plugin is built to fully follow the OpenAI Responses API and Completion/Chat Completion APIs.
                        If you have prior experience with OpenAI's APIs, you should be able to start using the plugin right away
                        with your existing knowledge. Request structures, response formats, and parameter options are designed to
                        mirror the official OpenAI specification, making the transition straightforward and familiar.
                    </p>

                    <Callout type="info" title="Note on Computer Use">
                        <p>The Computer Use tool hosted by OpenAI is not supported in this plugin.</p>
                    </Callout>

                    <h2>Getting Started</h2>

                    <p>
                        Ready to integrate AI into your Unreal Engine project? Follow the setup guide to configure your first
                        endpoint and create your first session.
                    </p>

                    <ul>
                        <li><a href={LINK.GENERATIVE_AI.GETTING_STARTED}>Getting Started</a> - Set up the plugin and create your first session</li>
                        <li><a href={LINK.GENERATIVE_AI.CORE.USING_SESSIONS}>Using Sessions</a> - Learn how sessions work</li>
                    </ul>

                </LanguageToggleProvider>
                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
