import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Chat Generation',
    description: 'Conversational AI with structured message roles and context',
    order: 2,
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
} from '@/components/doc-components';

export default function ChatCompletionPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="font-bold m-0!">Chat Completion</h1>
                        <LanguageToggle />
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        Chat completion uses structured message roles (<code>system</code>, <code>user</code>, <code>assistant</code>)
                        to establish context and maintain conversation state. This enables multi-turn interactions and fine-grained control over the AI's behavior.
                    </p>

                    <h2>Session</h2>
                    <p>
                        A chat completion <strong>session</strong> is stateful: it automatically maintains the full conversation history, including all messages,
                        tool calls, and tool call results. Each new request appends to this history unless the messages are explicitly cleared or replaced.
                    </p>

                    <p>
                        Tools and structured output formats registered with the session are also preserved across requests, ensuring consistent behavior without
                        needing to re-register them. Likewise, request parameters are retained and reused for every generation call until explicitly reset.
                    </p>

                    <p>
                        This design removes most of the overhead of manually managing context, tools, and parameters, while still allowing full control when you
                        need to reset or reconfigure the session state.
                    </p>

                    <h2>Session Creation</h2>

                    <p>
                        Chat completion sessions are created using <code>CreateChatGenerationContext</code>, which initializes
                        the conversation with optional system and user messages.
                    </p>
                    <CodeExample
                        title="CreateChatGenerationContext Signature"
                        description="Factory method for chat completion with role-based message structure"
                        cppCode={`static UGAiCompletionApiSession* CreateChatGenerationContext(
    UGAiEndpointConfig* InEndpointConfig,
    UObject* Outer = nullptr,
    FString SystemPrompt = TEXT(""),
    FString UserPrompt = TEXT("")
);`}

                    />

                    <h3>Parameters</h3>
                    <ul>
                        <li><strong>InEndpointConfig</strong> – API endpoint configuration (model, authentication, settings).</li>
                        <li><strong>Outer</strong> – UObject for lifetime management (defaults to <code>GetTransientPackage()</code>).</li>
                        <li><strong>SystemPrompt</strong> – Optional system role instruction defining behavior and constraints.</li>
                        <li><strong>UserPrompt</strong> – Initial user input to seed the conversation.</li>
                    </ul>

                    <Callout type="warning" title="Important">
                        <p>
                            If you don’t provide an <code>Outer</code>, the session may be garbage-collected unexpectedly. Always tie it to a valid UObject when running in a gameplay context.
                        </p>
                    </Callout>

                    <CodeExample
                        title="Chat Completion Example"
                        description="Example demonstrating system message setup and conversation context"
                        cppCode={`UGAiCompletionApiSession* UGAiCompletions_ChatExample::Run(UGAiEndpointConfig* EndpointConfig, UObject* WorldContextObject)
{
    if (!ensureMsgf(EndpointConfig != nullptr, TEXT("EndpointConfig is required")))
    {
        return nullptr;
    }

    UGAiCompletionApiSession* Session = UGAiCompletionApiSession::CreateChatGenerationContext(
        EndpointConfig,
        WorldContextObject ? WorldContextObject : GetTransientPackage(),
        TEXT("You are a game narrative assistant generating immersive, short in-world lines."),
        TEXT("As the village elder NPC, greet the player who just completed a side quest. Keep it to one sentence.")
    );

    Session->Generate(
        FOnGenerationComplete::CreateLambda([](const UGAiCompletionApiSession* Ctx)
        {
            UE_LOG(LogTemp, Log, TEXT("Completion ChatExample: %s"), *Ctx->GetText());
        }),
        FOnGenerationStreamChunk(), // optional: use if streaming tokens
        FOnGenerationError::CreateLambda([](const UGAiCompletionApiSession* Ctx)
        {
            UE_LOG(LogTemp, Error, TEXT("Completion ChatExample error: %s"), *Ctx->GetErrorMessage());
        })
    );

    return Session;
}`}

                    />

                    <h3>Example Output</h3>
                    <ConsoleOutput title="Chat Completion Response">
                        {`LogTemp: Completion ChatExample: Well done, young adventurer - your efforts to help the Miller's family have not gone unnoticed.`}
                    </ConsoleOutput>

                    <h2>Message Management</h2>

                    <p>
                        Chat sessions maintain conversation history through message accumulation. Messages can be added dynamically
                        to extend context across multiple turns:
                    </p>

                    <ul>
                        <li><code>SetMessages()</code> – Replaces the messages for the request with the provided messages.</li>
                        <li><code>ClearMessages()</code> – Clears the messages for the request.</li>
                        <li><code>SetSystemMessage()</code> – Replace or set the system message.</li>
                        <li><code>AddUserMessage()</code> – Add user input to the conversation.</li>
                        <li><code>AddAssistantMessage()</code> – Add AI responses back into history for continuity.</li>
                        <li><code>AddToolCallResultMessage()</code> – Add the result of a tool call to the conversation history.</li>
                    </ul>
                    <EnumReference enumName="EResponsesApiMessageRole" description="Chat completion organizes input into three distinct message types, each serving a specific purpose
                        in guiding AI behavior" values={[
                            {
                                name: "System",
                                description: "System messages are used to set the AI's role and behavior constraints.",
                            },
                            {
                                name: "User",
                                description: "User messages are used to represent human input, questions, or requests for the AI to respond to.",
                            },
                            {
                                name: "Assistant",
                                description: "Assistant messages are used to represent previous AI responses, used for conversation continuity and few-shot learning.",
                            },

                        ]} />

                    <Callout type="info" title="Why Roles Matter">
                        <p>
                            Unlike text completion where the model receives a single prompt string, chat completion explicitly
                            separates intent (<code>user</code>), guidance (<code>system</code>), and history (<code>assistant</code>).
                            This improves reliability, formatting consistency, and long-form context handling.
                        </p>
                    </Callout>

                    <h2>Response Handling</h2>

                    <p>
                        Responses are retrieved through <code>GetText()</code>, similar to <code>GetResponseText()</code> in text completion.
                        Error states are available via <code>HasError()</code> and <code>GetErrorMessage()</code>.
                        Streaming token-by-token output can be handled with <code>FOnGenerationStreamChunk</code>.
                    </p>
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}
