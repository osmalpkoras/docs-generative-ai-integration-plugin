'use client'

import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'File Search',
    description: 'Let the model search your indexed files during a turn',
    order: 8,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, SiteConfig } from '@/components/layout';
import { Callout } from '@/components/doc-components';
import { useSite } from '@/components/layout';
import { Badge } from '@/components/ui/badge';

export default function ResponsesHostedFileSearchPage({ siteConfig }: { siteConfig: SiteConfig }) {
    return (
        <SiteDocumentation>
            <PageContainer>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="font-bold m-0!">File Search</h1>
                    <Badge variant="secondary">Provider-integrated</Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                    File Search allows the model to query provider-hosted indexes of your documents during a generation turn. Use it to
                    ground answers in design docs, FAQs, wikis, or logs without embedding your own retrieval stack. The model chooses when
                    to search and which results to cite, returning responses enriched by retrieved context.
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


