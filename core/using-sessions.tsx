import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Using Sessions',
    description: `Sessions are the foundation of all AI interactions in the plugin. A session manages
                  conversation history, handles API requests, executes tool calls, and provides access to
                  generated content. This guide covers everything you need to know about creating and managing sessions.`,
    order: 9
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
} from '@/components/doc-components';

export default function SessionBasicsPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />
                    <h2>Creating Sessions</h2>

                    <p>
                        Both API types (Responses and Completions) provide unified factory methods for creating sessions.
                        The primary difference is in their feature support and provider compatibility.
                    </p>

                    <Example>
                        <ExampleTitle>Creating a Responses API Session</ExampleTitle>
                        <ExampleContent>
                            The modern API with hosted tools, MCP integration, and rich response types. Recommended for new projects
                            using OpenAI or Anthropic providers. See the <a href="/generative-ai/responses-api">Responses API</a> page
                            for complete feature documentation.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "GenerativeAi/Sessions/GAiResponsesApiSession.h"

// Create chat session with system prompt and initial message
auto* Session = UGAiResponsesApiSession::CreateChatSession(
    EndpointConfig,
    this,
    TEXT("You are a helpful NPC guide."),
    TEXT("Welcome to the dungeon!")
);

// Or create a simple completion session
auto* CompletionSession = UGAiResponsesApiSession::CreateCompletionSession(
    EndpointConfig,
    this,
    TEXT("Generate a fantasy character name: ")
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Creating a Completions API Session</ExampleTitle>
                        <ExampleContent>
                            OpenAI-compatible API that works with most providers including OpenAI, Claude, Gemini, Ollama, and vLLM.
                            See the <a href="/generative-ai/api/completions-api">Completions API</a> page for complete feature documentation.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "GenerativeAi/Sessions/GAiCompletionsApiSession.h"

// Create chat session
auto* Session = UGAiCompletionsApiSession::CreateChatGenerationContext(
    EndpointConfig,
    this,
    TEXT("You are a quest narrator."),
    TEXT("Begin the adventure!")
);

// Or create a text completion session
auto* TextSession = UGAiCompletionsApiSession::CreateTextGenerationContext(
    EndpointConfig,
    this,
    TEXT("Complete this story: Once upon a time...")
);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Blueprint Support">
                        <p>
                            Use <code>Create Chat Session</code> and <code>Create Completion Session</code> nodes
                            in Blueprints. Find them under the <strong>Generative AI</strong> category.
                        </p>
                    </Callout>

                    <Example>
                        <ExampleTitle>Basic Usage Example</ExampleTitle>
                        <ExampleContent>
                            Here's a complete example showing the typical workflow: initialize a session, build conversation context,
                            generate a response, and handle the result.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// (1) Initialize the session
auto* Session = UGAiResponsesApiSession::CreateChatSession(
    EndpointConfig,
    this,
    TEXT("You are a friendly blacksmith NPC."),
    TEXT("")
);

// (2) Build conversation context
Session->Request.MaxOutputTokens = 150;
Session->Request.Temperature = 0.8f;

Session->AddUserMessage(TEXT("Do you have any iron swords?"));

// (3) Generate
Session->Generate(
    // (4) Handle response
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        FString Response = Ctx->GetAggregatedResponseText();
        UE_LOG(LogTemp, Log, TEXT("NPC: %s"), *Response);
    }),
    // Handle errors
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx)
    {
        UE_LOG(LogTemp, Error, TEXT("Error: %s"), *Ctx->GetErrorMessage());
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="warning" title="Async Execution">
                        <p>
                            <code>Generate()</code> is asynchronous and returns immediately. Results arrive in callbacks.
                            If you call <code>Generate()</code> again while a request is in progress, the call will block
                            the calling thread until the previous generation completes.
                        </p>
                    </Callout>

                    <h2>Session Lifecycle</h2>

                    <h3>Thread Safety</h3>

                    <p>
                        Sessions are thread-safe. Parallel calls to <code>Generate()</code> on the same session instance
                        will block until the current generation completes. This prevents race conditions but means you should
                        avoid calling <code>Generate()</code> multiple times simultaneously on a single session.
                    </p>

                    <Example>
                        <ExampleTitle>One-Shot Sessions</ExampleTitle>
                        <ExampleContent>
                            For single-use generations, create temporary sessions without storing them. The garbage collector will clean them up automatically.
                        </ExampleContent>
                        <ExampleCpp>
                            {`void GenerateItemDescription(const FString& ItemName)
{
    auto* Session = UGAiResponsesApiSession::CreateCompletionSession(
        EndpointConfig,
        GetTransientPackage(),
        FString::Printf(TEXT("Describe: %s"), *ItemName)
    );

    Session->Generate(/* callbacks */);
    // Session is automatically garbage collected
}`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Multi-Turn Conversations</ExampleTitle>
                        <ExampleContent>
                            For persistent conversations, store the session as a <code>UPROPERTY</code> to prevent garbage collection.
                            This allows you to maintain conversation history across multiple turns.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// In header file
UPROPERTY()
UGAiResponsesApiSession* ChatSession;

// Initialize once
void InitChat()
{
    ChatSession = UGAiResponsesApiSession::CreateChatSession(
        EndpointConfig,
        this,
        TEXT("You are an NPC."),
        TEXT("")
    );
}

// Reuse for multiple turns
void SendMessage(const FString& Text)
{
    ChatSession->AddUserMessage(Text);
    ChatSession->Generate(/* callbacks */);
}`}
                        </ExampleCpp>
                    </Example>
                    <Example>
                        <ExampleTitle>Reset Sessions</ExampleTitle>
                        <ExampleContent>
                            Sessions can be reset to clear messages and configuration options.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Clear messages but keep configuration (tools, request settings)
Session->Reset(true);

// Clear everything including configuration
Session->Reset(false);

// Clear only messages
Session->ClearMessages();`}
                        </ExampleCpp>
                    </Example>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><a href="/generative-ai/generation-callbacks">Generation Callbacks</a> - Learn more about the generation callbacks.</li>
                        <li><a href="/generative-ai/sessions-api-reference">Sessions API Reference</a> - View the full API of the session class.</li>
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
