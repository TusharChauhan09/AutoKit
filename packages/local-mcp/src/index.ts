import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import { telegramMessageInputSchema , sendTelegramMessage } from 'autokit-core';
import { send } from "node:process";

const server = new McpServer({
    name: "autokit-local",
    version: "0.0.0",
});

function getTelegramBotToken() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if(!token){
        throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");
    }
    return token;
};

server.registerTool(
    "telegram",
  {
    title: "Telegram",
    description: "Send a Telegram message.",
    inputSchema: telegramMessageInputSchema.shape,
  },
  async (input) => {
    const result = await sendTelegramMessage({
      ...input,
      botToken: getTelegramBotToken(),
    });

    return {
        content: [
            {
                type: "text",
                text: `Message sent successfully! Message ID: ${result.messageId} with chat ID: ${result.chatId}`,
            },
        ],
        structuredContent: result,
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);