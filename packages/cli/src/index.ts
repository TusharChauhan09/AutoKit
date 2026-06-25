import { Command } from "commander";
import { sendTelegramMessage } from "autokit-core";

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

    try {
      const result = await sendTelegramMessage({
        botToken: token,
        chatId,
        message,
      });

      console.log(JSON.stringify(result));
    } catch (error) {
      console.error("Failed to send Telegram message.", error);
      process.exit(1);
    }
  });

program.parseAsync(process.argv);
