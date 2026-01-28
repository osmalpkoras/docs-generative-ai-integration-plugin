import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Structured Output',
    description: 'Get type-safe, validated JSON responses automatically parsed into UObject instances',
    order: 202
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
import { LINK } from '@/lib/pages.generated';

export default function StructuredOutputPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <p>
                        Structured output ensures AI responses conform to your exact schema, with automatic validation
                        and parsing into strongly-typed UObject instances. Define your data structure once, and the plugin
                        handles schema generation, validation, and object conversion.
                    </p>

                    <h2>Why Use Structured Output?</h2>

                    <ul>
                        <li><strong>Type Safety</strong> - Get strongly-typed UObjects instead of parsing JSON manually</li>
                        <li><strong>Guaranteed Format</strong> - AI output validated against your schema before delivery</li>
                        <li><strong>Zero Parsing Code</strong> - Automatic conversion from JSON to UObject instances</li>
                        <li><strong>Reliability</strong> - No malformed JSON, missing fields, or type mismatches</li>
                    </ul>

                    <h2>Basic Usage</h2>

                    <Example>
                        <ExampleTitle>Define Your Schema</ExampleTitle>
                        <ExampleContent>
                            Create a UClass that implements the <code>IJsonSchema</code> interface. The plugin automatically
                            generates a JSON schema from your UPROPERTY definitions and ensures the AI's response matches
                            exactly. See the <a href={LINK.JSON_SCHEMA.INDEX}>JSON Schema Plugin</a> documentation for detailed
                            information on schema features and constraints.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "JsonSchema/JsonSchema.h"

