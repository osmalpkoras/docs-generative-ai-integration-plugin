import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Changelog',
    description: 'Release history and unreleased changes for the Generative AI Integration Plugin',
    order: 900,
    icon: 'History',
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import { Callout } from '@/components/doc-components';

export default function ChangelogPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <PageHeader />

                <p>
                    All notable changes to the Generative AI Integration Plugin are documented here.
                    The latest section <strong>WIP</strong> tracks unreleased changes on the development branch
                    and gets pinned to a version number on each release.
                </p>

                <Callout type="info" title="Versioning">
                    <p>
                        Until <strong>WIP</strong> is shipped, anything listed under it is subject to change.
                        Once a release is cut, the <strong>WIP</strong> heading is replaced with the new version
                        number and date, and a fresh <strong>WIP</strong> section is started for the next cycle.
                    </p>
                </Callout>

                <h2>WIP</h2>

                <h3>Multi-Modal Input &amp; Output</h3>
                <ul>
                    <li>
                        <strong>Unified content type system</strong>: new <code>FGAiContentPart</code> with
                        <code>FGAiImageContent</code>, <code>FGAiAudioContent</code>, and
                        <code>FGAiFileContent</code>. A single backend-agnostic representation for text, images,
                        audio, and files that works across both the Completions and Responses APIs.
                    </li>
                    <li>
                        <strong>Session multi-modal API</strong>: new methods on <code>UGAiSession</code> —
                        <code>AddMultiModalMessage</code>, <code>AddMessageWithImage</code>,
                        <code>AddMessageWithAudio</code>, <code>GetMessageContentParts</code>,
                        <code>GetLastAudioOutput</code>, <code>GetLastImageOutput</code>, and
                        <code>SetAudioOutputConfig</code>. Each returns <code>false</code> (or empty) and logs an
                        error rather than silently dropping content unsupported by the active backend.
                    </li>
                    <li>
                        <strong>Agent multi-modal prompts</strong>: new <code>Prompt</code> overload accepting
                        <code>TArray&lt;FGAiContentPart&gt; AdditionalContent</code>, plus a Blueprint
                        <code>Prompt_BP</code> equivalent.
                    </li>
                    <li>
                        <strong>Agent result content parts</strong>:
                        <code>FGAiAgentRunResult::ContentParts</code> now carries the full multi-modal output of
                        the last assistant message, with <code>GetAudioOutput()</code> and
                        <code>GetImageOutput()</code> convenience accessors. The existing <code>Result</code>
                        text field is preserved for backward compatibility.
                    </li>
                    <li>
                        <strong>Multi-modal delegation</strong>: new virtual
                        <code>UGAiAgent::ConstructAdditionalContent(Arguments)</code> lets sub-agents extract
                        images, audio, or files from delegation tool-call JSON.
                    </li>
                    <li>
                        <strong>UE asset conversion (runtime)</strong>: new helpers on
                        <code>UGAiFileHelpers</code> —
                        <code>CreateImageContentPart</code> from <code>UTexture2D</code>,
                        <code>UTextureRenderTarget2D</code>, URL, or file;
                        <code>CreateAudioContentPart</code> from <code>USoundWave</code> or file;
                        <code>CreateFileContentPart</code> from a path; reverse helpers
                        <code>ToTexture</code> and <code>ToSoundWave</code>; raw helpers
                        <code>SoundWaveToBase64</code> and <code>Base64ToSoundWave</code>.
                    </li>
                    <li>
                        <strong>Editor-only asset helpers</strong>: new
                        <code>UGAiEditorContentHelpers</code> Blueprint library with
                        <code>CaptureEditorViewport</code>,
                        <code>CreateImageContentPartFromThumbnail</code>,
                        <code>CreateImageContentPartFromMeshPreview</code>, and
                        <code>CreateImageContentPartFromMaterialPreview</code> — all under the
                        <code>GenerativeAI|Content|Editor</code> Blueprint category.
                    </li>
                    <li>
                        <strong>Blueprint helpers</strong> for the <code>TOptional</code> fields on
                        <code>FGAiContentPart</code> via <code>UGAiContentTypeHelpers</code>
                        (Get/Set/Has style accessors).
                    </li>
                </ul>

                <h3>MCP Server</h3>
                <ul>
                    <li>
                        <strong>Watchdog &amp; auto-restart</strong>: the Python MCP process is now monitored and
                        automatically restarted with exponential backoff if it crashes.
                    </li>
                    <li>
                        <strong>Graceful shutdown</strong>: the Python process now receives
                        <code>CTRL_BREAK</code>/<code>SIGTERM</code> first and is force-killed only as a fallback,
                        avoiding orphaned processes.
                    </li>
                    <li>
                        <strong>Tool execution timeout enforced</strong>: the
                        <code>Tool Execution Timeout Seconds</code> setting now actually aborts long-running tool
                        calls and returns a structured error result.
                    </li>
                    <li>
                        <strong>Stateless tool execution</strong>: each tool call uses a fresh tool instance
                        from a class registry. Tools must no longer rely on per-instance state surviving across
                        calls.
                    </li>
                    <li>
                        <strong>Deferred startup</strong>: the MCP server now waits for the schema cache to be
                        rebuilt before starting, so freshly compiled tools are always served correctly.
                    </li>
                    <li>
                        <strong>Generated config moved to <code>Saved/</code></strong>: tool definitions
                        are now generated on demand from the schema cache and written under your
                        project's <code>Saved/</code> directory.
                        <strong>Breaking</strong>: the tool config field <code>parameters</code> was
                        renamed to <code>scheme</code>. If you hand-edited the legacy
                        <code>Content/Python/tools_config.json</code>, rename the key during migration.
                    </li>
                    <li>
                        <strong>Blueprint override respected</strong>: Blueprint overrides of
                        <code>UGAiMCPServerDefinition::GetToolsToServe</code> are now picked up correctly.
                    </li>
                </ul>

                <h3>Bug Fixes</h3>
                <ul>
                    <li>
                        Fixed a crash when an agent's owner was garbage-collected during an async
                        <code>Prompt</code>.
                    </li>
                </ul>

                <h3>Testing</h3>
                <ul>
                    <li>
                        New <code>UGAiMockHttpService</code> lets you write deterministic, end-to-end
                        tests against the session pipeline without hitting a live API.
                    </li>
                </ul>

                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
