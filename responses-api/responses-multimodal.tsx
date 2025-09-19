'use client'

import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Multimodal Input',
    description: 'Text, image, file, and audio input support for Responses API',
    order: 5,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer } from '@/components/layout';
import { Callout } from '@/components/doc-components';
import { useSite } from '@/components/layout';
import { Badge } from '@/components/ui/badge';

export default function ResponsesMultimodalPage() {
    const { siteConfig } = useSite();

    return (
        <SiteDocumentation>
            <PageContainer>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="font-bold m-0!">Multimodal Input</h1>
                    <Badge variant="destructive">Documentation coming soon</Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                    Multimodal input lets you combine <strong>text</strong> with <strong>images</strong>, <strong>audio</strong>, or <strong>files</strong>                     to unlock vision and context-aware use cases: describe scenes, analyze screenshots, or ground responses in attachments.                    Requests support mixing modalities within a single turn where supported by the selected provider and model.
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


