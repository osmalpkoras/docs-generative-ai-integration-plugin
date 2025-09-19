'use client'

import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Tool Calling',
    description: 'Enable AI models to execute custom functions (Responses API)',
    order: 7,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer } from '@/components/layout';
import { Callout } from '@/components/doc-components';
import { useSite } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { LINK } from '@/lib/pages.generated';

export default function ResponsesToolCallingPage() {
    const { siteConfig } = useSite();

    return (
        <SiteDocumentation>
            <PageContainer>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="font-bold m-0!">Tool Calling</h1>
                    <Badge variant="destructive">Documentation coming soon</Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                    Tool calling lets models invoke your Unreal functions during a turn to fetch data or take actions.
                    Define tools with <code>UGAiTool</code>, register them on the session, and control selection via <strong>ToolChoice</strong>.
                    Tool results are appended to history and the model continues its response, enabling decision → action → explanation loops.
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
                        <a className="underline" href={siteConfig.headerLinks['discord'].href}>
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


