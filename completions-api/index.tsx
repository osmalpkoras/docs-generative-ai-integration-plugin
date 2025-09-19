import { NavigationGroup } from '@/types/pages';

export const metadata = {
    kind: 'group',
    title: 'Completions API',
    description: 'Technical documentation for the GenerativeAi plugin\'s Completion API functionality',
    order: 200,
} satisfies NavigationGroup;

import { SiteDocumentation, PageContainer } from '@/components/layout';
import { Callout } from '@/components/doc-components';

export default function CompletionsApiIndexPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <h1 className="font-bold">Completions API</h1>

                <p className="text-muted-foreground leading-relaxed">
                    The Completions API provides comprehensive text generation capabilities for Unreal Engine 5 projects,
                    supporting both simple text completion and advanced conversational AI with structured outputs,
                    multimodal inputs, and tool calling functionality.
                </p>

                <h2>API Architecture</h2>

                <p>
                    The Completions API is built around the <code>UGAiCompletionApiSession</code> class, which manages
                    AI generation requests, conversation state, and response processing. Sessions are created through
                    factory methods optimized for specific use cases.
                </p>

                <Callout type="info" title="OpenAI API Compatibility">
                    <p>
                        The plugin implements the OpenAI Chat Completions API specification, ensuring compatibility
                        with OpenAI models and OpenAI-compatible endpoints from other providers.
                    </p>
                </Callout>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h2 className="font-semibold">Core Functionality</h2>

                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-2">
                                <a href="/generative-ai/completions-api/text-completion" className="text-primary hover:underline">
                                    Text Completion
                                </a>
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Single-prompt text generation for content creation and simple AI tasks.
                            </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-2">
                                <a href="/generative-ai/completions-api/chat-completion" className="text-primary hover:underline">
                                    Chat Completion
                                </a>
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Conversational AI with structured message roles and conversation context management.
                            </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-2">
                                <a href="/generative-ai/completions-api/streaming" className="text-primary hover:underline">
                                    Streaming Responses
                                </a>
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Real-time text generation with incremental content delivery for responsive interfaces.
                            </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-2">
                                <a href="/generative-ai/completions-api/request-config" className="text-primary hover:underline">
                                    Request Configuration
                                </a>
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Parameter control for fine-tuning AI behavior, creativity, and output characteristics.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-semibold">Advanced Features</h2>

                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-2">
                                <a href="/generative-ai/completions-api/multimodal" className="text-primary hover:underline">
                                    Multimodal Input
                                </a>
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Vision-enabled AI analysis combining text and image inputs for comprehensive understanding.
                            </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-2">
                                <a href="/generative-ai/completions-api/structured-output" className="text-primary hover:underline">
                                    Structured Output
                                </a>
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                JSON Schema-validated data generation with automatic UObject instantiation.
                            </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-2">
                                <a href="/generative-ai/completions-api/tool-calling" className="text-primary hover:underline">
                                    Tool Calling
                                </a>
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Enable AI models to execute custom functions and interact with game systems directly.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-muted rounded-lg">
                    <h2 className="font-semibold mb-3">Technical Requirements</h2>
                    <div className="space-y-2 text-sm">
                        <div><strong>Prerequisites:</strong> GenerativeAi plugin installation and endpoint configuration</div>
                        <div><strong>Supported APIs:</strong> OpenAI, Claude, Gemini, and OpenAI-compatible endpoints</div>
                        <div><strong>Engine Support:</strong> Unreal Engine 5.0+ with C++ and Blueprint integration</div>
                        <div><strong>Dependencies:</strong> HTTP networking, JSON serialization, UE reflection system</div>
                    </div>
                </div>

                <h2>Session Management</h2>

                <p>
                    Completion sessions are UObject instances managed by Unreal Engine's garbage collection system.
                    Sessions maintain conversation state, handle asynchronous generation, and provide access to
                    generated content through delegate callbacks.
                </p>

                <h3>Factory Methods</h3>

                <ul>
                    <li><strong>CreateTextGenerationContext:</strong> Optimized for single-prompt text generation</li>
                    <li><strong>CreateChatGenerationContext:</strong> Configured for conversational AI with message roles</li>
                </ul>

                <h3>Callback Architecture</h3>

                <ul>
                    <li><strong>FOnGenerationComplete:</strong> Called when generation finishes successfully</li>
                    <li><strong>FOnGenerationStreamChunk:</strong> Handles real-time streaming content</li>
                    <li><strong>FOnGenerationError:</strong> Processes error conditions and failures</li>
                </ul>

            </PageContainer>
        </SiteDocumentation>
    );
}