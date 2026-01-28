import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Getting Started',
    description: 'Set up the Generative AI Integration Plugin in your Unreal Engine project',
    order: 2,
} satisfies ContentPage;

import Image from 'next/image';
import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import { Step, StepList, Callout, ImageWithCaption } from '@/components/doc-components';
import createEndpointConfig from '@/assets/setup/create-endpoint-config.png';
import openaiEndpointConfig from '@/assets/setup/openai-endpoint-config.png';
import configurePluginSettings from '@/assets/setup/configure-plugin-settings.png';
import { LINK } from '@/lib/pages.generated';

export default function GettingStartedPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <PageHeader />

                <h2>Plugin Setup</h2>

                <p>
                    This guide walks you through the initial setup of the Generative AI Integration Plugin. After completing these steps, you'll be ready to create your first AI session and start generating content.
                </p>

                <StepList>
                    <Step title="Acquire an API Key">
                        <p>
                            First, you'll need to get an API key from your preferred AI model provider.
                            The plugin supports multiple providers, so choose the one that best fits your needs.
                        </p>

                        <h4>Supported Providers:</h4>
                        <ul>
                            <li><strong>OpenAI</strong>: Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Platform</a></li>
                            <li><strong>Anthropic (Claude)</strong>: Get your API key from <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">Anthropic Console</a></li>
                            <li><strong>Google (Gemini)</strong>: Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                            <li><strong>Local Deployments</strong>: Use Ollama or vLLM for local models (API key may not be required)</li>
                        </ul>

                        <Callout type="warning" title="Keep Your API Key Safe">
                            <p>Store your API key securely and never commit it to version control. Consider using environment variables or secure configuration management for production deployments.</p>
                        </Callout>
                    </Step>

                    <Step title="Create an Endpoint Configuration Data Asset">
                        <p>
                            Create a new Data Asset that derives from <code>UGAiEndpointConfig</code> to store your API configuration.
                            This asset can be reused across your project for consistent API access.
                        </p>

                        <ImageWithCaption
                            src={createEndpointConfig}
                            alt="Creating a UGAiEndpointConfig Data Asset in Unreal Engine"
                            caption="Creating a new Endpoint Configuration Data Asset"
                            size="large"
                        />

                        <ol>
                            <li>In the Content Browser, right-click and select <strong>Miscellaneous → Data Asset</strong></li>
                            <li>Choose <code>GAi Endpoint Config</code> as the Data Asset Class</li>
                            <li>Name it appropriately (e.g., "OpenAI_GPT4_Config", "Claude_Sonnet_Config")</li>
                            <li>Double-click to open and configure the following properties:
                                <ul>
                                    <li><strong>Display Name</strong> - A friendly name for this configuration</li>
                                    <li><strong>Model</strong> - The model identifier (e.g., "gpt-4o", "claude-3-5-sonnet-20241022")</li>
                                    <li><strong>Base URL</strong> - The API endpoint URL</li>
                                    <li><strong>API Key</strong> - Your API key from step 1</li>
                                    <li><strong>Timeout Seconds</strong> - Request timeout (default: 30 seconds, increase for slower models)</li>
                                </ul>
                            </li>
                        </ol>

                        <ImageWithCaption
                            src={openaiEndpointConfig}
                            alt="Configuring an OpenAI Endpoint Configuration Data Asset"
                            caption="Example OpenAI endpoint configuration"
                            size="large"
                        />

                        <Callout type="info" title="Pre-Configured Templates">
                            <p>
                                The plugin includes example endpoint configurations in the <code>Content/</code> folder for OpenAI, Claude, Gemini, and Ollama.
                                Duplicate these and add your API keys to get started quickly.
                            </p>
                        </Callout>
                    </Step>

                    <Step title="Configure Plugin Settings">
                        <p>
                            Configure the plugin in your project settings to use the JSON Schema Cache. This cache is automatically populated
                            with schemas for your custom tools when the plugin analyzes your project's classes.
                        </p>

                        <ol>
                            <li>Go to <strong>Edit → Project Settings</strong></li>
                            <li>Navigate to <strong>Plugins → Generative AI</strong></li>
                            <li>Select a <strong>Json Schema Cache</strong> from the dropdown (the plugin provides a default cache)</li>
                            <li>Configure any additional settings as needed</li>
                        </ol>

                        <ImageWithCaption
                            src={configurePluginSettings}
                            alt="Generative AI plugin settings in Unreal Engine Project Settings"
                            caption="Configuring the Generative AI plugin in Project Settings"
                            size="large"
                        />

                        <h4>Additional Settings:</h4>
                        <p>
                            You'll also find more configuration options in the <strong>Generative AI (Editor)</strong> subsection,
                            which you can adjust according to your project's needs.
                        </p>
                    </Step>
                </StepList>

                <h2>Next Steps</h2>

                <p>
                    After completing the setup, continue with the core concepts to understand how sessions work:
                </p>

                <ul>
                    <li><a href={LINK.GENERATIVE_AI.CORE.USING_SESSIONS}>Using Sessions</a> - Learn how to create and manage AI sessions</li>
                    <li><a href={LINK.GENERATIVE_AI.CORE.ENDPOINT_CONFIGURATION}>Endpoint Configuration</a> - Detailed guide on configuring different providers</li>
                </ul>

                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
