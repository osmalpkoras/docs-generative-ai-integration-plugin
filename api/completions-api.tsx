import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Completions API',
    description: 'Complete guide to using the Completions API',
    order: 101,
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

export default function CompletionsApiPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <h2>When to Use Completions API</h2>

                    <ul>
                        <li><strong>Wide Compatibility</strong>: Works with most AI providers</li>
                        <li><strong>Familiar</strong>: If you know OpenAI's API, you know this</li>
                        <li><strong>Legacy Projects</strong>: Migrating existing OpenAI integrations</li>
                    </ul>

                    <Callout type="info" title="Responses API Recommended">
                        <p>
                            For new projects, consider the <strong>Responses API</strong> which offers hosted tools,
                            MCP integration, and richer response types. This API remains fully supported for compatibility.
                        </p>
                    </Callout>

                    <h2>Creating a Session</h2>

                    <h3>Chat Session</h3>

                    <Example>
                        <ExampleTitle>Creating a Chat Session</ExampleTitle>
                        <ExampleContent>
                            Initialize a chat session with a system prompt and initial message.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "GenerativeAi/Sessions/GAiCompletionsApiSession.h"

// Create chat session with system prompt
auto* Session = UGAiCompletionsApiSession::CreateChatGenerationContext(
    EndpointConfig,
    this,
    TEXT("You are a quest narrator."),
    TEXT("Begin the adventure!")
);`}
                        </ExampleCpp>
                    </Example>

                    <h3>Text Completion Session</h3>

                    <Example>
                        <ExampleTitle>Text Completion Session</ExampleTitle>
                        <ExampleContent>
                            Create a text completion session to continue text without conversation history.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Simple text completion
auto* Session = UGAiCompletionsApiSession::CreateTextGenerationContext(
    EndpointConfig,
    this,
    TEXT("Complete this story: Once upon a time in a dark forest, ")
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Request Configuration</h2>

                    <p>Configure generation parameters via <code>Session-&gt;Request</code>:</p>

                    <Example>
                        <ExampleTitle>Request Parameters</ExampleTitle>
                        <ExampleContent>
                            Configure generation parameters to control output quality, creativity, reproducibility, and response format.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Basic parameters
Session->Request.MaxTokens = 512;           // Max output length
Session->Request.Temperature = 0.7f;        // Creativity (0.0-2.0)
Session->Request.TopP = 0.9f;               // Nucleus sampling
Session->Request.FrequencyPenalty = 0.0f;   // Reduce repetition
Session->Request.PresencePenalty = 0.0f;    // Encourage new topics

// Stop sequences
Session->Request.Stop = {TEXT("\\n\\n"), TEXT("END")};

// Reproducibility
Session->Request.Seed = 12345;  // Same seed = same output

// Number of responses
Session->Request.N = 1;  // Generate N variations`}
                        </ExampleCpp>
                    </Example>

                    <h3>Common Configurations</h3>

                    <div className="mb-4">
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto"><code className="language-cpp">{`// Creative writing
Session->Request.Temperature = 1.0f;
Session->Request.TopP = 0.95f;

// Precise/deterministic
Session->Request.Temperature = 0.2f;
Session->Request.Seed = 42;

// Concise responses
Session->Request.MaxTokens = 100;

