'use server';
/**
 * @fileOverview This file implements the Genkit flow for the BhashaBridge chat mediation.
 * It handles translating user messages to bot language, generating bot replies with cultural analysis,
 * and translating bot replies back to the user's language.
 *
 * - chatWithTranslatedBots - The main function to interact with the chat mediation AI.
 * - ChatWithTranslatedBotsInput - The input type for the chatWithTranslatedBots function.
 * - ChatWithTranslatedBotsOutput - The return type for the chatWithTranslatedBots function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema for the chat mediation flow
const ChatWithTranslatedBotsInputSchema = z.object({
  userMessage: z.string().describe("The user's message in their native language (e.g., Hindi)."),
  userLanguage: z.string().describe("The user's native language (e.g., 'Hindi')."),
  botName: z.string().describe("The name of the bot character (e.g., 'Lukas Mueller')."),
  botLanguage: z.string().describe("The native language of the bot (e.g., 'German')."),
  botPersonality: z.string().describe("A description of the bot's personality (e.g., 'Professional, formal, precise')."),
  botCountry: z.string().describe("The country of the bot (e.g., 'Germany')."),
});
export type ChatWithTranslatedBotsInput = z.infer<typeof ChatWithTranslatedBotsInputSchema>;

// Output Schema for the chat mediation flow
const ChatWithTranslatedBotsOutputSchema = z.object({
  botReplyOriginal: z.string().describe("The bot's original reply in its native language."),
  translatedText: z.string().describe("The bot's reply translated to the user's native language."),
  tone: z.enum(['formal', 'casual', 'friendly', 'aggressive', 'sarcastic', 'apologetic', 'enthusiastic', 'neutral'])
    .describe("The detected tone of the bot's reply."),
  nuanceDetected: z.boolean().describe("True if a cultural nuance was detected in the bot's reply."),
  nuanceType: z.enum(['sarcasm', 'idiom', 'implied_meaning', 'politeness_level', 'cultural_reference', 'humor', 'null']).nullable()
    .describe("The type of nuance detected, or null if none."),
  nuanceExplanation: z.string().nullable().describe("An explanation of the detected nuance, or null if none."),
  sensitivityAlert: z.boolean().describe("True if the bot's reply might be sensitive or misunderstood."),
  sensitivityReason: z.string().nullable().describe("The reason for the sensitivity alert, or null if none."),
  culturalTip: z.string().nullable().describe("An actionable cross-cultural tip related to the message, or null if none."),
  adaptedMessage: z.string().nullable().describe("A culturally adapted alternative message, or null if not needed."),
});
export type ChatWithTranslatedBotsOutput = z.infer<typeof ChatWithTranslatedBotsOutputSchema>;

// Prompt 1: Translate user message for the bot and analyze its tone
const translateUserMessagePrompt = ai.definePrompt({
  name: 'translateUserMessagePrompt',
  input: {
    schema: z.object({
      userMessage: z.string(),
      userLanguage: z.string(),
      botLanguage: z.string(),
      botName: z.string(),
    }),
  },
  output: {
    schema: z.object({
      translated_text: z.string(),
      tone: z.enum(['formal', 'casual', 'friendly', 'aggressive', 'sarcastic', 'apologetic', 'enthusiastic', 'neutral']),
    }),
  },
  prompt: `You are BhashaBridge Cultural Mediator AI.\nUser ({{{userLanguage}}} speaker) sent this to {{{botName}}} ({{{botLanguage}}} speaker):\n'{{{userMessage}}}'\nReturn ONLY valid JSON:\n{\n  "translated_text": "translate to {{{botLanguage}}} naturally",\n  "tone": "formal/casual/friendly/aggressive/sarcastic/apologetic/enthusiastic/neutral"\n}`,
});

// Prompt 2: Bot generates reply and cultural analysis/translation back to user
const generateBotReplyPrompt = ai.definePrompt({
  name: 'generateBotReplyPrompt',
  input: {
    schema: z.object({
      botName: z.string(),
      botPersonality: z.string(),
      botCountry: z.string(),
      botLanguage: z.string(),
      translatedMessage: z.string(), // This is the user's message, translated for the bot
      userMessage: z.string(), // This is the user's original message in their language
      userLanguage: z.string(),
    }),
  },
  output: {
    schema: ChatWithTranslatedBotsOutputSchema, // The flow output schema directly matches this prompt's output
  },
  prompt: `You are {{{botName}}}, a {{{botPersonality}}} person from {{{botCountry}}} who speaks {{{botLanguage}}}.\nYou received this message (translated): '{{{translatedMessage}}}'\nOriginal was in {{{userLanguage}}}: '{{{userMessage}}}'\n\nReply naturally as {{{botName}}} would — in {{{botLanguage}}}. Keep reply to 1-3 sentences.\n\nThen analyze your reply for the {{{userLanguage}}} speaker.\nReturn ONLY valid JSON:\n{\n  "bot_reply_original": "your reply in {{{botLanguage}}}",\n  "translated_text": "translate reply to {{{userLanguage}}} naturally — meaning by meaning",\n  "tone": "formal/casual/friendly/aggressive/sarcastic/apologetic/enthusiastic/neutral",\n  "nuance_detected": "true or false",\n  "nuance_type": "sarcasm/idiom/implied_meaning/politeness_level/cultural_reference/humor or null",\n  "nuance_explanation": "explain in simple English what nuance exists and why it matters or null",\n  "sensitivity_alert": "true or false",\n  "sensitivity_reason": "why this could be misunderstood or null",\n  "cultural_tip": "one actionable cross-cultural tip or null",\n  "adapted_message": "culturally adapted alternative if needed or null"\n}\n\nExamples to detect:\n- Lukas (German): Very direct, no small talk, formal titles matter\n- Yuki (Japanese): Indirect refusal, silence means disagreement, very polite\n- Emma (British): 'Quite good' means mediocre, sarcasm is common humor, understatement`,
});

// Main Genkit flow
const chatWithTranslatedBotsFlow = ai.defineFlow(
  {
    name: 'chatWithTranslatedBotsFlow',
    inputSchema: ChatWithTranslatedBotsInputSchema,
    outputSchema: ChatWithTranslatedBotsOutputSchema,
  },
  async (input) => {
    // Call 1: Translate user message for the bot
    const { output: translatedUserMessageOutput } = await translateUserMessagePrompt({
      userMessage: input.userMessage,
      userLanguage: input.userLanguage,
      botLanguage: input.botLanguage,
      botName: input.botName,
    });

    if (!translatedUserMessageOutput) {
      throw new Error('Failed to translate user message.');
    }

    // Call 2: Bot generates reply and performs cultural analysis/translation
    const { output: botReplyOutput } = await generateBotReplyPrompt({
      botName: input.botName,
      botPersonality: input.botPersonality,
      botCountry: input.botCountry,
      botLanguage: input.botLanguage,
      translatedMessage: translatedUserMessageOutput.translated_text, // Use the translated text from the first call
      userMessage: input.userMessage, // Pass original user message for context
      userLanguage: input.userLanguage,
    });

    if (!botReplyOutput) {
      throw new Error('Failed to generate bot reply or cultural analysis.');
    }

    return botReplyOutput;
  }
);

// Wrapper function for the flow
export async function chatWithTranslatedBots(
  input: ChatWithTranslatedBotsInput
): Promise<ChatWithTranslatedBotsOutput> {
  return chatWithTranslatedBotsFlow(input);
}
