'use server';
/**
 * @fileOverview This flow handles generating a bot's reply, translating it, and performing cultural analysis.
 *
 * - receiveCulturalGuidance - A function that orchestrates the bot's reply generation and cultural analysis.
 * - ReceiveCulturalGuidanceInput - The input type for the receiveCulturalGuidance function.
 * - ReceiveCulturalGuidanceOutput - The return type for the receiveCulturalGuidance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ReceiveCulturalGuidanceInputSchema = z.object({
  botName: z.string().describe("The bot character's name (e.g., 'Lukas Mueller')."),
  botLanguage: z.string().describe("The bot's native language (e.g., 'German')."),
  botPersonality: z.string().describe("A description of the bot's personality (e.g., 'Professional, formal, precise')."),
  botCountry: z.string().describe("The bot's country of origin (e.g., 'Germany')."),
  translatedMessage: z.string().describe("The user's message, translated into the bot's native language."),
  userLanguage: z.string().describe("The user's native language (e.g., 'Hindi')."),
  userMessage: z.string().describe("The user's original message in their native language."),
});
export type ReceiveCulturalGuidanceInput = z.infer<typeof ReceiveCulturalGuidanceInputSchema>;

const ReceiveCulturalGuidanceOutputSchema = z.object({
  bot_reply_original: z.string().describe("The bot's reply in its native language."),
  translated_text: z.string().describe("The bot's reply, translated into the user's native language naturally."),
  tone: z
    .enum([
      'formal',
      'casual',
      'friendly',
      'aggressive',
      'sarcastic',
      'apologetic',
      'enthusiastic',
      'neutral',
    ])
    .describe("The detected tone of the bot's original reply."),
  nuance_detected: z.boolean().describe('Whether a cultural nuance was detected in the bot\'s reply.'),
  nuance_type: z
    .enum([
      'sarcasm',
      'idiom',
      'implied_meaning',
      'politeness_level',
      'cultural_reference',
      'humor',
    ])
    .nullable()
    .describe('The type of nuance detected, or null if none.'),
  nuance_explanation: z.string().nullable().describe('An explanation of the detected nuance in simple English, or null.'),
  sensitivity_alert: z.boolean().describe('Whether a sensitivity alert was triggered by the bot\'s reply.'),
  sensitivity_reason: z.string().nullable().describe('The reason for the sensitivity alert, or null.'),
  cultural_tip: z.string().nullable().describe('One actionable cross-cultural tip related to the message, or null.'),
  adapted_message: z.string().nullable().describe('A culturally adapted alternative message if needed, or null.'),
});
export type ReceiveCulturalGuidanceOutput = z.infer<typeof ReceiveCulturalGuidanceOutputSchema>;

export async function receiveCulturalGuidance(input: ReceiveCulturalGuidanceInput): Promise<ReceiveCulturalGuidanceOutput> {
  return receiveCulturalGuidanceFlow(input);
}

const receiveCulturalGuidancePrompt = ai.definePrompt({
  name: 'receiveCulturalGuidancePrompt',
  input: { schema: ReceiveCulturalGuidanceInputSchema },
  output: { schema: ReceiveCulturalGuidanceOutputSchema },
  prompt: `You are {{{botName}}}, a {{{botPersonality}}} person from {{{botCountry}}} who speaks {{{botLanguage}}}.
You received this message (translated): '{{{translatedMessage}}}'
Original was in {{{userLanguage}}}: '{{{userMessage}}}'

Reply naturally as {{{botName}}} would — in {{{botLanguage}}}. Keep reply to 1-3 sentences.

Then analyze your reply for the {{{userLanguage}}} speaker.
Return ONLY valid JSON:
{
  bot_reply_original: your reply in {{{botLanguage}}},
  translated_text: translate reply to {{{userLanguage}}}
                   naturally — meaning by meaning,
  tone: formal/casual/friendly/aggressive/sarcastic/
        apologetic/enthusiastic/neutral,
  nuance_detected: true or false,
  nuance_type: sarcasm/idiom/implied_meaning/
               politeness_level/cultural_reference/
               humor or null,
  nuance_explanation: explain in simple English
                      what nuance exists and why
                      it matters or null,
  sensitivity_alert: true or false,
  sensitivity_reason: why this could be
                      misunderstood or null,
  cultural_tip: one actionable cross-cultural
                tip or null,
  adapted_message: culturally adapted alternative
                   if needed or null
}

Examples to detect:
- Lukas (German): Very direct, no small talk,
  formal titles matter
- Yuki (Japanese): Indirect refusal, silence means
  disagreement, very polite
- Emma (British): 'Quite good' means mediocre,
  sarcasm is common humor, understatement`,
});

const receiveCulturalGuidanceFlow = ai.defineFlow(
  {
    name: 'receiveCulturalGuidanceFlow',
    inputSchema: ReceiveCulturalGuidanceInputSchema,
    outputSchema: ReceiveCulturalGuidanceOutputSchema,
  },
  async (input) => {
    const { output } = await receiveCulturalGuidancePrompt(input);
    return output!;
  },
);
