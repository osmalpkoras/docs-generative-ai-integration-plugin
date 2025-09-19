import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Generation',
    description: 'Conversational AI with structured roles using the Responses API',
    order: 2,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, SiteConfig } from '@/components/layout';
import { Callout } from '@/components/doc-components'
import { Badge } from '@/components/ui/badge';
import { LINK } from '@/lib/pages.generated';

export default function ResponsesChatCompletionPage({ siteConfig }: { siteConfig: SiteConfig }) {

    return (
        <SiteDocumentation>
            <PageContainer>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="font-bold m-0!">Chat Completion</h1>
                    <Badge variant="destructive">Documentation coming soon</Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                    Chat completion organizes input into <strong>system</strong>, <strong>user</strong>, and <strong>assistant</strong> roles to maintain
                    conversation state across turns. Use it when you need multi-step reasoning, memory of previous messages, or when tools and structured
                    outputs may be invoked mid-conversation. Sessions persist messages and parameters, so you can append turns and continue seamlessly.
                </p>

                <Callout type="info" title="What to do in the meantime">
                    <p>
                        Refer to the <a href={LINK.GENERATIVE_AI.COMPLETIONS_API.CHAT_COMPLETION}>Chat Completion documentation</a>, which works exactly the same, or explore the API directly in code. Good starting points are:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>The <code>UGAiResponsesApiSession</code> class</li>
                        <li><code>GAiResponsesApiSession.h</code> header file</li>
                        <li>Blueprint nodes exposed by the plugin</li>
                    </ul>
                    <p className="mt-3">
                        You can also join{' '}
                        <a href={siteConfig.headerLinks['discord'].href}>
                            the community on Discord
                        </a>{' '}
                        to share experiments and get help from other developers. Please note that community help is voluntary
                        and depends on time zones and availability.
                    </p>
                </Callout>
            </PageContainer>
        </SiteDocumentation>
    );
}


