import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Multimodal Inputs',
    description: 'Send images and other media to AI models',
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
                        Multimodal models can process images alongside text, enabling vision-based AI interactions.
                        Both the Completions and Responses APIs support sending images as message content.
                    </p>

                    <h2>Completions API</h2>

                    <Example>
                        <ExampleTitle>Image from URL or Base64</ExampleTitle>
                        <ExampleContent>
                            Create a message with image and text content parts.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FCompletionApiMessage Msg;
Msg.Role = TEXT("user");

// Text content
FCompletionApiMessageContentPart TextPart = 
    FCompletionApiMessageContentPart::CreateText(
        TEXT("What's in this image?")
    );
Msg.Content.Add(TextPart);

// Image from URL
FCompletionApiImageUrl ImageUrl;
ImageUrl.Url = TEXT("https://example.com/screenshot.jpg");
ImageUrl.Detail = EResponsesApiImageDetail::High;  // or Low, Auto

FCompletionApiMessageContentPart ImagePart = 
    FCompletionApiMessageContentPart::CreateInputImage(ImageUrl);
Msg.Content.Add(ImagePart);

Session->Request.Messages.Add(Msg);
Session->Generate(/* ... */);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Base64 Encoded Image</ExampleTitle>
                        <ExampleContent>
                            Load image from disk, encode as base64, and send as data URL.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Load image
TArray<uint8> ImageData;
FFileHelper::LoadFileToArray(ImageData, TEXT("path/to/image.png"));
FString Base64 = FBase64::Encode(ImageData);

// Create data URL
FString DataUrl = FString::Printf(
    TEXT("data:image/png;base64,%s"),
    *Base64
);

// Add to message
FCompletionApiImageUrl ImageUrl;
ImageUrl.Url = DataUrl;
ImageUrl.Detail = EResponsesApiImageDetail::High;

FCompletionApiMessageContentPart ImagePart = 
    FCompletionApiMessageContentPart::CreateInputImage(ImageUrl);
Msg.Content.Add(ImagePart);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Responses API</h2>

                    <Example>
                        <ExampleTitle>Image Message</ExampleTitle>
                        <ExampleContent>
                            Use message content items to include images in Responses API messages.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiMessage Msg;
Msg.Role = EResponsesApiMessageRole::User;

// Image content
FResponsesApiInputImage ImageContent;
ImageContent.ImageUrl = TEXT("https://example.com/screenshot.jpg");
ImageContent.Detail = EResponsesApiImageDetail::High;
Msg.Content.Add(ImageContent);

// Text content
FResponsesApiInputText TextContent;
TextContent.Text = TEXT("Describe what's happening in this screenshot.");
Msg.Content.Add(TextContent);

Session->Request.Messages.Add(Msg);
Session->Generate(/* ... */);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Multiple Images</ExampleTitle>
                        <ExampleContent>
                            Add multiple images to a single message for comparative analysis.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiMessage Msg;
Msg.Role = EResponsesApiMessageRole::User;

// First image
FResponsesApiInputImage Image1;
Image1.ImageUrl = TEXT("https://example.com/before.jpg");
Msg.Content.Add(Image1);

// Second image
FResponsesApiInputImage Image2;
Image2.ImageUrl = TEXT("https://example.com/after.jpg");
Msg.Content.Add(Image2);

// Question
FResponsesApiInputText Text;
Text.Text = TEXT("What changed between these two images?");
Msg.Content.Add(Text);

Session->Request.Messages.Add(Msg);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Image Detail Level</h2>

                    <p>Control how much detail the model processes from images:</p>

                    <ul>
                        <li><strong>High</strong>: Thorough analysis, slower, more expensive</li>
                        <li><strong>Low</strong>: Faster processing, less detail, cheaper</li>
                        <li><strong>Auto</strong>: Model chooses based on image characteristics</li>
                    </ul>

                    <Example>
                        <ExampleTitle>Setting Detail Level</ExampleTitle>
                        <ExampleContent>
                            Configure image detail for cost/performance trade-off.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Completions API
ImageUrl.Detail = EResponsesApiImageDetail::High;

