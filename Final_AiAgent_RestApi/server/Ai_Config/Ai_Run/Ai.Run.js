

async function runAgent(userPrompt) {
  const mcpClient = await createMcpClient();

  // 1. Fetch available tools dynamically from the MCP server
  const { tools: mcpTools } = await mcpClient.listTools();

  // 2. Format MCP tools into the standard JSON schema expected by Ollama
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

  // 3. First call to Ollama with tool specifications
  const firstResponse = await axios.post('http://localhost:11434/api/chat', {
   model: "qwen2.5:1.5b",
    messages: messages,
    tools: formattedTools,
    stream: false
  });

  const assistantMessage = firstResponse.data.message;
  messages.push(assistantMessage);

  // 4. Handle tool execution if the model requests it
  if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
    for (const toolCall of assistantMessage.tool_calls) {
      const toolName = toolCall.function.name;
      const toolArgs = toolCall.function.arguments;

      console.log(`\n[Agent] Model triggered tool: "${toolName}" with args:`, toolArgs);

      // Execute the tool call via MCP Client
      const toolResult = await mcpClient.callTool({
        name: toolName,
        arguments: toolArgs
      });

      const outputText = toolResult.content
        .filter((item) => item.type === "text")
        .map((item) => item.text)
        .join("\n");

      console.log(`[MCP Server Result]: ${outputText}`);

      // Push the tool result back into the chat history
      messages.push({
        role: "tool",
        content: outputText
      });
    }

    // 5. Final call to Ollama to synthesize the answer
    const finalResponse = await axios.post("http://localhost:11434/api/chat", {
        model: "qwen2.5:1.5b",
      messages: messages,
      stream: false
    });

    console.log(`\nAI Assistant: ${finalResponse.data.message.content}`);
  } else {
    // Model answered directly without invoking any tools
    console.log(`\nAI Assistant: ${assistantMessage.content}`);
  }

  await mcpClient.close();
}

// Run the query
runAgent("what is xxx email").catch(console.error);