'use client'

import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Structured Output',
    description: 'JSON Schema-validated data object generation (Responses API)',
    order: 6,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer } from '@/components/layout';
import { Callout } from '@/components/doc-components';
import { useSite } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { LINK } from '@/lib/pages.generated';

export default function ResponsesStructuredOutputPage() {
    const { siteConfig } = useSite();

    return (
        <SiteDocumentation>
            <PageContainer>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="font-bold m-0!">Structured Output</h1>
                    <Badge variant="destructive">Documentation coming soon</Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                    Structured output enforces a <strong>JSON Schema</strong> contract during generation and parses the result into a typed
                    <code>UObject</code>. Define schemas with <code>UJsonSchemaConvertableObject</code>, set the response format on the session, and
                    receive validated data ready for direct use in gameplay systems, tools, or save data. Recursive types are not yet supported.
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


