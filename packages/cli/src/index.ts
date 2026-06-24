import { Command } from "commander";

type TelegramResponse = {
  ok: boolean;
  result?: {
    message_id?: number;
  };
  description?: string;
};

const program = new Command();

program.name("autokit").description("sendkit CLI");

program
  .command("telegram")
  .description("sends a Telegram message")
  .argument("<chatId>", "Telegram chat ID")
  .argument("<message>", "Message text to send")
  .action(async (chatId: string, message: string) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.error(
        "TELEGRAM_BOT_TOKEN is not set in the environment variables.",
      );
      process.exit(1);
    }
    if (!chatId || !message) {
      console.error("Both chatId and message are required.");
      process.exit(1);
    }

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      },
    );

    const data = await response.json() as TelegramResponse;
    if (!response.ok || !data.ok) {
        const detail = data.description ?? response.statusText;
      console.error(`Failed to send Telegram message: ${detail}`);
      process.exit(1);
    }

    const messageId = data.result?.message_id;
    if(messageId === undefined) {
        console.error("Failed to retrieve message ID from Telegram response.");
        process.exit(1);
    }
    console.log(`Telegram message sent successfully. Chat ID: ${chatId}`);
    console.log("Telegram message sent successfully. Message ID:", messageId);
  });

program.parseAsync(process.argv);
