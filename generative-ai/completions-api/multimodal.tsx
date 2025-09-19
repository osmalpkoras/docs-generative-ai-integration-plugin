import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Multimodal Input',
    description: 'Text, image, file, and audio input support for AI models',
    order: 5,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, SiteConfig } from '@/components/layout';
import { Callout } from '@/components/doc-components';
import { Badge } from '@/components/ui/badge';


export default function MultimodalPage({ siteConfig }: { siteConfig: SiteConfig }) {

    return (
        <SiteDocumentation>
            <PageContainer>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="font-bold m-0!">Multimodal Input</h1>
                    <Badge variant="destructive">Documentation coming soon</Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                    Multimodal input allows combining <strong>text</strong>, <strong>images</strong>, <strong>files</strong>, and <strong>audio</strong>. This enables use cases like
                    visual question answering, scene description, and gameplay context analysis. Full documentation and
                    examples are in progress.
                </p>

                <Callout type="info" title="What to do in the meantime">
                    <p>
                        While we prepare full guides, you can explore the API directly in code. Good starting points are:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>The <code>UGAiCompletionApiSession</code> class</li>
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
