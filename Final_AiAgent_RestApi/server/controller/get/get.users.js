import  redisClient  from '../../config/redis_connect.js';
import { runAgent } from '../../Ai_Config/MCP_Client/client.js';

export const get_user = async (req, res) => {

    try {

        const { question } = req.query;

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Question query parameter is required."
            });
        }

        const normalizedQuestion =
            question.trim().toLowerCase();

        const aiKey =
            `ai:question:${normalizedQuestion}`;

        const cachedAnswer =
            await redisClient.get(aiKey);

        if (cachedAnswer) {

            console.log(`[AI CACHE HIT] ${aiKey}`);

            return res.status(200).json({
                success: true,
                answer: JSON.parse(cachedAnswer),
                source: "redis"
            });
        }

        console.log(`[AI CACHE MISS] ${aiKey}`);

        const aiResponse =
            await runAgent(question);

        await redisClient.setEx(
            aiKey,
            50,
            JSON.stringify(aiResponse)
        );

        return res.status(200).json({
            success: true,
            answer: aiResponse,
            source: "ai"
        });

    } catch (error) {

        console.error("[/home ERROR]", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};