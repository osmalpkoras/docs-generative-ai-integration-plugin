import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Multi-Modal',
    description: 'Send and receive text, images, audio, and files through the unified content type system',
    order: 205
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import {
    Callout,
    LanguageToggleProvider,
    Example,
    ExampleTitle,
    ExampleContent,
    ExampleCpp,
} from '@/components/doc-components';

export default function MultimodalPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <p>
                        Multi-modal models can process and produce text, images, audio, and files in addition
                        to plain text. The plugin exposes this through a single backend-agnostic content type
                        — <code>FGAiContentPart</code> — that works across both the Completions and Responses
                        APIs. You build content parts once and the active session validates them against the
                        backend's capabilities, returning a clear error rather than silently dropping
                        unsupported modalities.
                    </p>

                    <h2>The Unified Content Type System</h2>

                    <p>
                        All multi-modal content flows through four Blueprint-friendly structs:
                    </p>

                    <ul>
                        <li><code>FGAiContentPart</code> — discriminated union of all content kinds via <code>EGAiContentType</code> (<code>Text</code>, <code>Image</code>, <code>Audio</code>, <code>File</code>).</li>
                        <li><code>FGAiImageContent</code> — base64 <code>Data</code>, remote <code>Url</code>, or hosted <code>FileId</code>; optional <code>MimeType</code> and <code>Detail</code>.</li>
                        <li><code>FGAiAudioContent</code> — base64 <code>Data</code> + <code>EResponsesApiAudioFormat</code>.</li>
                        <li><code>FGAiFileContent</code> — base64 <code>Data</code>, <code>FileId</code>, or <code>FileUrl</code>; <code>Filename</code> and <code>MimeType</code> hints.</li>
                    </ul>

                    <Example>
                        <ExampleTitle>Building Content Parts</ExampleTitle>
                        <ExampleContent>
                            Use the static factory methods on <code>FGAiContentPart</code> to build parts
                            from any of the typed payloads. All factory methods are
                            <code>BlueprintCallable</code>.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Text
FGAiContentPart Text = FGAiContentPart::CreateText(TEXT("What's in this image?"));

// Image from URL
FGAiImageContent Img;
Img.Url = TEXT("https://example.com/screenshot.jpg");
Img.Detail = EResponsesApiImageDetail::High;
FGAiContentPart ImagePart = FGAiContentPart::CreateImage(Img);

// Audio from base64 WAV
FGAiAudioContent Audio;
Audio.Data = Base64Wav;
Audio.Format = EResponsesApiAudioFormat::WAV;
FGAiContentPart AudioPart = FGAiContentPart::CreateAudio(Audio);

