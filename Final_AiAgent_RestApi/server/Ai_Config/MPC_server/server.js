import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {connectMongo}  from "../../db/conne.js";
import { User } from "../../model/student.js";

const server = new McpServer({
  name: "user-database-server",
  version: "1.0.0"
});

await connectMongo();

server.tool(
  "finduser",
  "Search users by name from MongoDB get fun information about name ",
  {
    name: z.string().describe("The full or partial name of the user to search for")
  },
  async ({ name }) => {
    console.error(`[MCP TOOL] finduser("${name}")`);

    try {
      const nameRegex = new RegExp(name, "i");
      const users = await User.find({ name: nameRegex }).lean();

      if (users.length === 0) {
        return {
          content: [{ type: "text", text: "No matching users found." }]
        };
      }

      const result = users.map((user) => ({
        name: user.name,
        age: user.age,
        email: user.email,
        country: user.country,
        bloodGroup: user.bloodGroup,
        hobbies: user.hobbies,
        bio: user.bio
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(result) }]
      };
    } catch (error) {
      console.error("[MCP TOOL ERROR]", error);
      return {
        content: [{ type: "text", text: `Database error: ${error.message}` }],
        isError: true
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);