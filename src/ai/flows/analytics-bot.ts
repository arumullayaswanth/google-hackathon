'use server';
/**
 * @fileOverview This file defines a Genkit flow for an AI analytics bot.
 *
 * - askAnalyticsBot - A function that handles answering questions about analytics data.
 * - AnalyticsBotInput - The input type for the askAnalyticsBot function.
 * - AnalyticsBotOutput - The return type for the askAnalyticsBot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { AnalyticsData } from '@/types';

const AnalyticsBotInputSchema = z.object({
  question: z.string().describe('The user\'s question about the analytics data.'),
  analyticsData: z.any().describe('The analytics data as a JSON object.'),
});
export type AnalyticsBotInput = z.infer<typeof AnalyticsBotInputSchema>;

const AnalyticsBotOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the question.'),
});
export type AnalyticsBotOutput = z.infer<typeof AnalyticsBotOutputSchema>;

export async function askAnalyticsBot(input: AnalyticsBotInput): Promise<AnalyticsBotOutput> {
  return analyticsBotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyticsBotPrompt',
  input: {schema: AnalyticsBotInputSchema},
  output: {schema: AnalyticsBotOutputSchema},
  prompt: `You are an AI assistant for a community Q&A platform. Your primary role is to answer questions based on the provided analytics data, but you can also answer general knowledge questions.

  Here is the analytics data for the platform, in JSON format. Use this data to answer questions about platform usage, popular topics, user activity, etc.
  \`\`\`json
  {{{json analyticsData}}}
  \`\`\`

  Here is the user's question:
  "{{{question}}}"

  Please provide a clear and concise answer. If the question is about the platform's analytics, base your answer *only* on the data provided. If the question is general, answer it to the best of your ability. If you cannot answer a question, say so.`,
});

const analyticsBotFlow = ai.defineFlow(
  {
    name: 'analyticsBotFlow',
    inputSchema: AnalyticsBotInputSchema,
    outputSchema: AnalyticsBotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
