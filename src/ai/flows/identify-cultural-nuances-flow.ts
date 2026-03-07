'use server';
/**
 * @fileOverview This file defines a Genkit flow for identifying cultural nuances
 * in bot messages and generating a culturally intelligent reply.
 *
 * - identifyCulturalNuances - A function that handles the cultural nuance analysis and bot reply generation.
 * - IdentifyCulturalNuancesInput - The input type for the identifyCulturalNuances function.
 * - IdentifyCulturalNuancesOutput - The return type for the identifyCulturalNuances function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BotPersonalitySchema = z.enum([
  'Professional, formal, precise',
  'Polite, indirect, uses honorifics',
  'Friendly, uses British idioms and sarcasm occasionally',
]);

const ToneSchema = z.enum([
  'formal',
  'casual',
  'friendly',
  'aggressive',
  'sarcastic',
  'apologetic',
  'enthusiastic',
  'neutral',
]);

const NuanceTypeSchema = z
  .enum([
    'sarcasm',
    'idiom',
    'implied_meaning',
    'politeness_level',
    'cultural_reference',
    'humor',
  ])
  .nullable();

const IdentifyCulturalNuancesInputSchema = z.object({
  translatedMessage: z.string().describe('The user\'s message translated to the bot\'s native language.'),
  userMessage: z.string().describe('The user\'s original message.'),
  userLanguage: z.string().describe('The native language of the user (e.g., Hindi).'),
  botName: z.string().describe('The name of the bot character (e.g., Lukas Mueller).'),
  botLanguage: z.string().describe('The native language of the bot (e.g., German).'),
  botPersonality: BotPersonalitySchema.describe(
    'The personality description of the bot (e.g., Professional, formal, precise).'
  ),
  botCountry: z.string().describe('The country of the bot (e.g., Germany).'),
});
export type IdentifyCulturalNuancesInput = z.infer<typeof IdentifyCulturalNuancesInputSchema>;

const IdentifyCulturalNuancesOutputSchema = z.object({
  bot_reply_original: z.string().describe('The bot\'s reply in its native language.'),
  translated_text: z
    .string()
    .describe('The bot\'s reply translated naturally into the user\'s native language.'),
  tone: ToneSchema.describe('The tone of the bot\'s reply.'),
  nuance_detected: z.boolean().describe('True if a cultural nuance is detected, false otherwise.'),
  nuance_type: NuanceTypeSchema.describe('The type of nuance detected (e.g., sarcasm, idiom) or null.'),
  nuance_explanation: z
    .string()
    .nullable()
    .describe('Explanation of the nuance in simple English or null.'),
  sensitivity_alert: z.boolean().describe('True if the message could be misunderstood, false otherwise.'),
  sensitivity_reason: z
    .string()
    .nullable()
    .describe('Reason why the message could be misunderstood or null.'),
  cultural_tip: z.string().nullable().describe('One actionable cross-cultural tip or null.'),
  adapted_message: z
    .string()
    .nullable()
    .describe('Culturally adapted alternative message if needed or null.'),
});
export type IdentifyCulturalNuancesOutput = z.infer<typeof IdentifyCulturalNuancesOutputSchema>;

const culturalAnalysisPrompt = ai.definePrompt({
  name: 'culturalAnalysisPrompt',
  input: {schema: IdentifyCulturalNuancesInputSchema},
  output: {schema: IdentifyCulturalNuancesOutputSchema},
  prompt: `You are {{{botName}}}, a {{{botPersonality}}} person from {{{botCountry}}} who speaks {{{botLanguage}}}.
You received this message (translated): '{{{translatedMessage}}}'
Original was in {{{userLanguage}}}: '{{{userMessage}}}'

Reply naturally as {{{botName}}} would — in {{{botLanguage}}}. Keep reply to 1-3 sentences.

Then analyze your reply for the {{{userLanguage}}} speaker.
Return ONLY valid JSON:
{
  bot_reply_original: your reply in [BOT_LANGUAGE],
  translated_text: translate reply to [USER_LANGUAGE]
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
- Lukas (German): Very direct, no small talk, formal titles matter
- Yuki (Japanese): Indirect refusal, silence means disagreement, very polite
- Emma (British): 'Quite good' means mediocre, sarcasm is common humor, understatement`,
});

const identifyCulturalNuancesFlow = ai.defineFlow(
  {
    name: 'identifyCulturalNuancesFlow',
    inputSchema: IdentifyCulturalNuancesInputSchema,
    outputSchema: IdentifyCulturalNuancesOutputSchema,
  },
  async input => {
    const {output} = await culturalAnalysisPrompt(input);
    if (!output) {
      throw new Error('Failed to get cultural analysis output from the model.');
    }
    return output;
  }
);

export async function identifyCulturalNuances(
  input: IdentifyCulturalNuancesInput
): Promise<IdentifyCulturalNuancesOutput> {
  return identifyCulturalNuancesFlow(input);
}
