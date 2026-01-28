import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Endpoint Configuration',
    description: `Endpoint configurations store connection details for AI providers. Create them as data assets and reuse
                  them across your project.`,
    order: 12
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
import { LINK } from '@/lib/pages.generated';

export default function EndpointConfigurationPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <h2>Creating an Endpoint Config</h2>

                    <h3>In Unreal Editor</h3>

                    <ol>
                        <li>Right-click in Content Browser → <strong>Miscellaneous → Data Asset</strong></li>
                        <li>Choose <code>GAi Endpoint Config</code></li>
                        <li>Name it (e.g., "OpenAI_GPT4", "Claude_Sonnet")</li>
                        <li>Configure properties:
                            <ul>
                                <li><strong>Display Name</strong>: Friendly name</li>
                                <li><strong>Model</strong>: Model identifier (e.g., "gpt-4o")</li>
                                <li><strong>Base URL</strong>: API endpoint</li>
                                <li><strong>API Key</strong>: Your provider key</li>
                                <li><strong>Timeout Seconds</strong>: Request timeout</li>
                            </ul>
                        </li>
                    </ol>

                    <Callout type="warning" title="API Key Security">
                        <p>
                            Never commit API keys to version control. Use environment variables or secure storage.
                            The plugin provides a field for keys, but securing them is your responsibility.
                        </p>
                    </Callout>

                    <h3>Pre-Configured Assets</h3>

                    <p>The plugin includes example configs in <code>Content/</code>:</p>

                    <ul>
                        <li><code>OpenAI.uasset</code></li>
                        <li><code>Claude.uasset</code></li>
                        <li><code>Gemini.uasset</code></li>
                        <li><code>Ollama.uasset</code></li>
                    </ul>

                    <p>Duplicate and fill in your API keys.</p>

                    <h2>Provider Setup</h2>

                    <Example>
                        <ExampleTitle>OpenAI Configuration</ExampleTitle>
                        <ExampleContent>
                            Configure OpenAI's GPT models. Get your API key from{' '}
                            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                                platform.openai.com/api-keys
                            </a>
                            . Available models: <code>gpt-4o</code>, <code>gpt-4o-mini</code>, <code>o1-preview</code>
                        </ExampleContent>
                        <ExampleCpp>
                            {`Config->DisplayName = TEXT(\"OpenAI GPT-4o\");\nConfig->BaseUrl = TEXT(\"https://api.openai.com/v1\");\nConfig->ApiKey = TEXT(\"sk-...\"); // Get from platform.openai.com\nConfig->Model = TEXT(\"gpt-4o\");\nConfig->TimeoutSeconds = 60.0f;`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Anthropic Configuration</ExampleTitle>
                        <ExampleContent>
                            Configure Anthropic's Claude models. Get your API key from{' '}
                            <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">
                                console.anthropic.com/settings/keys
                            </a>
                            . Available models: <code>claude-3-5-sonnet-20241022</code>, <code>claude-3-opus-20240229</code>
                        </ExampleContent>
                        <ExampleCpp>
                            {`Config->DisplayName = TEXT(\"Claude Sonnet\");\nConfig->BaseUrl = TEXT(\"https://api.anthropic.com/v1/messages\");\nConfig->ApiKey = TEXT(\"sk-ant-...\"); // Get from console.anthropic.com\nConfig->Model = TEXT(\"claude-3-5-sonnet-20241022\");\nConfig->TimeoutSeconds = 90.0f;\n\n// Required header for Claude\nConfig->AdditionalHeaders.Add(TEXT(\"anthropic-version\"), TEXT(\"2023-06-01\"));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Google Gemini Configuration</ExampleTitle>
                        <ExampleContent>
                            Configure Google's Gemini models. Get your API key from{' '}
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                                aistudio.google.com/app/apikey
                            </a>
                        </ExampleContent>
                        <ExampleCpp>
                            {`Config->DisplayName = TEXT(\"Gemini Flash\");\nConfig->BaseUrl = TEXT(\"https://generativelanguage.googleapis.com/v1beta\");\nConfig->ApiKey = TEXT(\"...\"); // Get from aistudio.google.com\nConfig->Model = TEXT(\"gemini-2.0-flash-exp\");\nConfig->TimeoutSeconds = 60.0f;`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Ollama Local Configuration</ExampleTitle>
                        <ExampleContent>
                            Run Ollama locally for development. Start the server with <code>ollama serve</code> and pull models with <code>ollama pull llama2</code>.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Config->DisplayName = TEXT(\"Ollama Llama\");\nConfig->BaseUrl = TEXT(\"http://localhost:11434/v1/chat/completions\");\nConfig->ApiKey = TEXT(\"\"); // Not needed for local\nConfig->Model = TEXT(\"llama2\");\nConfig->TimeoutSeconds = 180.0f; // Local can be slower`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Ollama Setup">
                        <p>
                            Run <code>ollama serve</code> before using. Pull models with <code>ollama pull llama2</code>.
                        </p>
                    </Callout>

                    <h2>Using Configs in Sessions</h2>

                    <Example>
                        <ExampleTitle>Loading and Using Configs</ExampleTitle>
                        <ExampleContent>
                            Load endpoint configs from your Content folder and pass them to session creation methods.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Load config from Content folder\nUGAiEndpointConfig* Config = LoadObject<UGAiEndpointConfig>(\n    nullptr,\n    TEXT(\"/Game/AI/OpenAI_GPT4.OpenAI_GPT4\")\n);\n\n// Use in session\nauto* Session = UGAiResponsesApiSession::CreateChatSession(\n    Config, this,\n    TEXT(\"You are helpful.\"),\n    TEXT(\"Hello!\")\n);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Changing Providers Mid-Conversation</ExampleTitle>
                        <ExampleContent>
                            You can change the endpoint config on an existing session. The next <code>Generate()</code> call will use the new provider. Be aware that different providers may have different message formats and capabilities.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Change endpoint mid-conversation\nUGAiEndpointConfig* ClaudeConfig = LoadObject<UGAiEndpointConfig>(/*....*/);\nSession->SetEndpointConfig(ClaudeConfig);\n\n// Next Generate() uses new provider\nSession->AddUserMessage(TEXT(\"Continue...\"));\nSession->Generate(/* ... */);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Setting Request Timeouts</ExampleTitle>
                        <ExampleContent>
                            Adjust timeout values based on your use case. Quick tasks need less time, while complex reasoning models may need longer.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Short timeout for quick tasks\nConfig->TimeoutSeconds = 30.0f;\n\n// Long timeout for complex reasoning\nConfig->TimeoutSeconds = 180.0f;\n\n// Very long for o1-preview reasoning models\nConfig->TimeoutSeconds = 300.0f;`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Loading Keys from Environment Variables</ExampleTitle>
                        <ExampleContent>
                            Never hardcode API keys in your source code. Instead, load them from environment variables at runtime to keep credentials secure.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FString LoadApiKey(const FString& EnvVarName)\n{\n    FString Key = FPlatformMisc::GetEnvironmentVariable(*EnvVarName);\n\n    if (Key.IsEmpty())\n    {\n        UE_LOG(LogTemp, Error, TEXT(\"API key not found: %s\"), *EnvVarName);\n    }\n\n    return Key;\n}\n\n// Usage\nConfig->ApiKey = LoadApiKey(TEXT(\"OPENAI_API_KEY\"));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Managing Multiple Configs</ExampleTitle>
                        <ExampleContent>
                            Use a manager class to organize and switch between different endpoint configurations. This lets you maintain fast models for simple tasks and powerful models for complex ones.
                        </ExampleContent>
                        <ExampleCpp>
                            {`class UAIManager : public UObject\n{\n    UPROPERTY()\n    TMap<FName, UGAiEndpointConfig*> Configs;\n\n    void LoadConfigs()\n    {\n        // Fast model for simple tasks\n        Configs.Add(TEXT(\"Fast\"),\n            LoadObject<UGAiEndpointConfig>(nullptr, TEXT(\"/Game/AI/GPT4o_Mini\"))\n        );\n\n        // Smart model for complex tasks\n        Configs.Add(TEXT(\"Smart\"),\n            LoadObject<UGAiEndpointConfig>(nullptr, TEXT(\"/Game/AI/Claude_Opus\"))\n        );\n\n        // Local for offline dev\n        Configs.Add(TEXT(\"Local\"),\n            LoadObject<UGAiEndpointConfig>(nullptr, TEXT(\"/Game/AI/Ollama\"))\n        );\n    }\n\n    UGAiEndpointConfig* GetConfig(FName Name)\n    {\n        return Configs.FindRef(Name);\n    }\n};`}
                        </ExampleCpp>
                    </Example>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><a href={LINK.GENERATIVE_AI.CORE.USING_SESSIONS}>Using Sessions</a> - Create and manage sessions with endpoints</li>
                        <li><a href={LINK.GENERATIVE_AI.CORE.SESSIONS_API_REFERENCE}>Sessions API Reference</a> - Complete API documentation</li>
                    </ul>

                </LanguageToggleProvider>


                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
