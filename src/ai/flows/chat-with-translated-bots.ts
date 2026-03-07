'use server';
/**
 * @fileOverview This file implements the Genkit flow for the BhashaBridge chat mediation.
 * It handles processing user messages through a cultural lens, generating bot replies
 * with full cultural analysis, and translating everything back in a single efficient call.
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

/**
 * Combined prompt to handle translation, persona-based reply, and cultural analysis in one go.
 * This significantly reduces API quota usage (prevents 429 errors).
 */
const culturalMediatorPrompt = ai.definePrompt({
  name: 'culturalMediatorPrompt',
  input: {
    schema: ChatWithTranslatedBotsInputSchema,
  },
  output: {
    schema: ChatWithTranslatedBotsOutputSchema,
  },
  prompt: `You are BhashaBridge, a highly sophisticated Cultural Intelligence Mediator.
Your task is to facilitate a deep, culturally aware conversation between a user and a specific bot character.

CONTEXT:
- User Language: {{{userLanguage}}}
- Bot Character: {{{botName}}}
- Bot Country: {{{botCountry}}}
- Bot Language: {{{botLanguage}}}
- Bot Personality: {{{botPersonality}}}

USER MESSAGE (in {{{userLanguage}}}):
'{{{userMessage}}}'

YOUR MISSION:
1. Act as {{{botName}}}. Understand the user's message (internally translating it if necessary).
2. Generate a response in {{{botLanguage}}} that fits the character's persona perfectly. Keep it 1-3 sentences.
3. Analyze that response for the {{{userLanguage}}} speaker, identifying cultural gaps, nuances, or potential misunderstandings.
4. Translate your response back to {{{userLanguage}}} naturally (focus on meaning, not just words).

RETURN ONLY VALID JSON:
{
  "botReplyOriginal": "your response in {{{botLanguage}}}",
  "translatedText": "the natural translation into {{{userLanguage}}}",
  "tone": "formal/casual/friendly/aggressive/sarcastic/apologetic/enthusiastic/neutral",
  "nuanceDetected": true or false,
  "nuanceType": "sarcasm/idiom/implied_meaning/politeness_level/cultural_reference/humor or null",
  "nuanceExplanation": "plain English explanation of the nuance or null",
  "sensitivityAlert": true or false,
  "sensitivityReason": "why the user might misinterpret this based on their culture or null",
  "culturalTip": "one helpful tip for the user or null",
  "adaptedMessage": "a version of the message adapted for the user's cultural context or null"
}

CHARACTER GUIDES:
- Lukas (German): Direct, professional, values efficiency over small talk.
- Yuki (Japanese): Highly polite, values harmony, uses indirect language (e.g., 'It is difficult' often means 'No').
- Emma (British): Uses understatement and sarcasm as a form of friendliness or politeness.`,
});

// Main Genkit flow - Now optimized to use a single prompt call
const chatWithTranslatedBotsFlow = ai.defineFlow(
  {
    name: 'chatWithTranslatedBotsFlow',
    inputSchema: ChatWithTranslatedBotsInputSchema,
    outputSchema: ChatWithTranslatedBotsOutputSchema,
  },
  async (input) => {
    const { output } = await culturalMediatorPrompt(input);

    if (!output) {
      throw new Error('The cultural intelligence engine failed to generate a response. Please try again.');
    }

    return output;
  }
);

// Wrapper function for the flow
export async function chatWithTranslatedBots(
  input: ChatWithTranslatedBotsInput
): Promise<ChatWithTranslatedBotsOutput> {
  return chatWithTranslatedBotsFlow(input);
}
