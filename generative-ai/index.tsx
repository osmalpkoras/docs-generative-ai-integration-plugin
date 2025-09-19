'use client'

import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Generative AI Integration Plugin',
    description: 'Generative AI, native to Unreal Engine',
    order: 1,
} satisfies ContentPage;

import Image from 'next/image';
import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import { Step, StepList, Callout, ImageWithCaption } from '@/components/doc-components';
import { Button } from '@/components/ui/button';
import createEndpointConfig from '@/assets/setup/create-endpoint-config.png';
import openaiEndpointConfig from '@/assets/setup/openai-endpoint-config.png';
import configurePluginSettings from '@/assets/setup/configure-plugin-settings.png';
import gaiLogo from '@/assets/GAI Logo.jpg';
import { LINK } from '@/lib/pages.generated';
import { useSite } from '@/components/layout';

export default function HomePage() {
    const { siteConfig } = useSite();

    return (
        <SiteDocumentation>
            <PageContainer>
                {/* Header Section */}
                <h1>Generative AI Integration Plugin</h1>
                <div className="flex flex-col lg:flex-row gap-4 items-start mb-4">
                    <Image
                        src={gaiLogo}
                        alt="Generative AI Plugin Logo"
                        width={160}
                        height={160}
                        className="rounded-lg border shadow-sm m-0!"
                    />
                    <p className="flex-1 text-sm text-muted-foreground leading-relaxed m-0!">
                        The Generative AI Integration Plugin brings state-of-the-art AI models directly into Unreal Engine, enabling rapid prototyping and production-ready development within the Unreal Engine editor. It fully supports OpenAI’s Responses API, as well as the legacy Completions and Chat Completions APIs. Since the Chat Completions API is widely adopted, the plugin also works seamlessly with providers like Claude, Gemini, Ollama, and vLLM.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center justify-center">
                    <Button asChild className="bg-amber-300 hover:bg-amber-300/80">
                        <a href={siteConfig.headerLinks["fab"].href} target="_blank" rel="noopener noreferrer">
                            Buy on FAB
                        </a>
                    </Button>
                    <Button variant="outline" asChild>
                        <a href={siteConfig.headerLinks["github"].href} target="_blank" rel="noopener noreferrer">
                            View on GitHub
                        </a>
                    </Button>
                    <Button variant="outline" asChild>
                        <a href={siteConfig.headerLinks["discord"].href} target="_blank" rel="noopener noreferrer">
                            Join Discord
                        </a>
                    </Button>
                </div>

                <p>
                    The plugin is designed to make it easy to work with and integrate Generative AI into your projects: stream responses as they’re generated, produce structured outputs with strongly-typed schemas, call custom tools defined in your own code, and work across text, images, and audio. Whether for in-editor automation or runtime gameplay, the plugin provides a solid foundation for building advanced frameworks, especially agentic systems, while striving to remain accessible for anyone and adaptable to many kinds of tasks.</p>
                <div className=" border-l-2 border-amber-500 pl-4 bg-amber-50 dark:bg-amber-950/20 rounded-r">
                    <p>
                        <strong>Beta Release:</strong> This plugin is currently in beta. We encourage you to report any issues, request features, or provide feedback to help us improve the plugin before its stable release.
                    </p>
                    <p>
                        The plugin fully implements all low-level features and some convience methods. More convience methods will be added in the future.
                    </p>
                </div>

                {/* API Compatibility Section */}
                <h2>API Compatibility</h2>
                <p>
                    The plugin is built to fully follow the OpenAI Responses API* and Completion/Chat Completion APIs. If you have prior experience with OpenAI’s APIs, you should be able to start using the plugin right away with your existing knowledge. Request structures, response formats, and parameter options are designed to mirror the official OpenAI specification, making the transition straightforward and familiar.
                </p>
                <p>*The Computer Use tool hosted by OpenAI is not supported in this plugin.</p>

                {/* Getting Started Guide */}
                <h2>Getting Started</h2>
                <p>
                    After completing the initial setup, continue with either the <a href={LINK.GENERATIVE_AI.RESPONSES_API.INDEX} className="text-primary hover:underline font-medium">Responses API</a> or the <a href={LINK.GENERATIVE_AI.COMPLETIONS_API.INDEX} className="text-primary hover:underline font-medium">Completions API</a> to learn how to start generation sessions, configure requests, work with responses, and explore advanced features such as tool calling, structured output, and streaming.
                </p>

                <h2>Plugin Setup</h2>
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
                            <li><strong>Local Deployments</strong>: Use Ollama or vLLM for local models and use your API key if required</li>
                        </ul>

                        <Callout type="warning" title="Keep Your API Key Safe">
                            <p>Store your API key securely and never commit it to version control.</p>
                        </Callout>
                    </Step>

                    <Step title="Create an Endpoint Configuration Data Asset">
                        <p>
                            Create a new Data Asset that derives from <code>UGAiEndpointConfig</code> to store your API configuration.
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
                            <li>Name it appropriately (e.g., "OpenAI_GPT4_Config")</li>
                            <li>Double-click to open and configure the following properties:
                                <ul>
                                    <li><strong>Display Name</strong> - A friendly name for this configuration</li>
                                    <li><strong>Model</strong> - The model identifier (e.g., "gpt-4", "claude-3-sonnet-20240229")</li>
                                    <li><strong>Base URL</strong> - The API endpoint URL</li>
                                    <li><strong>API Key</strong> - Your API key from step 1</li>
                                    <li><strong>Timeout Seconds</strong> - Request timeout (default: 30 seconds)</li>
                                </ul>
                            </li>
                        </ol>

                        <ImageWithCaption
                            src={openaiEndpointConfig}
                            alt="Creating a UGAiEndpointConfig Data Asset in Unreal Engine"
                            caption="Creating a new Endpoint Configuration Data Asset"
                            size="large"
                        />
                    </Step>

                    <Step title="Configure Plugin Settings">
                        <p>
                            Finally, configure the plugin in your project settings to use the JSON Schema Cache that comes with the plugin. This is just a default cache that will be populated with schemas for your custom tools when the plugin analyzes your project's classes.
                        </p>

                        <ol>
                            <li>Go to <strong>Edit → Project Settings</strong></li>
                            <li>Navigate to <strong>Plugins → Generative AI</strong></li>
                            <li>Pick a <strong>Json Schema Cache</strong> from the dropdown</li>
                            <li>Configure any additional settings as needed</li>
                        </ol>

                        <ImageWithCaption
                            src={configurePluginSettings}
                            alt="Generative AI plugin settings in Unreal Engine Project Settings"
                            caption="Configuring the Generative AI plugin in Project Settings"
                            size="large"
                        />

                        <h4>Additional Settings:</h4>
                        <p>You'll also find more configuration options in the <strong>Generative AI (Editor)</strong> subsection, which you can adjust according to your project's needs.</p>

                    </Step>
                </StepList>
            </PageContainer>
        </SiteDocumentation>
    );
}