// Code generation
Session->Request.Temperature = 0.1f;
Session->Request.Stop = {TEXT("\`\`\`")};`}</code></pre>
                    </div>

                    <h2>Message Format</h2>

                    <p>Messages are added with roles:</p>

                    <Example>
                        <ExampleTitle>Message Format</ExampleTitle>
                        <ExampleContent>
                            Add messages to the session with different roles to build a conversation context.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// System message (instructions)
Session->SetSystemMessage(TEXT("You are a helpful dungeon master."));

// User message (player input)
Session->AddUserMessage(TEXT("I open the door."));

// Assistant message (AI response or context)
Session->AddAssistantMessage(TEXT("The door creaks open..."));`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Response Handling">
                        <p>
                            For details on processing AI responses, token usage, error handling, and multiple choices,
                            see the <strong>Response Handling</strong> feature page.
                        </p>
                    </Callout>

                    <Callout type="info" title="Tool Calling">
                        <p>
                            For complete documentation on creating and using tools, including custom tool implementation,
                            tool parameters, and execution flow, see the <strong>Tools</strong> feature page.
                        </p>
                    </Callout>

                    <Callout type="info" title="Multimodal Inputs">
                        <p>
                            For working with images and vision capabilities, see the <strong>Multimodal Inputs</strong> feature page.
                        </p>
                    </Callout>

                    <Callout type="info" title="Streaming">
                        <p>
                            For real-time response streaming, see the <strong>Streaming</strong> feature page.
                        </p>
                    </Callout>

                    <Callout type="info" title="Structured Output">
                        <p>
                            For JSON mode and type-safe structured outputs, see the <strong>Structured Output</strong> feature page.
                        </p>
                    </Callout>

                    <h2>Complete Example: Basic Chat Session</h2>

                    <Example>
                        <ExampleTitle>Complete Chat System</ExampleTitle>
                        <ExampleContent>
                            A complete example showing how to create a chat session, configure parameters, send messages, and handle responses with error checking.
                        </ExampleContent>
                        <ExampleCpp>
                            {`class UBasicChatSystem : public UObject
{
    UPROPERTY()
    UGAiCompletionsApiSession* Session;

public:
    void Initialize(UGAiEndpointConfig* Config)
    {
        // Create chat session
        Session = UGAiCompletionsApiSession::CreateChatGenerationContext(
            Config, this,
            TEXT("You are a helpful assistant for a fantasy RPG game."),
            TEXT("Hello! I'm here to help with your adventure.")
        );

        // Configure request parameters
        Session->Request.MaxTokens = 512;
        Session->Request.Temperature = 0.7f;
        Session->Request.TopP = 0.9f;
    }

    void SendMessage(const FString& Message)
    {
        // Add user message to conversation
        Session->AddUserMessage(Message);

        // Generate response
        Session->Generate(
            FOnGenerationComplete::CreateLambda([this](const UGAiSession* Ctx)
            {
                if (Ctx->HasError())
                {
                    HandleError(Ctx->GetErrorMessage());
                    return;
                }

                // Get AI response
                FString Response = Ctx->GetAggregatedResponseText();
                DisplayResponse(Response);

                // Log token usage
                int32 Tokens = Ctx->GetTotalTokensUsed();
                UE_LOG(LogTemp, Log, TEXT("Tokens used: %d"), Tokens);
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

                    <h2>Provider Compatibility</h2>

                    <p>The Completions API works with:</p>

                    <ul>
                        <li><strong>OpenAI</strong>: Full support including vision, tools, JSON mode</li>
                        <li><strong>Anthropic (Claude)</strong>: Via Messages API compatibility</li>
                        <li><strong>Google (Gemini)</strong>: Via OpenAI-compatible endpoint</li>
                        <li><strong>Ollama</strong>: Local models with OpenAI API</li>
                        <li><strong>vLLM</strong>: Self-hosted with OpenAI compatibility</li>
                    </ul>

                    <Callout type="info" title="Feature Support Varies">
                        <p>
                            Not all providers support all features (e.g., tools, vision, JSON mode).
                            Check your provider's documentation for supported capabilities.
                        </p>
                    </Callout>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><strong>Responses API</strong>: Learn about the modern API with hosted tools</li>
                        <li><strong>Response Handling</strong>: Process AI responses and handle errors</li>
                        <li><strong>Tools</strong>: Create custom AI functions</li>
                        <li><strong>Streaming</strong>: Real-time response generation</li>
                        <li><strong>Multimodal Inputs</strong>: Work with images and vision</li>
                        <li><strong>Structured Output</strong>: Type-safe AI responses</li>
                    </ul>

                </LanguageToggleProvider>


                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
