import axios from "axios";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OLLAMA_URL = process.env.OLLAMA_URL;
const MODEL_NAME = process.env.OLLAMA_MODEL || "qwen2.5:1.5b";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createMcpClient() {
  const serverPath = path.resolve(
    __dirname,
    "../MPC_server/server.js"
  );

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
    env: {
      ...process.env
    }
  });

  const client = new Client({
    name: "ollama-agent-client",
    version: "1.0.0"
  });

  await client.connect(transport);

  return client;
}

export async function runAgent(userPrompt) {

  if (!OLLAMA_URL) {
    throw new Error("OLLAMA_URL is not configured");
  }

  const mcpClient = await createMcpClient();

  try {

    const { tools: mcpTools } =
      await mcpClient.listTools();

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
        role: "system",
        content:
          "You are a user database assistant. " +
          "When the user asks for information about a user, " +
          "use the available database tools. " +
          "Do not invent user information."
      },
      {
        role: "user",
        content: userPrompt
      }
    ];

    console.log(`User: "${userPrompt}"`);

    const firstResponse = await axios.post(
      OLLAMA_URL,
      {
        model: MODEL_NAME,
        messages,
        tools: formattedTools,
        stream: false
      },
      {
        timeout: 120000
      }
    );

    const assistantMessage =
      firstResponse.data.message;

    messages.push(assistantMessage);

    if (
      assistantMessage.tool_calls &&
      assistantMessage.tool_calls.length > 0
    ) {

      for (const toolCall of assistantMessage.tool_calls) {

        const toolName =
          toolCall.function.name;

        let toolArgs =
          toolCall.function.arguments;

        if (typeof toolArgs === "string") {
          toolArgs = JSON.parse(toolArgs);
        }

        console.log(
          `[Agent] Executing ${toolName}`,
          toolArgs
        );

        const toolResult =
          await mcpClient.callTool({
            name: toolName,
            arguments: toolArgs
          });

        const outputText =
          toolResult.content
            ?.filter(item => item.type === "text")
            .map(item => item.text)
            .join("\n") ||
          "No output returned.";

        messages.push({
          role: "tool",
          name: toolName,
          content: outputText
        });
      }

      const finalResponse =
        await axios.post(
          OLLAMA_URL,
          {
            model: MODEL_NAME,
            messages,
            stream: false
          },
          {
            timeout: 120000
          }
        );

      return finalResponse.data.message.content;
    }

    return assistantMessage.content;

  } finally {

    await mcpClient.close();

  }
}