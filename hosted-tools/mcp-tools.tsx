import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'MCP Tools',
    description: 'Use Model Context Protocol servers to extend AI capabilities',
    order: 5,
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

export default function McpToolsPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <LanguageToggleProvider>
                    <PageHeader />

                    <p>
                        Model Context Protocol (MCP) allows AI to connect to external servers that provide tools, resources,
                        and prompts. MCP servers can access databases, APIs, file systems, and other services to extend
                        AI capabilities beyond hosted tools.
                    </p>

                    <h2>What is MCP?</h2>

                    <p>
                        MCP is an open standard that enables secure connections between AI models and external data sources.
                        Think of it as a plugin system for AI - servers can provide specialized functionality that the AI
                        can discover and use automatically.
                    </p>

                    <ul>
                        <li><strong>Tools</strong> - Functions the AI can call (e.g., database queries, API requests)</li>
                        <li><strong>Resources</strong> - Data the AI can access (e.g., files, documents)</li>
                        <li><strong>Prompts</strong> - Pre-defined prompt templates</li>
                    </ul>

                    <h2>Basic Usage</h2>

                    <Example>
                        <ExampleTitle>Connect to MCP Server</ExampleTitle>
                        <ExampleContent>
                            Add MCP tools by specifying the server configuration. The plugin discovers available tools
                            automatically.
                        </ExampleContent>
                        <ExampleCpp>
                            {`#include "GenerativeAi/Sessions/GAiResponsesApiSession.h"

auto* Session = UGAiResponsesApiSession::CreateChatSession(
    EndpointConfig, this,
    TEXT("You have access to MCP tools for extended functionality."),
    TEXT("Query the database for player statistics")
);

// Add MCP tools
FResponsesApiMcpTool McpTool;
McpTool.ServerName = TEXT("database-server");
McpTool.ServerUrl = TEXT("http://localhost:3000/mcp");
Session->Request.Tools.Add(MakeInstancedStruct(McpTool));

Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        UE_LOG(LogTemp, Log, TEXT("AI: %s"), *Ctx->GetAggregatedResponseText());
    })
);`}
                        </ExampleCpp>
                    </Example>

                    <Callout type="info" title="Automatic Tool Discovery">
                        <p>
                            When you connect to an MCP server, the plugin automatically discovers and registers all
                            available tools. The AI can then use these tools as needed.
                        </p>
                    </Callout>

                    <h2>MCP Server Configuration</h2>

                    <Example>
                        <ExampleTitle>Configure MCP Server</ExampleTitle>
                        <ExampleContent>
                            Specify server details including transport method and authentication.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiMcpTool McpTool;

// Server identification
McpTool.ServerName = TEXT("my-mcp-server");
McpTool.ServerUrl = TEXT("http://localhost:3000/mcp");

// Transport: HTTP, stdio, or SSE (Server-Sent Events)
McpTool.Transport = TEXT("http");

// Optional authentication
McpTool.ApiKey = TEXT("your-api-key");

Session->Request.Tools.Add(MakeInstancedStruct(McpTool));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>Filter Available Tools</ExampleTitle>
                        <ExampleContent>
                            Optionally limit which tools from the server are made available to the AI.
                        </ExampleContent>
                        <ExampleCpp>
                            {`FResponsesApiMcpTool McpTool;
McpTool.ServerName = TEXT("database-server");
McpTool.ServerUrl = TEXT("http://localhost:3000/mcp");

// Only expose specific tools
McpTool.AllowedTools.Add(TEXT("query_players"));
McpTool.AllowedTools.Add(TEXT("get_leaderboard"));

Session->Request.Tools.Add(MakeInstancedStruct(McpTool));`}
                        </ExampleCpp>
                    </Example>

                    <h2>Common Use Cases</h2>

                    <Example>
                        <ExampleTitle>Database Integration</ExampleTitle>
                        <ExampleContent>
                            Connect to a database MCP server for querying game data.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// Database MCP server provides tools like:
// - query_database(sql: string)
// - get_table_schema(table_name: string)
// - execute_stored_procedure(name: string, params: object)

FResponsesApiMcpTool DbServer;
DbServer.ServerName = TEXT("game-database");
DbServer.ServerUrl = TEXT("http://localhost:3000/db-mcp");

Session->SetSystemMessage(TEXT(
    "You can query the game database. Use SQL queries to fetch player stats, "
    "achievements, and inventory data."
));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>File System Access</ExampleTitle>
                        <ExampleContent>
                            Use an MCP file system server to read and write files.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// File system MCP server provides tools like:
// - read_file(path: string)
// - write_file(path: string, content: string)
// - list_directory(path: string)

FResponsesApiMcpTool FileServer;
FileServer.ServerName = TEXT("file-system");
FileServer.ServerUrl = TEXT("http://localhost:3000/fs-mcp");

// Restrict to safe directories
FileServer.AllowedTools.Add(TEXT("read_file"));
FileServer.AllowedTools.Add(TEXT("list_directory"));

Session->SetSystemMessage(TEXT(
    "You can read files from the /GameData directory. "
    "Do not write or delete files."
));`}
                        </ExampleCpp>
                    </Example>

                    <Example>
                        <ExampleTitle>API Integration</ExampleTitle>
                        <ExampleContent>
                            Connect to external APIs through an MCP proxy server.
                        </ExampleContent>
                        <ExampleCpp>
                            {`// API MCP server provides tools like:
// - call_rest_api(endpoint: string, method: string, body: object)
// - get_weather(location: string)
// - search_wiki(query: string)

FResponsesApiMcpTool ApiServer;
ApiServer.ServerName = TEXT("api-proxy");
ApiServer.ServerUrl = TEXT("http://localhost:3000/api-mcp");
ApiServer.ApiKey = TEXT("your-proxy-api-key");

Session->SetSystemMessage(TEXT(
    "You can call external APIs through the MCP server. "
    "Fetch real-time data as needed."
));`}
                        </ExampleCpp>
                    </Example>

                    <h2>Accessing MCP Tool Results</h2>

                    <Example>
                        <ExampleTitle>Retrieve Tool Call Results</ExampleTitle>
                        <ExampleContent>
                            Access the results of MCP tool calls from response items.
                        </ExampleContent>
                        <ExampleCpp>
                            {`Session->Generate(
    FOnGenerationComplete::CreateLambda([](const UGAiSession* Ctx)
    {
        auto* ResponsesSession = Cast<UGAiResponsesApiSession>(Ctx);
        if (!ResponsesSession) return;

        for (const auto& Item : ResponsesSession->Response.OutputItems)
        {
            if (Item.GetType() == EResponsesApiResponseItemType::McpToolCall)
            {
                auto* McpCall = Item.TryGet<FResponsesApiMcpToolCall>();
                if (McpCall)
                {
                    FString ToolName = McpCall->ToolName.Get(TEXT(""));
                    FString Result = McpCall->Result.Get(TEXT(""));
                    
                    UE_LOG(LogTemp, Log, TEXT("MCP Tool: %s"), *ToolName);
                    UE_LOG(LogTemp, Log, TEXT("Result: %s"), *Result);
                }
            }
        }
    })
);`}
                        </ExampleCpp>
                    </Example>
                    <Callout type="info" title="Emerging Standard">
                        <p>
                            MCP is an open standard gaining adoption across AI providers. Support and features
                            may vary by provider. Check your provider's documentation for specific capabilities.
                        </p>
                    </Callout>

                    <PageFooter />
                </LanguageToggleProvider>
            </PageContainer>
        </SiteDocumentation>
    );
}
