import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Streaming Responses',
    description: 'Real-time text generation with incremental content delivery',
    order: 4,
} satisfies ContentPage;

import { SiteDocumentation, PageContainer } from '@/components/layout';
import {
    LanguageToggleProvider,
    LanguageToggle,
    LanguageContent,
    Callout,
    CodeExample,
    ConsoleOutput,
    StepList,
    Step,
} from '@/components/doc-components';

export default function StreamingPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="font-bold m-0!">Streaming Responses</h1>
                        <LanguageToggle />
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        Streaming enables real-time text generation where content arrives incrementally as it is produced by the AI model.
                        Instead of waiting for the entire response, partial chunks are delivered immediately, improving perceived response time
                        and enabling live UI updates such as dialogue text reveal, console logs, or typewriter effects.
                    </p>

                    <h2>Streaming Architecture</h2>
                    <p>
                        Streaming responses use a callback-based architecture. The <code>FOnGenerationStreamChunk</code> delegate delivers
                        partial content during generation, while <code>FOnGenerationComplete</code> is invoked when the final response is ready.
                    </p>

                    <StepList>
                        <Step title="Streamed Generation">
                            <p>Configure the session and register a stream chunk callback to handle incremental content. The generation will switch to streaming automatically, when a streaming delegate is bound.</p>
                        </Step>
                        <Step title="Chunk Processing">
                            <p>Partial content arrives via <code>FOnGenerationStreamChunk</code>. Each chunk only contains new text since the last callback.</p>
                        </Step>
                        <Step title="Stream Completion">
                            <p><code>FOnGenerationComplete</code> signals the end of streaming and provides the full, final response for post-processing.</p>
                        </Step>
                    </StepList>

                    <h2>Accessing Streaming Data</h2>
                    <p>
                        Each streaming callback provides incremental text via <code>GetDeltaText()</code>, which returns only the new characters
                        generated in that chunk. For cumulative output, you typically append <code>GetDeltaText()</code> to a buffer, or access <code>GetResponseText()</code> on the completion callback's session context.
                    </p>
                    <Callout type="info" title="Important">
                        <p>
                            Tool calls and structured outputs are not streamed. These are delivered only once in the
                            <code>FOnGenerationComplete</code> callback, after generation finishes.
                        </p>
                    </Callout>

                    <LanguageContent language="cpp">
                        <CodeExample
                            title="Streaming Example"
                            description="Configuring a session for streaming and handling incremental output"
                            cppCode={`UGAiCompletionApiSession* UGAiCompletions_StreamingExample::Run(UGAiEndpointConfig* EndpointConfig, UObject* WorldContextObject)
{
    if (!ensureMsgf(EndpointConfig != nullptr, TEXT("EndpointConfig is required")))
    {
        return nullptr;
    }

    UGAiCompletionApiSession* Session = UGAiCompletionApiSession::CreateChatGenerationContext(
        EndpointConfig,
        WorldContextObject ? WorldContextObject : GetTransientPackage(),
        TEXT("You are a live narrator generating short lines for a mission intro."),
        TEXT("Describe the storm approaching the harbor in vivid, short phrases.")
    );

    Session->Generate(
        FOnGenerationComplete::CreateLambda([](const UGAiCompletionApiSession* /*Ctx*/)
        {
            UE_LOG(LogTemp, Log, TEXT("Streaming completed."));
        }),
        FOnGenerationStreamChunk::CreateLambda([](const UGAiCompletionApiSession* Ctx)
        {
            // Append the latest delta to your display buffer
            UE_LOG(LogTemp, VeryVerbose, TEXT("Stream chunk: %s"), *Ctx->GetDeltaText());
        }),
        FOnGenerationError::CreateLambda([](const UGAiCompletionApiSession* Ctx)
        {
            UE_LOG(LogTemp, Error, TEXT("Streaming error: %s"), *Ctx->GetErrorMessage());
        })
    );

    return Session;
}`}
                        />
                    </LanguageContent>

                    <h3>Example Output</h3>
                    <ConsoleOutput title="Chunk Sequence">
                        {`LogTemp: VeryVerbose: Stream chunk: The
LogTemp: VeryVerbose: Stream chunk:  storm
LogTemp: VeryVerbose: Stream chunk:  approaches
LogTemp: VeryVerbose: Stream chunk: ,
LogTemp: VeryVerbose: Stream chunk:  dark
LogTemp: VeryVerbose: Stream chunk:  clouds
LogTemp: VeryVerbose: Stream chunk:  gather
LogTemp: VeryVerbose: Stream chunk:  over
LogTemp: VeryVerbose: Stream chunk:  the
LogTemp: VeryVerbose: Stream chunk:  harbor
LogTemp: VeryVerbose: Stream chunk: .
LogTemp: VeryVerbose: Stream chunk:  Waves
LogTemp: VeryVerbose: Stream chunk:  crash
LogTemp: VeryVerbose: Stream chunk:  violently
LogTemp: VeryVerbose: Stream chunk:  against
LogTemp: VeryVerbose: Stream chunk:  the
LogTemp: VeryVerbose: Stream chunk:  pier
LogTemp: VeryVerbose: Stream chunk: .
LogTemp: Log: Streaming completed.`}
                    </ConsoleOutput>

                    <h2>Best Practices</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Buffering:</strong> Append <code>GetDeltaText()</code> results into a string to reconstruct the full response.</li>
                        <li><strong>UI Updates:</strong> Apply deltas immediately for “live typing” effects, but also keep a final buffer for consistency.</li>
                        <li><strong>Fallback:</strong> Always handle <code>FOnGenerationComplete</code> to finalize the full output even if chunks were missed.</li>
                        <li><strong>Error Handling:</strong> Use <code>FOnGenerationError</code> to gracefully handle timeouts, disconnects, or content filtering.</li>
                    </ul>

                    <h2>Error Handling in Streams</h2>
                    <p>
                        Streaming requests can fail mid-generation due to network interruptions, API rate limits, or model-side filtering.
                        Always implement <code>FOnGenerationError</code> to handle these scenarios and provide user feedback.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Network interruption:</strong> Connection dropped during stream delivery.</li>
                        <li><strong>Rate limiting:</strong> API throttled mid-stream due to usage limits.</li>
                        <li><strong>Content filtering:</strong> Generated content violated policy and was stopped.</li>
                        <li><strong>Model errors:</strong> Internal errors prevented completion of the stream.</li>
                    </ul>
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}
