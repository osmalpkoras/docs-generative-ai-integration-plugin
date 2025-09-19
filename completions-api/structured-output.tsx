import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Structured Output',
    description: 'JSON Schema-validated data object generation',
    order: 6,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer } from '@/components/layout';
import {
    LanguageToggleProvider,
    LanguageToggle,
    Callout,
    CodeExample,
    ConsoleOutput,
    StepList,
    Step,
} from '@/components/doc-components';

export default function StructuredOutputPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="font-bold m-0!">Structured Output</h1>
                        <LanguageToggle />
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        Structured output enforces <strong>JSON Schema validation</strong> on AI-generated responses. This ensures that
                        generated data conforms to a predefined structure and can be directly deserialized into typed Unreal Engine
                        objects. The system supports the full <a href="https://platform.openai.com/docs/guides/structured-outputs" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">OpenAI structured outputs specification</a>, including complex and nested objects.
                        Recursive objects are not yet supported.
                    </p>

                    <h2>How It Works</h2>

                    <StepList>
                        <Step title="Schema Definition">
                            <p>You define a schema class by deriving from <code>UJsonSchemaConvertableObject</code> and defining the properties you want to include in the schema.</p>
                        </Step>
                        <Step title="Schema Generation">
                            <p>The framework uses the Unreal Engine reflection system to inspect UPROPERTYs and generates a JSON Schema automatically, mapping UE datatypes to JSON types.</p>
                        </Step>
                        <Step title="Structured Generation">
                            <p>The schema is passed to the model as a constraint. The AI must return JSON that matches exactly.</p>
                        </Step>
                        <Step title="Deserialization">
                            <p>The model output is parsed and instantiated as a typed UObject instance  of your schema class, ready for direct use in gameplay or tooling code.</p>
                        </Step>
                    </StepList>

                    <h2>Defining a Schema</h2>

                    <p>
                        To configure structured output, implement a class that derives from <code>UJsonSchemaConvertableObject</code>.
                        Then, set its <code>UClass</code> as the response format on your session instance using{" "}
                        <code>SetResponseFormat</code>.
                    </p>

                    <CodeExample
                        title="Schema Class Definition"
                        description="UClass structure that defines the data schema for AI generation"
                        cppCode={`UCLASS()
class UCompletionExampleMissionBrief : public UJsonSchemaConvertableObject
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mission", meta=(ToolTip="Mission title"))
    FString Title;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mission", meta=(ToolTip="Mission summary"))
    FString Summary;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mission", meta=(ToolTip="Objectives the player must complete", JsonSchema_MinItems="1"))
    TArray<FString> Objectives;
};`}
                    />

                    <h2>Controlling Schema Parameters</h2>

                    <p>
                        UPROPERTY metadata specifiers allow fine-grained control over the generated JSON Schema. These are parsed automatically and
                        mapped to schema fields. Some of the most relevant specifiers include:
                    </p>

                    <ul className="list-disc pl-6 space-y-2">
                        <li><code>JsonSchema_ExcludeFromSchema</code> – Exclude this property from schema generation.</li>
                        <li><code>JsonSchema_Description</code>, <code>ToolTip</code> , or the C++ <strong>UPROPERTY comment</strong> – Add a human-readable description to guide the model. If no explicit description metadata is provided, the C++ comment associated with the UPROPERTY will be used as the schema field description.</li>
                        <li><code>JsonSchema_Optional</code> – Mark property as optional.</li>
                        <li><code>JsonSchema_Pattern</code> – Enforce a regex pattern on string properties.</li>
                        <li><code>JsonSchema_Format</code> – Provide a semantic format hint (e.g. "date-time").</li>
                        <li><code>JsonSchema_Enum</code> – Explicitly define allowed values for string fields (useful if not using a UEnum).</li>
                        <li><code>JsonSchema_Minimum</code>, <code>JsonSchema_Maximum</code> – Numeric range constraints.</li>
                        <li><code>JsonSchema_ExclusiveMinimum</code>, <code>JsonSchema_ExclusiveMaximum</code> – Exclusive numeric bounds.</li>
                        <li><code>JsonSchema_MultipleOf</code> – Require numbers to be multiples of a given value.</li>
                        <li><code>JsonSchema_MinItems</code>, <code>JsonSchema_MaxItems</code> – Control array size limits.</li>
                    </ul>

                    <h2>Supported Data Types</h2>

                    <p>
                        The schema generator maps Unreal Engine datatypes to JSON Schema types as follows:
                    </p>

                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>FString, FName</strong> → <code>string</code></li>
                        <li><strong>int32</strong> → <code>integer</code></li>
                        <li><strong>float, double</strong> → <code>number</code></li>
                        <li><strong>bool</strong> → <code>boolean</code></li>
                        <li><strong>TArray&lt;T&gt;</strong> → <code>array</code></li>
                        <li><strong>UEnum</strong> → <code>enum</code> values</li>
                        <li><strong>UJsonSchemaConvertableObject</strong> → <code>object</code> (with nested schema)</li>
                    </ul>

                    <Callout type="warning" title="Recursive Types">
                        <p>
                            Recursive object definitions are not supported. Nested and complex objects are supported fully,
                            but you cannot define a property that directly or indirectly references its own type.
                        </p>
                    </Callout>

                    <h2>Example: Structured Output Generation</h2>

                    <p>
                        This example configures a session to generate a structured <code>UCompletionExampleMissionBrief</code> object.
                        The schema is enforced at generation time, and the resulting JSON is parsed into a UObject instance.
                    </p>

                    <CodeExample
                        title="Structured Output Implementation"
                        description="Enforcing schema and deserializing into a typed UObject"
                        cppCode={`UGAiCompletionApiSession* UGAiCompletions_StructuredOutputExample::Run(UGAiEndpointConfig* EndpointConfig, UObject* WorldContextObject)
{
    if (!ensureMsgf(EndpointConfig != nullptr, TEXT("EndpointConfig is required")))
    {
        return nullptr;
    }

    UGAiCompletionApiSession* Session = UGAiCompletionApiSession::CreateChatGenerationContext(
        EndpointConfig,
        WorldContextObject ? WorldContextObject : GetTransientPackage(),
        TEXT("Return JSON matching the provided schema exactly."),
        TEXT("Create a mission brief from this pitch: Escort convoy through stormy canyon with ambush risk.")
    );

    Session->SetResponseFormat(EResponsesApiTextFormatType::JsonSchema, UCompletionExampleMissionBrief::StaticClass());

    Session->Generate(
        FOnGenerationComplete::CreateLambda([](const UGAiCompletionApiSession* Ctx)
        {
            const UCompletionExampleMissionBrief* Brief = Cast<UCompletionExampleMissionBrief>(Ctx->StructuredOutput);
            if (!Brief)
            {
                UE_LOG(LogTemp, Warning, TEXT("Structured output parsing failed. Raw: %s"), *Ctx->GetResponseText());
            }
            else
            {
                UE_LOG(LogTemp, Log, TEXT("Mission: %s | %s | Objectives: %d"), *Brief->Title, *Brief->Summary, Brief->Objectives.Num());
            }
        }),
        FOnGenerationStreamChunk(),
        FOnGenerationError::CreateLambda([](const UGAiCompletionApiSession* Ctx)
        {
            UE_LOG(LogTemp, Error, TEXT("Structured output error: %s"), *Ctx->GetErrorMessage());
        })
    );

    return Session;
}`}
                    />

                    <h3>Successful Generation Example</h3>

                    <ConsoleOutput title="Structured Output Success">
                        {`LogTemp: Log: Mission: Canyon Convoy Protection | Guide a supply convoy safely through treacherous storm-swept canyon while defending against bandit ambushes. | Objectives: 4`}
                    </ConsoleOutput>

                    <h3>Error Handling Example</h3>

                    <ConsoleOutput title="Schema Validation Failure">
                        {`LogTemp: Warning: Structured output parsing failed. Raw: {"title": "Canyon Mission", "description": "Protect convoy", "goals": ["Navigate canyon"]}
# Note: Schema expected "Summary" and "Objectives" fields, but received "description" and "goals"`}
                    </ConsoleOutput>
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}