UCLASS()
class UExampleMissionBrief : public UObject, public IJsonSchema
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mission")
    FString Title;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mission")
    FString Summary;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mission")
    TArray<FString> Objectives;
};`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Configure Session for Structured Output</ExampleTitle>
                        <ExampleContent>
                            Use <code>SetResponseFormat()</code> to configure the session to expect structured output.
                            The plugin handles schema generation and validation automatically.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Create session
auto* Session = UGAiResponsesApiSession::CreateChatSession(
    EndpointConfig,
    this,
    TEXT("Generate mission briefs matching the provided schema."),
    TEXT("Create a mission about escorting a convoy through hostile territory.")
);

// Configure structured output
Session->SetResponseFormat(
    EResponsesApiTextFormatType::JsonSchema,
    UExampleMissionBrief::StaticClass()
);

// Generate
Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        // Access the parsed structured output
        auto* MissionBrief = Cast<UExampleMissionBrief>(Ctx->StructuredOutput);

        if (MissionBrief)
        {
            UE_LOG(LogTemp, Log, TEXT("Title: %s"), *MissionBrief->Title);
            UE_LOG(LogTemp, Log, TEXT("Summary: %s"), *MissionBrief->Summary);

            for (const FString& Objective : MissionBrief->Objectives)
            {
                UE_LOG(LogTemp, Log, TEXT("  - %s"), *Objective);
            }
        }
    }),
    FOnGenerationError::CreateLambda([](const UGAiSession* Ctx)
    {
        UE_LOG(LogTemp, Error, TEXT("Error: %s"), *Ctx->GetErrorMessage());
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Automatic Schema Generation">
                        <p>
                            The plugin automatically generates JSON schemas from your UClass properties. You don't need
                            to write schemas manually. Property tooltips become field descriptions for the AI.
                        </p>
                    </Callout>

                    <Example>
                        <ExampleTitle>Accessing Structured Output</ExampleTitle>
                        <ExampleContent>
                            After generation completes, access the parsed object via the session's <code>StructuredOutput</code> property.
                            The object is already fully populated with validated data from the AI's response, if the response was parsed successfully. Therefore, always check for errors and validate that the structured output was successfully parsed before
                            using it in your game logic.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        if (Ctx->HasError())
        {
            UE_LOG(LogTemp, Error, TEXT("Generation failed: %s"),
                *Ctx->GetErrorMessage());
            return;
        }

        // Cast to your expected type
        auto* MissionBrief = Cast<UExampleMissionBrief>(Ctx->StructuredOutput);

        if (!MissionBrief)
        {
            UE_LOG(LogTemp, Error, TEXT("Failed to parse structured output"));
            return;
        }

        // Use the validated, strongly-typed data
        CreateMissionFromData(MissionBrief);
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Advanced Schema Features</h2>

                    <p>
                        The JSON Schema Plugin supports complex data structures including nested objects, arrays, enums,
                        maps, and validation constraints. Visit the <a href={LINK.JSON_SCHEMA.INDEX}>JSON Schema Plugin</a> documentation
                        for comprehensive information on:
                    </p>

                    <ul>
                        <li>Excluding UPROPERTIES from the schema</li>
                        <li>Property constraints (patterns, ranges, array limits)</li>
                        <li>Nested structures and complex types</li>
                        <li>Enum support with automatic conversion</li>
                        <li>Optional vs required fields</li>
                    </ul>

                    <h2>Provider Support</h2>

                    <p>Structured output availability varies by provider:</p>

                    <ul>
                        <li><strong>OpenAI</strong> - Full support (gpt-4o, gpt-4o-mini, o1 models)</li>
                        <li><strong>Anthropic Claude</strong> - Supported via tool use pattern</li>
                        <li><strong>Google Gemini</strong> - Check provider documentation for current support</li>
                        <li><strong>Local Models</strong> - Support depends on model capabilities</li>
                    </ul>

                    <Callout type="warning" title="Provider Compatibility">
                        <p>
                            Not all providers support structured output with schema validation. For providers without
                            native support, consider using JSON mode with careful prompt engineering or implementing
                            post-generation validation.
                        </p>
                    </Callout>

                    <h2>Best Practices</h2>

                    <ul>
                        <li><strong>Keep Schemas Focused</strong> - Define only the fields you need for your use case</li>
                        <li><strong>Use Descriptive Property Names</strong> - Clear names help the AI understand intent</li>
                        <li><strong>Add Tooltips</strong> - Property tooltips become field descriptions in the schema</li>
                        <li><strong>Validate Business Logic</strong> - Schema validation ensures format, but check game-specific constraints</li>
                        <li><strong>Handle Edge Cases</strong> - Always check for null/empty fields even with validation</li>
                        <li><strong>Set Appropriate Token Limits</strong> - Complex schemas need higher <code>MaxOutputTokens</code></li>
                    </ul>

                    <Example>
                        <ExampleTitle>Adding Descriptive Metadata</ExampleTitle>
                        <ExampleContent>
                            Use UPROPERTY metadata to provide rich context for the AI. Tooltips become field descriptions
                            in the generated schema.
                        </ExampleContent>
                        <ExampleCpp>
                            {`UCLASS()
class UQuestData : public UObject, public IJsonSchema
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite,
              meta = (ToolTip = "Quest title, should be engaging and descriptive"))
    FString Title;

    UPROPERTY(EditAnywhere, BlueprintReadWrite,
              meta = (ToolTip = "Recommended player level (1-100)"))
    int32 RecommendedLevel;

    UPROPERTY(EditAnywhere, BlueprintReadWrite,
              meta = (ToolTip = "List of 3-5 quest objectives in order"))
    TArray<FString> Objectives;
};`}
                        </ExampleCpp>
                    </Example>

                    <h2>Next Steps</h2>

                    <ul>
                        <li><a href={LINK.JSON_SCHEMA.INDEX}>JSON Schema Plugin</a> - Comprehensive guide to defining schemas</li>
                        <li><a href={LINK.GENERATIVE_AI.FEATURES.TOOLS}>Tools</a> - Combine structured output with custom tools</li>
                        <li><a href={LINK.GENERATIVE_AI.FEATURES.STREAMING}>Streaming</a> - Understanding streaming with structured output</li>
                        <li><a href={LINK.GENERATIVE_AI.CORE.USING_SESSIONS}>Using Sessions</a> - Session management fundamentals</li>
                    </ul>

                </LanguageToggleProvider>

                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
