// http://localhost:9000/ai?question=get%20information%20about%20Isobel?

import redisClient from "../../../Conifg/redis.connect/connect.js";
import { runAgent } from "../../../Ai_Config/MCP_Client/client.js";

export const aiagent = async (req, res) => {
  try {
    const { question } = req.query;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question query parameter is required.",
      });
    }

    const normalizedQuestion = question.trim().toLowerCase();

    const aiKey = `ai:question:${normalizedQuestion}`;

    // 1. Check Redis cache
    const cachedAnswer = await redisClient.get(aiKey);

    if (cachedAnswer) {
      console.log(`[AI CACHE HIT] ${aiKey}`);

      return res.status(200).json({
        success: true,
        answer: JSON.parse(cachedAnswer),
        source: "redis",
      });
    }

    console.log(`[AI CACHE MISS] ${aiKey}`);

    // 2. Run AI Agent
    const aiResponse = await runAgent(question);

    // 3. Store response in Redis for 50 seconds
    await redisClient.setex(
      aiKey,
      50,
      JSON.stringify(aiResponse)
    );

    // 4. Send response
    return res.status(200).json({
      success: true,
      answer: aiResponse,
      source: "ai",
    });

  } catch (error) {
    console.error("[/aiagent ERROR]", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};