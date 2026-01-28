import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Code Interpreter',
    description: 'Execute Python code for data analysis and computation',
    order: 3,
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

export default function CodeInterpreterPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <p>
                        Code Interpreter allows AI to write and execute Python code in a secure sandbox for data analysis,
                        calculations, visualizations, and file processing.
                    </p>

                    <h2>Basic Usage</h2>

                    <Example>
                        <ExampleTitle>Enable Code Interpreter</ExampleTitle>
                        <ExampleContent>
                            Add the code interpreter tool to let AI run Python code automatically.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "GenerativeAi/Sessions/GAiResponsesApiSession.h"

auto* Session = UGAiResponsesApiSession::CreateChatSession(
    EndpointConfig, this,
    TEXT("Use code interpreter to analyze data and perform calculations."),
    TEXT("Given damage values [12, 18, 9, 26], compute mean and max.")
);

// Add code interpreter tool
FResponsesApiCodeInterpreterTool CodeInterpreterTool;
Session->AddToolDefinition(MakeInstancedStruct(CodeInterpreterTool));

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        UE_LOG(LogTemp, Log, TEXT("AI: %s"), *Ctx->GetAggregatedResponseText());
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Common Patterns</h2>

                    <Example>
                        <ExampleTitle>Statistical Analysis</ExampleTitle>
                        <ExampleContent>
                            Process game balance data and compute statistics.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->SetSystemMessage(TEXT(
    "You're a game balance analyst. Use code interpreter for calculations."
));

Session->AddUserMessage(TEXT(
    "Analyze player damage: [45, 52, 38, 61, 48, 55, 42, 59, 50, 53]\\n"
    "Compute mean, median, std dev, and check for outliers."
));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>XP Curve Modeling</ExampleTitle>
                        <ExampleContent>
                            Generate progression curves with custom formulas.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->AddUserMessage(TEXT(
    "Generate XP curve for levels 1-50 using: XP = 100 * level^1.5. "
    "Show first 10 levels and total XP to max level."
));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Drop Rate Simulation</ExampleTitle>
                        <ExampleContent>
                            Run Monte Carlo simulations for loot probabilities.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->AddUserMessage(TEXT(
    "Simulate 10,000 loot drops:\\n"
    "- Common: 70%\\n"
    "- Rare: 25%\\n"
    "- Legendary: 5%\\n"
    "Report distribution and expected legendaries in 100 drops."
));`}
                        </ExampleCpp>
                    </Example>

                    <h2>Accessing Code and Outputs</h2>

                    <Example>
                        <ExampleTitle>Retrieve Execution Details</ExampleTitle>
                        <ExampleContent>
                            Access the Python code executed and its output logs.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Request.Include.Add(EResponsesApiIncludableOutputData::CodeInterpreterCallOutputs);

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        auto* ResponsesSession = Cast<UGAiResponsesApiSession>(Ctx);
        if (!ResponsesSession) return;

        for (const auto& Item : ResponsesSession->Response.OutputItems)
        {
            if (Item.GetType() == EResponsesApiResponseItemType::CodeInterpreterCall)
            {
                auto* CodeCall = Item.TryGet<FResponsesApiCodeInterpreterToolCall>();
                if (CodeCall)
                {
                    FString Code = CodeCall->Code.Get(TEXT(""));
                    UE_LOG(LogTemp, Log, TEXT("Executed:\\n%s"), *Code);
                    
                    for (const auto& Output : CodeCall->Outputs)
                    {
                        if (Output.Type == TEXT("logs"))
                        {
                            FString Logs = Output.Logs.Get(TEXT(""));
                            UE_LOG(LogTemp, Log, TEXT("Output: %s"), *Logs);
                        }
                        else if (Output.Type == TEXT("image"))
                        {
                            FString ImageUrl = Output.Url.Get(TEXT(""));
                            UE_LOG(LogTemp, Log, TEXT("Image: %s"), *ImageUrl);
                        }
                    }
                }
            }
        }
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <PageFooter />
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}