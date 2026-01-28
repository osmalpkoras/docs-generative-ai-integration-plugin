import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Embeddings API',
    description: 'Create vector embeddings for semantic search and similarity',
    order: 103,
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

export default function EmbeddingsApiPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <p className="text-muted-foreground">
                        The Embeddings API converts text into high-dimensional vector representations,
                        enabling semantic search, similarity comparison, clustering, and recommendations.
                    </p>

                    <h2>Common Use Cases</h2>

                    <ul>
                        <li><strong>Semantic Search</strong>: Find relevant content based on meaning, not just keywords</li>
                        <li><strong>Similarity Detection</strong>: Compare dialogue options, detect duplicates</li>
                        <li><strong>Clustering</strong>: Group similar items, quests, or NPC dialogue</li>
                        <li><strong>Recommendations</strong>: Suggest items or quests based on player preferences</li>
                        <li><strong>RAG Systems</strong>: Retrieve relevant context for AI responses</li>
                    </ul>

                    <h2>Basic Usage</h2>

                    <Example>
                        <ExampleTitle>Embed a Single Text</ExampleTitle>
                        <ExampleContent>
                            The simplest way to create an embedding for a single string.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "GenerativeAi/GAiStaticFunctions.h"

UGAiStaticFunctions::CreateEmbedding(
    TEXT("Find the ancient sword in the forest"),
    EndpointConfig,
    TEXT("text-embedding-3-small"),
    FOnEmbeddingsComplete::CreateLambda([](const FEmbeddingsApiResponse& Response)
    {
        TArray<float> Embedding = Response.GetFirstEmbedding();
        UE_LOG(LogTemp, Log, TEXT("Embedding dimension: %d"), Embedding.Num());

        // Store embedding for later similarity comparison
    }),
    FOnEmbeddingsError::CreateLambda([](const FEmbeddingsApiError& Error)
    {
        UE_LOG(LogTemp, Error, TEXT("Embedding failed: %s"), *Error.Message);
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Embed Multiple Texts</ExampleTitle>
                        <ExampleContent>
                            More efficient than individual calls when processing multiple texts.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Embed multiple quest descriptions at once
TArray<FString> QuestDescriptions = {
    TEXT("Defeat the dragon"),
    TEXT("Find the lost artifact"),
    TEXT("Escort the merchant")
};

UGAiStaticFunctions::CreateEmbeddings(
    QuestDescriptions,
    EndpointConfig,
    TEXT("text-embedding-3-small"),
    FOnEmbeddingsComplete::CreateLambda([](const FEmbeddingsApiResponse& Response)
    {
        // Process each embedding
        for (const auto& EmbeddingData : Response.Data)
        {
            UE_LOG(LogTemp, Log, TEXT("Embedding %d: %d dimensions"),
                   EmbeddingData.Index, EmbeddingData.Embedding.Num());
        }
    }),
    FOnEmbeddingsError::CreateLambda([](const FEmbeddingsApiError& Error)
    {
        UE_LOG(LogTemp, Error, TEXT("Batch embedding failed: %s"), *Error.Message);
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Custom Dimensions</ExampleTitle>
                        <ExampleContent>
                            Reduce embedding dimensions for faster processing and lower memory usage (note: the model must support it).
                        </ExampleContent>
                        <ExampleCpp>
                            {`FEmbeddingsApiRequest Request;
Request.Input = {TEXT("Your text here")};
Request.Model = TEXT("text-embedding-3-small");
Request.Dimensions = 512;  // Reduce from default 1536
Request.User = TEXT("player_123");  // Optional: track usage

UGAiStaticFunctions::CreateEmbeddingsAdvanced(
    Request,
    EndpointConfig,
    FOnEmbeddingsComplete::CreateLambda([](const FEmbeddingsApiResponse& Response)
    {
        TArray<float> Embedding = Response.GetFirstEmbedding();
        UE_LOG(LogTemp, Log, TEXT("Reduced dimension: %d"), Embedding.Num());
        UE_LOG(LogTemp, Log, TEXT("Tokens used: %d"), Response.Usage.TotalTokens);
    }),
    FOnEmbeddingsError::CreateLambda([](const FEmbeddingsApiError& Error)
    {
        UE_LOG(LogTemp, Error, TEXT("Error: %s"), *Error.Message);
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Similarity Calculation</ExampleTitle>
                        <ExampleContent>
                            The plugin provides built-in similarity functions: Calculate similarity between embeddings to find related content.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Compare two quest embeddings
TArray<float> QuestEmbedding1 = /* ... */;
TArray<float> QuestEmbedding2 = /* ... */;

// Cosine similarity (recommended, range: -1 to 1)
float Similarity = UGAiStaticFunctions::CosineSimilarity(QuestEmbedding1, QuestEmbedding2);
if (Similarity > 0.8f)
{
    UE_LOG(LogTemp, Log, TEXT("Quests are very similar!"));
}

// Alternative metrics
float DotProd = UGAiStaticFunctions::DotProduct(QuestEmbedding1, QuestEmbedding2);
float Distance = UGAiStaticFunctions::EuclideanDistance(QuestEmbedding1, QuestEmbedding2);`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Working with Embeddings</ExampleTitle>
                        <ExampleContent>
                            Utility functions for extracting and processing embeddings from responses.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Extract embeddings from response
TArray<float> FirstEmbedding = UGAiStaticFunctions::GetFirstEmbedding(Response);
TArray<float> SecondEmbedding = UGAiStaticFunctions::GetEmbeddingAtIndex(Response, 1);
TArray<FEmbeddingsApiEmbeddingData> AllEmbeddings = UGAiStaticFunctions::GetAllEmbeddings(Response);

// Check dimension
int32 Dimension = UGAiStaticFunctions::GetEmbeddingDimension(FirstEmbedding);

// Normalize for better similarity comparison
TArray<float> NormalizedEmbedding = UGAiStaticFunctions::NormalizeEmbedding(FirstEmbedding);`}
                        </ExampleCpp>
                    </Example>

                    <h2>Best Practices</h2>

                    <ul>
                        <li><strong>Batch Processing</strong>: Use CreateEmbeddings for multiple texts to reduce API calls</li>
                        <li><strong>Caching</strong>: Store embeddings to avoid re-computing for static content</li>
                        <li><strong>Chunking</strong>: Split long texts into smaller chunks for better semantic granularity</li>
                    </ul>

                </LanguageToggleProvider>


                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
