import { z } from "zod";

// user -> platform
export const telegramMessageInputSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  message: z.string().min(1, "Message is required"),
});

export const telegramMessageOptionsSchema = telegramMessageInputSchema.extend({
  botToken: z.string().min(1, "Telegram bot token is required"), // env : TELEGRAM_BOT_TOKEN
});

// platform -> telegram 
export const telegramSendMessageRequestSchema = z.object({
  chat_id: z.string().min(1),
  text: z.string().min(1),
});

// telegram -> platform 
export const telegramSendMessageResponseSchema = z.object({
  ok: z.boolean(),
  result: z
    .object({
      message_id: z.number(),
    })
    .optional(),
  description: z.string().optional(),
});

// platform -> user
export const telegramMessageOutputSchema = z.object({
  ok: z.literal(true),
  chatId: z.string(),
  messageId: z.number(),
});

// export all the types that between the user and the platform
export type TelegramMessageInput = z.infer<typeof telegramMessageInputSchema>;
export type TelegramMessageOptions = z.infer<typeof telegramMessageOptionsSchema>;
export type TelegramMessageOutput = z.infer<typeof telegramMessageOutputSchema>;