import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Image Generation',
    description: 'Generate images with AI from text descriptions',
    order: 4,
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

export default function ImageGenerationPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <p>
                        Image Generation enables AI to create images from text descriptions. The AI decides when to
                        generate images as part of its response.
                    </p>

                    <h2>Basic Usage</h2>

                    <Example>
                        <ExampleTitle>Enable Image Generation</ExampleTitle>
                        <ExampleContent>
                            Add the image generation tool with size and quality settings.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "GenerativeAi/Sessions/GAiResponsesApiSession.h"

auto* Session = UGAiResponsesApiSession::CreateChatSession(
    EndpointConfig, this,
    TEXT("You can generate images for game assets."),
    TEXT("Generate a 1024x1024 icon of a frost sword on dark background.")
);

// Add image generation tool
FResponsesApiImageGenerationTool ImageGenTool;
ImageGenTool.Size = EResponsesApiToolImageGenerationSize::_1024x1024;
ImageGenTool.Quality = EResponsesApiToolImageGenerationQuality::High;
Session->Request.Tools.Add(MakeInstancedStruct(ImageGenTool));

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        UE_LOG(LogTemp, Log, TEXT("AI: %s"), *Ctx->GetAggregatedResponseText());
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Configuration</h2>

                    <Example>
                        <ExampleTitle>Image Size</ExampleTitle>
                        <ExampleContent>
                            Choose from standard sizes based on use case.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiImageGenerationTool ImageGenTool;

// Available sizes
ImageGenTool.Size = EResponsesApiToolImageGenerationSize::Auto;        // Auto-detect
ImageGenTool.Size = EResponsesApiToolImageGenerationSize::_1024x1024;  // Square
ImageGenTool.Size = EResponsesApiToolImageGenerationSize::_1024x1536;  // Portrait
ImageGenTool.Size = EResponsesApiToolImageGenerationSize::_1536x1024;  // Landscape

Session->Request.Tools.Add(MakeInstancedStruct(ImageGenTool));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Quality and Format</ExampleTitle>
                        <ExampleContent>
                            Set quality level and output format.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiImageGenerationTool ImageGenTool;

// Quality: Low, Medium, High, or Auto
ImageGenTool.Quality = EResponsesApiToolImageGenerationQuality::High;

// Format: PNG (transparency), JPEG (smaller), WebP (modern)
ImageGenTool.OutputFormat = EResponsesApiImageFormat::Png;

// Background: Transparent, Opaque, or Auto
ImageGenTool.Background = EResponsesApiToolImageGenerationBackground::Opaque;

Session->Request.Tools.Add(MakeInstancedStruct(ImageGenTool));`}
                        </ExampleCpp>
                    </Example>

                    <h2>Accessing Generated Images</h2>

                    <Example>
                        <ExampleTitle>Get Image URLs</ExampleTitle>
                        <ExampleContent>
                            Retrieve image URLs from response items.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        auto* ResponsesSession = Cast<UGAiResponsesApiSession>(Ctx);
        if (!ResponsesSession) return;

        for (const auto& Item : ResponsesSession->Response.OutputItems)
        {
            if (Item.GetType() == EResponsesApiResponseItemType::ImageGenerationCall)
            {
                auto* ImageCall = Item.TryGet<FResponsesApiImageGenerationCall>();
                if (ImageCall)
                {
                    FString Base64Result = ImageCall->Result.Get(TEXT(""));
                    
                    UE_LOG(LogTemp, Log, TEXT("Image (base64): %d bytes"), Base64Result.Len());
                    
                    // Decode base64 and create texture
                    DecodeAndCreateTexture(Base64Result);
                }
            }
        }
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Prompt Best Practices</h2>

                    <ul>
                        <li><strong>Be specific</strong> - "Glowing blue health potion in round glass bottle with gold trim, dark background"</li>
                        <li><strong>Include style</strong> - "fantasy art", "pixel art", "realistic", "stylized"</li>
                        <li><strong>Specify lighting</strong> - "dramatic lighting", "soft ambient", "glowing"</li>
                        <li><strong>Set composition</strong> - "centered", "close-up", "isometric view"</li>
                    </ul>

                    <h2>Common Patterns</h2>

                    <Example>
                        <ExampleTitle>Inventory Icons</ExampleTitle>
                        <ExampleContent>
                            Optimize configuration for game UI icons.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiImageGenerationTool ImageGenTool;
ImageGenTool.Size = EResponsesApiToolImageGenerationSize::_1024x1024;
ImageGenTool.Quality = EResponsesApiToolImageGenerationQuality::High;
ImageGenTool.Background = EResponsesApiToolImageGenerationBackground::Opaque;
ImageGenTool.OutputFormat = EResponsesApiImageFormat::Png;

Session->SetSystemMessage(TEXT(
    "Generate inventory icons with dark backgrounds. "
    "Use isometric view, high contrast, game asset style."
));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Concept Art</ExampleTitle>
                        <ExampleContent>
                            Larger format for visual exploration.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiImageGenerationTool ImageGenTool;
ImageGenTool.Size = EResponsesApiToolImageGenerationSize::_1536x1024;
ImageGenTool.Quality = EResponsesApiToolImageGenerationQuality::High;

Session->SetSystemMessage(TEXT(
    "Create concept art for environments and characters. "
    "Use painterly style with atmospheric lighting."
));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>UI Elements with Transparency</ExampleTitle>
                        <ExampleContent>
                            Generate transparent assets for UI overlays.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiImageGenerationTool ImageGenTool;
ImageGenTool.Size = EResponsesApiToolImageGenerationSize::_256x256;
ImageGenTool.Background = EResponsesApiToolImageGenerationBackground::Transparent;
ImageGenTool.OutputFormat = EResponsesApiImageFormat::Png;

Session->AddUserMessage(TEXT(
    "Create achievement badge with golden star, transparent background"
));`}
                        </ExampleCpp>
                    </Example>

                    <PageFooter />
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}