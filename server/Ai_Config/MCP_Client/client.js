import axios from "axios";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import { fileURLToPath } from "node:url";





const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL_NAME = "qwen2.5:1.5b";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createMcpClient() {
  // If your server code is in a separate file (e.g., server.js in the same folder):
  const serverPath = path.resolve(__dirname, "../MPC_server/server.js");

  const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath]
  });

  const client = new Client({
    name: "ollama-agent-client",
    version: "1.0.0"
  });

  await client.connect(transport);
  return client;
}


export async function runAgent(userPrompt) {
  const mcpClient = await createMcpClient();

  try {
    // 1. Fetch available tools dynamically from MCP server
    const { tools: mcpTools } = await mcpClient.listTools();

    // 2. Format MCP tools into Ollama tool schema
    const formattedTools = mcpTools.map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema
      }
    }));

    const messages = [
      {
        role: "user",
        content: userPrompt
      }
    ];

    console.log(`\nUser: "${userPrompt}"`);

    // 3. First call to Ollama
    const firstResponse = await axios.post(OLLAMA_URL, {
      model: MODEL_NAME,
      messages: messages,
      tools: formattedTools,
      stream: false
    });

    const assistantMessage = firstResponse.data.message;
    messages.push(assistantMessage);

    // 4. Handle tool calls
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name;
        
        // Ensure arguments are parsed into an object
        let toolArgs = toolCall.function.arguments;
        if (typeof toolArgs === "string") {
          try {
            toolArgs = JSON.parse(toolArgs);
          } catch {
            toolArgs = {};
          }
        }

        console.log(`\n[Agent] Executing tool: "${toolName}" with args:`, toolArgs);

        // Execute via MCP Client
        const toolResult = await mcpClient.callTool({
          name: toolName,
          arguments: toolArgs
        });

        const outputText = toolResult.content
          ?.filter((item) => item.type === "text")
          .map((item) => item.text)
          .join("\n") || "No output returned.";

        console.log(`[MCP Server Result]: ${outputText}`);

        // Append tool result
        messages.push({
          role: "tool",
          name: toolName,
          content: outputText
        });
      }

      // 5. Final synthesis call
      const finalResponse = await axios.post(OLLAMA_URL, {
        model: MODEL_NAME,
        messages: messages,
        stream: false
      });

return finalResponse.data.message.content
      console.log(`\nAI Assistant: ${finalResponse.data.message.content}`);
    } else {

      return assistantMessage.content
      console.log(`\nAI Assistant: ${assistantMessage.content}`);
    }
  } finally {
    await mcpClient.close();
  }
}

// Run query
runAgent("what is xxx email").catch(console.error);