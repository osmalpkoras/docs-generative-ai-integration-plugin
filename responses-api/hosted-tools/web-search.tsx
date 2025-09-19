'use client'

import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Web Search',
    description: 'Enable live web search during a generation turn',
    order: 9,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, SiteConfig } from '@/components/layout';
import { Callout } from '@/components/doc-components';
import { useSite } from '@/components/layout';
import { Badge } from '@/components/ui/badge';

export default function ResponsesHostedWebSearchPage({ siteConfig }: { siteConfig: SiteConfig }) {
    return (
        <SiteDocumentation>
            <PageContainer>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="font-bold m-0!">Web Search</h1>
                    <Badge variant="secondary">Provider-integrated</Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                    Web Search lets the model fetch up-to-date information from the internet mid-turn, cite sources, and combine
                    retrieved facts with its reasoning. Use this for patch notes, changelogs, marketplace content, or news that the
                    base model may not know.
                </p>



                <Callout type="info" title="What to do in the meantime">
                    <p>
                        Explore the API directly in code. Good starting points are:
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


