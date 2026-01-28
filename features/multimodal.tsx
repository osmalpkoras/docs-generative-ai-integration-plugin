import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Multimodal Inputs',
    description: 'Working with images and other media types',
    order: 205
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import {
    Callout,
    LanguageToggleProvider,
    LanguageToggle,
    CodeExample,
    ConsoleOutput,
} from '@/components/doc-components';

export default function MultimodalPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <div className="flex items-center justify-between mb-4">
                        <PageHeader />
                        <LanguageToggle />
                    </div>

                    <p className="text-muted-foreground">
                        Multimodal AI can process multiple types of input including text, images, and more.
                        Learn how to send images and other media to AI models.
                    </p>

                    <h2>What is Multimodal?</h2>

                    <p>
                        Multimodal models can understand and reason about different types of content:
                    </p>

                    <ul>
                        <li><strong>Vision</strong>: Analyze images, screenshots, diagrams</li>
                        <li><strong>Text + Images</strong>: Answer questions about visual content</li>
                        <li><strong>Mixed Media</strong>: Combine multiple content types in one request</li>
                    </ul>

                    <h2>Completions API: Image Input</h2>

                    <h3>Image from URL</h3>

                    <CodeExample
                        title="Code Example"
                        cppCode={`// Add message with image URL
FCompletionApiMessage Msg;
Msg.Role = TEXT("user");

// Text content
FCompletionApiMessageContent TextContent;
TextContent.Type = TEXT("text");
TextContent.Text = TEXT("What's in this image?");
Msg.Content.Add(TextContent);

// Image content
FCompletionApiMessageContent ImageContent;
ImageContent.Type = TEXT("image_url");
ImageContent.ImageUrl = FCompletionApiImageUrl();
ImageContent.ImageUrl->Url = TEXT("https://example.com/screenshot.jpg");
Msg.Content.Add(ImageContent);

Session->Request.Messages.Add(Msg);
Session->Generate(/* ... */);`}
                    />

                    <h3>Base64 Encoded Images</h3>

                    <CodeExample
                        title="Code Example"
                        cppCode={`// Load image from file
TArray<uint8> ImageData;
FFileHelper::LoadFileToArray(ImageData, TEXT("path/to/image.png"));

// Convert to base64
FString Base64 = FBase64::Encode(ImageData);

// Create data URL
FString DataUrl = FString::Printf(
    TEXT("data:image/png;base64,%s"),
    *Base64
);

// Add to message
FCompletionApiMessageContent ImageContent;
ImageContent.Type = TEXT("image_url");
ImageContent.ImageUrl = FCompletionApiImageUrl();
ImageContent.ImageUrl->Url = DataUrl;
Msg.Content.Add(ImageContent);`}
                    />

                    <h3>Image Detail Level</h3>

                    <CodeExample
                        title="Code Example"
                        cppCode={`ImageContent.ImageUrl->Detail = TEXT("high");  // or "low", "auto"

// low: Faster, cheaper, less detailed analysis
// high: Slower, more expensive, detailed analysis
// auto: Model decides based on image`}
                    />

                    <h2>Responses API: Image Input</h2>

                    <h3>Basic Image Message</h3>

                    <CodeExample
                        title="Code Example"
                        cppCode={`// Create message
FResponsesApiMessage Msg;
Msg.Role = EResponsesApiMessageRole::User;

// Image content
FResponsesApiInputMessageItem ImageItem;
ImageItem.Type = EResponsesApiInputMessageItemType::Image;
ImageItem.ImageData = FResponsesApiImageData();
ImageItem.ImageData->Url = TEXT("https://example.com/screenshot.jpg");
Msg.Content.Add(ImageItem);

// Text content
FResponsesApiInputMessageItem TextItem;
TextItem.Type = EResponsesApiInputMessageItemType::Text;
TextItem.Text = TEXT("Describe what's happening in this screenshot.");
Msg.Content.Add(TextItem);

Session->Request.Messages.Add(Msg);
Session->Generate(/* ... */);`}
                    />

                    <h3>Multiple Images</h3>

                    <CodeExample
                        title="Code Example"
                        cppCode={`FResponsesApiMessage Msg;
Msg.Role = EResponsesApiMessageRole::User;

// First image
FResponsesApiInputMessageItem Image1;
Image1.Type = EResponsesApiInputMessageItemType::Image;
Image1.ImageData = FResponsesApiImageData();
Image1.ImageData->Url = TEXT("https://example.com/before.jpg");
Msg.Content.Add(Image1);

// Second image
FResponsesApiInputMessageItem Image2;
Image2.Type = EResponsesApiInputMessageItemType::Image;
Image2.ImageData = FResponsesApiImageData();
Image2.ImageData->Url = TEXT("https://example.com/after.jpg");
Msg.Content.Add(Image2);

// Question about both images
FResponsesApiInputMessageItem Text;
Text.Type = EResponsesApiInputMessageItemType::Text;
Text.Text = TEXT("What changed between these two images?");
Msg.Content.Add(Text);

Session->Request.Messages.Add(Msg);`}
                    />

                    <h2>Common Use Cases</h2>

                    <h3>Screenshot Analysis</h3>

                    <CodeExample
                        title="Code Example"
                        cppCode={`class UScreenshotAnalyzer : public UObject
{
    UPROPERTY()
    UGAiResponsesApiSession* Session;

public:
    void AnalyzeGameplay(const FString& ScreenshotPath)
    {
        // Load screenshot
        TArray<uint8> ImageData;
        FFileHelper::LoadFileToArray(ImageData, *ScreenshotPath);
        FString Base64 = FBase64::Encode(ImageData);

        // Create message with image
        FResponsesApiMessage Msg;
        Msg.Role = EResponsesApiMessageRole::User;

        FResponsesApiInputMessageItem ImageItem;
        ImageItem.Type = EResponsesApiInputMessageItemType::Image;
        ImageItem.ImageData = FResponsesApiImageData();
        ImageItem.ImageData->Url = FString::Printf(
            TEXT("data:image/png;base64,%s"),
            *Base64
        );
        Msg.Content.Add(ImageItem);

        FResponsesApiInputMessageItem TextItem;
        TextItem.Type = EResponsesApiInputMessageItemType::Text;
        TextItem.Text = TEXT("Analyze this gameplay screenshot. "
                           "Describe the player's situation and suggest strategies.");
        Msg.Content.Add(TextItem);

        Session->Request.Messages.Add(Msg);

        Session->Generate(
            FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
            {
                FString Analysis = Ctx->GetAggregatedResponseText();
                UE_LOG(LogTemp, Log, TEXT("Analysis: %s"), *Analysis);
            })
        );
    }
};`}
                    />

                    <h3>UI Element Recognition</h3>

                    <CodeExample
                        title="Code Example"
                        cppCode={`void AnalyzeUILayout(UTexture2D* UITexture)
{
    // Convert texture to bytes
    TArray<uint8> ImageBytes;
    ConvertTextureToBytes(UITexture, ImageBytes);
    FString Base64 = FBase64::Encode(ImageBytes);

    // Ask AI about UI elements
    Session->AddUserMessage({
        ImageItem: {
            Type: Image,
            Url: "data:image/png;base64," + Base64
        },
        TextItem: {
            Type: Text,
            Text: "List all buttons and interactive elements visible in this UI. "
                 "Describe their locations and likely functions."
        }
    });

    Session->Generate(/* ... */);
}`}
                    />

                    <h3>Level Design Feedback</h3>

                    <CodeExample
                        title="Code Example"
                        cppCode={`void GetLevelDesignFeedback(const FString& TopDownImagePath)
{
    TArray<uint8> ImageData;
    FFileHelper::LoadFileToArray(ImageData, *TopDownImagePath);
    FString Base64 = FBase64::Encode(ImageData);

    FResponsesApiMessage Msg;
    Msg.Role = EResponsesApiMessageRole::User;

    // Add top-down view image
    FResponsesApiInputMessageItem ImageItem;
    ImageItem.Type = EResponsesApiInputMessageItemType::Image;
    ImageItem.ImageData = FResponsesApiImageData();
    ImageItem.ImageData->Url = FString::Printf(
        TEXT("data:image/png;base64,%s"),
        *Base64
    );
    Msg.Content.Add(ImageItem);

    // Request feedback
    FResponsesApiInputMessageItem TextItem;
    TextItem.Type = EResponsesApiInputMessageItemType::Text;
    TextItem.Text = TEXT("This is a top-down view of a game level. "
                       "Analyze the layout and provide feedback on: "
                       "1) Flow and pacing, 2) Cover placement, "
                       "3) Sightlines, 4) Potential camping spots.");
    Msg.Content.Add(TextItem);

    Session->Request.Messages.Add(Msg);
    Session->Generate(/* ... */);
}`}
                    />

                    <h2>Image Format Support</h2>

                    <p>Most vision models support common formats:</p>

                    <ul>
                        <li><strong>PNG</strong>: Lossless, supports transparency</li>
                        <li><strong>JPEG/JPG</strong>: Compressed photos</li>
                        <li><strong>WebP</strong>: Modern format</li>
                        <li><strong>GIF</strong>: Limited animation support (usually first frame)</li>
                    </ul>

                    <Callout type="info" title="Image Size Limits">
                        <p>
                            Check your provider's documentation for image size limits. Typical limits:
                        </p>
                        <ul>
                            <li>OpenAI: 20MB per image, max 4096x4096 pixels</li>
                            <li>Claude: 5MB per image</li>
                        </ul>
                    </Callout>

                    <h2>Complete Example: Image Q&A System</h2>

                    <CodeExample
                        title="Code Example"
                        cppCode={`class UImageQASystem : public UObject
{
    UPROPERTY()
    UGAiResponsesApiSession* Session;

public:
    void Initialize(UGAiEndpointConfig* Config)
    {
        Session = UGAiResponsesApiSession::CreateChatSession(
            Config, this,
            TEXT("You are an expert at analyzing game screenshots and images. "
                 "Provide detailed, accurate descriptions."),
            TEXT("")
        );

        Session->Request.MaxOutputTokens = 512;
        Session->Request.Temperature = 0.7f;
    }

    void AskAboutImage(const FString& ImagePath,
                      const FString& Question,
                      TFunction<void(const FString&)> OnAnswer)
    {
        // Load and encode image
        TArray<uint8> ImageData;
        if (!FFileHelper::LoadFileToArray(ImageData, *ImagePath))
        {
            UE_LOG(LogTemp, Error, TEXT("Failed to load image: %s"), *ImagePath);
            OnAnswer(TEXT("Error: Could not load image"));
            return;
        }

        FString Base64 = FBase64::Encode(ImageData);

        // Detect format from extension
        FString Extension = FPaths::GetExtension(ImagePath).ToLower();
        FString MimeType = TEXT("image/png");
        if (Extension == TEXT("jpg") || Extension == TEXT("jpeg"))
        {
            MimeType = TEXT("image/jpeg");
        }
        else if (Extension == TEXT("webp"))
        {
            MimeType = TEXT("image/webp");
        }

        // Create message
        FResponsesApiMessage Msg;
        Msg.Role = EResponsesApiMessageRole::User;

        // Add image
        FResponsesApiInputMessageItem ImageItem;
        ImageItem.Type = EResponsesApiInputMessageItemType::Image;
        ImageItem.ImageData = FResponsesApiImageData();
        ImageItem.ImageData->Url = FString::Printf(
            TEXT("data:%s;base64,%s"),
            *MimeType, *Base64
        );
        Msg.Content.Add(ImageItem);

        // Add question
        FResponsesApiInputMessageItem TextItem;
        TextItem.Type = EResponsesApiInputMessageItemType::Text;
        TextItem.Text = Question;
        Msg.Content.Add(TextItem);

        Session->Request.Messages.Add(Msg);

        // Generate answer
        Session->Generate(
            FOnGenerationComplete::CreateLambda(
                [OnAnswer](const UGAiSession* Ctx)
            {
                if (Ctx->HasError())
                {
                    OnAnswer(TEXT("Error: ") + Ctx->GetErrorMessage());
                    return;
                }

                FString Answer = Ctx->GetAggregatedResponseText();
                OnAnswer(Answer);
            }),
            FOnGenerationError::CreateLambda(
                [OnAnswer](const UGAiSession* Ctx)
            {
                OnAnswer(TEXT("Error: ") + Ctx->GetErrorMessage());
            })
        );
    }
};

// Usage
void AnalyzeGameScreenshot()
{
    ImageQA->AskAboutImage(
        TEXT("Content/Screenshots/gameplay.png"),
        TEXT("What enemy types are visible and what are their positions?"),
        [](const FString& Answer)
        {
            UE_LOG(LogTemp, Log, TEXT("AI Answer: %s"), *Answer);
        }
    );
}`}
                    />

                    <h2>Performance Considerations</h2>

                    <h3>Image Size Optimization</h3>

                    <CodeExample
                        title="Code Example"
                        cppCode={`// Resize large images before sending
UTexture2D* ResizeImage(UTexture2D* Original, int32 MaxDimension)
{
    int32 Width = Original->GetSizeX();
    int32 Height = Original->GetSizeY();

    if (Width <= MaxDimension && Height <= MaxDimension)
    {
        return Original;  // No resize needed
    }

    // Calculate new dimensions
    float Scale = FMath::Min(
        (float)MaxDimension / Width,
        (float)MaxDimension / Height
    );

    int32 NewWidth = FMath::RoundToInt(Width * Scale);
    int32 NewHeight = FMath::RoundToInt(Height * Scale);

    // Resize texture (implementation depends on your engine version)
    return ResizeTexture(Original, NewWidth, NewHeight);
}`}
                    />

                    <h3>Caching Base64 Conversions</h3>

                    <CodeExample
                        title="Code Example"
                        cppCode={`class UImageCache : public UObject
{
    TMap<FString, FString> Base64Cache;

public:
    FString GetOrConvertToBase64(const FString& ImagePath)
    {
        // Check cache
        if (Base64Cache.Contains(ImagePath))
        {
            return Base64Cache[ImagePath];
        }

        // Load and convert
        TArray<uint8> ImageData;
        FFileHelper::LoadFileToArray(ImageData, *ImagePath);
        FString Base64 = FBase64::Encode(ImageData);

        // Cache result
        Base64Cache.Add(ImagePath, Base64);

        return Base64;
    }
};`}
                    />

                    <h2>Provider Support</h2>

                    <ul>
                        <li><strong>OpenAI</strong>: GPT-4o, GPT-4-turbo (vision support)</li>
                        <li><strong>Claude</strong>: Claude 3+ models (Opus, Sonnet, Haiku)</li>
                        <li><strong>Gemini</strong>: Gemini Pro Vision, Gemini 1.5+</li>
                        <li><strong>Others</strong>: Check provider documentation</li>
                    </ul>

                    <Callout type="warning" title="Model Compatibility">
                        <p>
                            Not all models support vision. Ensure you're using a vision-capable model
                            when sending images. Non-vision models will return an error.
                        </p>
                    </Callout>

                    <h2>Common Issues</h2>

                    <h3>Image Too Large</h3>

                    <p>Resize images before encoding:</p>

                    <CodeExample
                        title="Code Example"
                        cppCode={`// Keep images under 2048x2048 for best performance
if (Width > 2048 || Height > 2048)
{
    Texture = ResizeImage(Texture, 2048);
}`}
                    />

                    <h3>Base64 String Too Long</h3>

                    <p>Use URLs when possible instead of base64:</p>

                    <CodeExample
                        title="Code Example"
                        cppCode={`// Prefer URL (if image is hosted)
ImageContent.ImageUrl->Url = TEXT("https://cdn.example.com/image.jpg");

// Instead of large base64 strings`}
                    />

                    <h2>Next Steps</h2>

                    <ul>
                        <li><strong>Structured Output</strong>: Get structured data from image analysis</li>
                        <li><strong>Tools</strong>: Create tools that work with image analysis</li>
                        <li><strong>Streaming</strong>: Stream responses for image descriptions</li>
                    </ul>

                </LanguageToggleProvider>


                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