// Responses API
ImageContent.Detail = EResponsesApiImageDetail::Low;`}
                        </ExampleCpp>
                    </Example>

                    <h2>Format Support</h2>

                    <p>Common image formats supported by vision models:</p>

                    <ul>
                        <li><strong>PNG</strong>: Lossless, transparency support</li>
                        <li><strong>JPEG</strong>: Compressed photos</li>
                        <li><strong>WebP</strong>: Modern compression</li>
                        <li><strong>GIF</strong>: First frame only</li>
                    </ul>

                    <Callout type="info" title="Size Limits">
                        <p>
                            Check provider documentation for limits. Typical maximums:
                        </p>
                        <ul>
                            <li>OpenAI: 20MB, 4096x4096 pixels</li>
                            <li>Claude: 5MB per image</li>
                        </ul>
                    </Callout>

                    <h2>Practical Example</h2>

                    <Example>
                        <ExampleTitle>Screenshot Analysis</ExampleTitle>
                        <ExampleContent>
                            Analyze gameplay screenshots using multimodal input.
                        </ExampleContent>
                        <ExampleCpp>
                            {`void AnalyzeScreenshot(const FString& Path)
{
    // Load and encode
    TArray<uint8> ImageData;
    FFileHelper::LoadFileToArray(ImageData, *Path);
    FString Base64 = FBase64::Encode(ImageData);

    // Build message
    FResponsesApiMessage Msg;
    Msg.Role = EResponsesApiMessageRole::User;

    FResponsesApiInputImage Image;
    Image.ImageUrl = FString::Printf(
        TEXT("data:image/png;base64,%s"),
        *Base64
    );
    Msg.Content.Add(Image);

    FResponsesApiInputText Text;
    Text.Text = TEXT("Analyze this gameplay screenshot. "
                   "Describe the situation and suggest strategies.");
    Msg.Content.Add(Text);

    Session->Request.Messages.Add(Msg);

    Session->Generate(
        FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
        {
            FString Analysis = Ctx->GetAggregatedResponseText();
            UE_LOG(LogTemp, Log, TEXT("%s"), *Analysis);
        })
    );
}`}
                        </ExampleCpp>
                    </Example>

                    <h2>Performance Tips</h2>

                    <h3>Resize Before Encoding</h3>

                    <p>Reduce image dimensions to improve performance and reduce costs:</p>

                    <Example>
                        <ExampleTitle>Image Resizing</ExampleTitle>
                        <ExampleContent>
                            Keep images under 2048x2048 for optimal performance.
                        </ExampleContent>
                        <ExampleCpp>
                            {`UTexture2D* OptimizeForVision(UTexture2D* Original)
{
    int32 Width = Original->GetSizeX();
    int32 Height = Original->GetSizeY();
    int32 MaxDim = 2048;

    if (Width <= MaxDim && Height <= MaxDim)
    {
        return Original;
    }

    float Scale = FMath::Min(
        (float)MaxDim / Width,
        (float)MaxDim / Height
    );

    return ResizeTexture(Original, 
        FMath::RoundToInt(Width * Scale),
        FMath::RoundToInt(Height * Scale)
    );
}`}
                        </ExampleCpp>
                    </Example>

                    <h3>Prefer URLs Over Base64</h3>

                    <p>When images are hosted, use URLs directly instead of encoding:</p>

                    <Example>
                        <ExampleTitle>URL vs Base64</ExampleTitle>
                        <ExampleContent>
                            URLs are more efficient than base64 encoding when available.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Prefer this (if image is hosted)
ImageUrl.Url = TEXT("https://cdn.example.com/image.jpg");

// Over this (large base64 strings)
ImageUrl.Url = TEXT("data:image/jpeg;base64,/9j/4AAQSkZJRg...");`}
                        </ExampleCpp>
                    </Example>

                    <h2>Model Support</h2>

                    <p>Vision-capable models by provider:</p>

                    <ul>
                        <li><strong>OpenAI</strong>: gpt-4o, gpt-4o-mini, gpt-4-turbo</li>
                        <li><strong>Anthropic</strong>: claude-3-opus, claude-3-sonnet, claude-3-haiku, claude-3-5-sonnet</li>
                        <li><strong>Google</strong>: gemini-1.5-pro, gemini-1.5-flash, gemini-2.0-flash</li>
                    </ul>

                    <Callout type="warning" title="Check Model Capabilities">
                        <p>
                            Not all models support vision. Verify your model supports multimodal input before sending
                            images. Non-vision models will return errors when receiving image content.
                        </p>
                    </Callout>

                    <PageFooter />
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}