// File from base64
FGAiFileContent File;
File.Data = Base64Pdf;
File.Filename = TEXT("design.pdf");
File.MimeType = TEXT("application/pdf");
FGAiContentPart FilePart = FGAiContentPart::CreateFile(File);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Blueprint helpers for TOptional fields">
                        <p>
                            <code>FGAiContentPart</code> uses <code>TOptional</code> for its payload slots so
                            the discriminated-union shape is preserved. The
                            <code>UGAiContentTypeHelpers</code> Blueprint library provides matching
                            Get/Set/Has functions so you don't have to interact with <code>TOptional</code>
                            directly from Blueprints.
                        </p>
                    </Callout>

                    <h2>Sending Multi-Modal Messages</h2>

                    <p>
                        Sessions accept content parts through three methods on the unified
                        <code>UGAiSession</code> base class. Each one is implemented by both
                        <code>UGAiCompletionsApiSession</code> and <code>UGAiResponsesApiSession</code>.
                    </p>

                    <Example>
                        <ExampleTitle>AddMultiModalMessage — Full Control</ExampleTitle>
                        <ExampleContent>
                            Pass an array of content parts and a role. Returns <code>false</code> and logs an
                            error if any part uses a modality the active backend doesn't support — the
                            message is not added in that case.
                        </ExampleContent>
                        <ExampleCpp>
                            {`TArray<FGAiContentPart> Parts;
Parts.Add(FGAiContentPart::CreateText(TEXT("What's wrong with this screenshot?")));
Parts.Add(FGAiContentPart::CreateImage(Img));

const bool bAdded = Session->AddMultiModalMessage(
    EResponsesApiMessageRole::User, Parts);

if (!bAdded)
{
    // Backend rejected one of the parts — see Output Log for details.
}

Session->Generate(/* callbacks */);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>AddMessageWithImage / AddMessageWithAudio — Convenience</ExampleTitle>
                        <ExampleContent>
                            For the common "text plus one media item" cases, skip building the array
                            yourself. These helpers internally construct a two-part array and call
                            <code>AddMultiModalMessage</code>.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Text + image
Session->AddMessageWithImage(
    EResponsesApiMessageRole::User,
    TEXT("Describe this scene."),
    Img);

// Text + audio (Completions only — see compatibility matrix)
Session->AddMessageWithAudio(
    EResponsesApiMessageRole::User,
    TEXT("Transcribe this clip."),
    Audio);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Reading Multi-Modal Output</h2>

                    <p>
                        Output accessors live on the same base class. They normalize the two backends'
                        different output shapes into <code>FGAiContentPart</code> values, and return empty
                        rather than erroring when the active backend doesn't produce that modality.
                    </p>

                    <Example>
                        <ExampleTitle>Reading Content Parts</ExampleTitle>
                        <ExampleCpp>
                            {`// All parts of a specific message (default: last assistant message)
TArray<FGAiContentPart> Parts = Session->GetMessageContentParts();

// Backend-aware accessors for the most common non-text modalities
TOptional<FGAiAudioContent> Audio = Session->GetLastAudioOutput();
TOptional<FGAiImageContent> Image = Session->GetLastImageOutput();

if (Audio.IsSet())
{
    USoundWave* Wave = UGAiFileHelpers::ToSoundWave(Audio.GetValue(), this);
    // Play, save, route to a SoundCue, ...
}`}
                        </ExampleCpp>
                    </Example>

                    <h2>Audio Output Configuration</h2>

                    <p>
                        Audio output is an opt-in modality on the Completions API. Use
                        <code>SetAudioOutputConfig</code> to declare the desired voice and audio format —
                        the session adds <code>Audio</code> to its <code>Modalities</code> and configures
                        the <code>Audio</code> request field for you.
                    </p>

                    <Example>
                        <ExampleTitle>Requesting Audio Responses (Completions API)</ExampleTitle>
                        <ExampleCpp>
                            {`const bool bConfigured = Session->SetAudioOutputConfig(
    EResponsesApiVoice::Alloy,
    EResponsesApiAudioFormat::WAV);

if (!bConfigured)
{
    // Returned false → Responses API session, audio output not supported.
}

Session->AddMessage(EResponsesApiMessageRole::User, TEXT("Read this aloud."));
Session->Generate(/* ... */);

// After completion:
if (auto Audio = Session->GetLastAudioOutput(); Audio.IsSet())
{
    /* ... */
}`}
                        </ExampleCpp>
                    </Example>

                    <h2>Backend Compatibility</h2>

                    <p>
                        The two API backends do not support the same set of modalities. The unified layer
                        never silently drops unsupported content — it logs and returns
                        <code>false</code>/empty.
                    </p>

                    <h3>Inputs</h3>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">Content</th>
                                <th className="text-left p-2">Completions</th>
                                <th className="text-left p-2">Responses</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr><td className="p-2">Text</td><td className="p-2">Yes</td><td className="p-2">Yes</td></tr>
                            <tr><td className="p-2">Image (URL or base64)</td><td className="p-2">Yes</td><td className="p-2">Yes</td></tr>
                            <tr><td className="p-2">Image (<code>FileId</code>)</td><td className="p-2">Rejected</td><td className="p-2">Yes</td></tr>
                            <tr><td className="p-2">Audio</td><td className="p-2">Yes</td><td className="p-2">Rejected</td></tr>
                            <tr><td className="p-2">File (base64 / <code>FileId</code> / filename)</td><td className="p-2">Yes</td><td className="p-2">Yes</td></tr>
                            <tr><td className="p-2">File (<code>FileUrl</code> only)</td><td className="p-2">Rejected</td><td className="p-2">Yes</td></tr>
                        </tbody>
                    </table>

                    <h3>Outputs</h3>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">Content</th>
                                <th className="text-left p-2">Completions</th>
                                <th className="text-left p-2">Responses</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr><td className="p-2">Text</td><td className="p-2">Yes</td><td className="p-2">Yes</td></tr>
                            <tr><td className="p-2">Audio output (via <code>SetAudioOutputConfig</code>)</td><td className="p-2">Yes</td><td className="p-2">Empty</td></tr>
                            <tr><td className="p-2">Image generation (via hosted tool)</td><td className="p-2">Empty</td><td className="p-2">Yes</td></tr>
                        </tbody>
                    </table>

                    <Callout type="warning" title="No silent drops">
                        <p>
                            <code>AddMultiModalMessage</code> and <code>SetAudioOutputConfig</code> return
                            <code>false</code> and log <code>UE_LOG(Error)</code> when given content the
                            active backend cannot serve. <code>GetLastAudioOutput</code> /
                            <code>GetLastImageOutput</code> return empty on backends that don't produce that
                            modality — checking is non-destructive and never errors.
                        </p>
                    </Callout>

                    <h2>Converting UE Assets to Content Parts</h2>

                    <p>
                        <code>UGAiFileHelpers</code> turns UE asset types into <code>FGAiContentPart</code>
                        values without you having to manage base64 encoding, MIME-type detection, or platform
                        compression. All helpers below are runtime-safe and work in packaged builds.
                    </p>

                    <Example>
                        <ExampleTitle>Image Helpers</ExampleTitle>
                        <ExampleCpp>
                            {`// UTexture2D → content part (handles compressed GPU formats)
FGAiContentPart Part = UGAiFileHelpers::CreateImageContentPart(
    Texture, EResponsesApiImageDetail::High);

// Render target (e.g. a SceneCapture2D output)
FGAiContentPart RtPart = UGAiFileHelpers::CreateImageContentPart(
    RenderTarget, EResponsesApiImageDetail::Auto);

// Remote URL — no encoding
FGAiContentPart UrlPart = UGAiFileHelpers::CreateImageContentPartFromUrl(
    TEXT("https://cdn.example.com/img.png"));

// File on disk — base64 + MIME from extension
FGAiContentPart FilePart = UGAiFileHelpers::CreateImageContentPartFromFile(
    TEXT("Screenshots/last.png"), EGAiPathType::Project);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Audio Helpers</ExampleTitle>
                        <ExampleContent>
                            <code>USoundWave</code> is encoded directly when streaming/editor source data is
                            available; otherwise the runtime decompresses the platform-compressed data to PCM
                            and re-encodes to the requested format.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FGAiContentPart WavPart = UGAiFileHelpers::CreateAudioContentPart(
    SoundWave, EResponsesApiAudioFormat::WAV);

FGAiContentPart FromFile = UGAiFileHelpers::CreateAudioContentPartFromFile(
    TEXT("Audio/clip.wav"), EGAiPathType::Project,
    EResponsesApiAudioFormat::WAV);

// Raw helpers (alongside the existing TextureToBase64/Base64ToTexture pair)
FString Base64 = UGAiFileHelpers::SoundWaveToBase64(SoundWave);
USoundWave* Decoded = UGAiFileHelpers::Base64ToSoundWave(
    Base64, EResponsesApiAudioFormat::WAV, this);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="tip" title="Streaming SoundWaves are cheaper">
                        <p>
                            Marking a <code>USoundWave</code> as <strong>Streaming</strong> preserves the
                            uncompressed source data into cooked builds, which lets the helper skip the
                            decompress-and-re-encode pass.
                        </p>
                    </Callout>

                    <Example>
                        <ExampleTitle>Generic Files</ExampleTitle>
                        <ExampleCpp>
                            {`FGAiContentPart Pdf = UGAiFileHelpers::CreateFileContentPart(
    TEXT("Docs/design.pdf"), EGAiPathType::Project);
// Filename and MIME type are detected from the path automatically.`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Reverse Conversion: Output → UE Asset</ExampleTitle>
                        <ExampleCpp>
                            {`if (auto Image = Session->GetLastImageOutput(); Image.IsSet())
{
    UTexture2D* Tex = UGAiFileHelpers::ToTexture(Image.GetValue(), this);
    /* ... */
}

if (auto Audio = Session->GetLastAudioOutput(); Audio.IsSet())
{
    USoundWave* Wave = UGAiFileHelpers::ToSoundWave(Audio.GetValue(), this);
    /* ... */
}`}
                        </ExampleCpp>
                    </Example>

                    <h2>Editor-Only Helpers</h2>

                    <Callout type="info" title="Editor module only">
                        <p>
                            These helpers live in the <code>GenerativeAiEditor</code> module under the
                            Blueprint category <code>GenerativeAI|Content|Editor</code>. They are stripped
                            from packaged builds — runtime gameplay code cannot reach them, by design.
                        </p>
                    </Callout>

                    <Example>
                        <ExampleTitle>Viewport Capture &amp; Preview Helpers</ExampleTitle>
                        <ExampleCpp>
                            {`// Capture the active level editor viewport
FGAiContentPart Vp =
    UGAiEditorContentHelpers::CaptureEditorViewport(
        EResponsesApiImageDetail::Auto);

// Render asset thumbnail / mesh / material previews to images
FGAiContentPart Thumb = UGAiEditorContentHelpers::
    CreateImageContentPartFromThumbnail(Asset);

FGAiContentPart MeshImg = UGAiEditorContentHelpers::
    CreateImageContentPartFromMeshPreview(StaticMesh);

FGAiContentPart MatImg = UGAiEditorContentHelpers::
    CreateImageContentPartFromMaterialPreview(Material);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Multi-Modal Agents</h2>

                    <p>
                        <code>UGAiAgent::Prompt</code> has an overload that accepts an
                        <code>AdditionalContent</code> array, and <code>FGAiAgentRunResult</code> has a
                        matching <code>ContentParts</code> field for inspecting non-text output. See
                        <code>Using Agents</code> and the Agents API reference for the full surface.
                    </p>

                    <h2>Image Detail Level</h2>

                    <p>Control how much detail the model processes from images:</p>

                    <ul>
                        <li><strong>High</strong>: Thorough analysis, slower, more expensive</li>
                        <li><strong>Low</strong>: Faster processing, less detail, cheaper</li>
                        <li><strong>Auto</strong>: Model chooses based on image characteristics</li>
                    </ul>

                    <h2>Provider Capability Notes</h2>

                    <p>
                        Vision/audio support varies by provider and model. The unified layer does not
                        validate provider capabilities — it only validates against the chosen API shape.
                        Verify your model supports the modalities you send.
                    </p>

                    <ul>
                        <li><strong>OpenAI</strong>: vision (gpt-4o, gpt-4o-mini, gpt-4-turbo); audio in/out (gpt-audio family).</li>
                        <li><strong>Anthropic</strong>: vision (Claude 3 family, Claude 3.5 Sonnet).</li>
                        <li><strong>Google</strong>: vision (Gemini 1.5/2.0).</li>
                    </ul>

                    <Callout type="info" title="Size limits">
                        <p>
                            Check provider documentation for current limits. Typical image maximums:
                            OpenAI 20MB / 4096&times;4096; Anthropic 5MB per image. Keep images at or below
                            2048&times;2048 for the best cost/latency trade-off.
                        </p>
                    </Callout>

                    <p>
                        The raw per-backend content types are still accessible on the request struct if
                        you need them, but new code should prefer the unified <code>FGAiContentPart</code>
                        path described above.
                    </p>

                    <PageFooter />
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}
