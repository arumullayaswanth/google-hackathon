
'use server';
/**
 * @fileOverview This file defines a Genkit flow to automatically suggest an AI-generated answer to a question.
 *
 * - suggestAnswer - A function that handles the AI-generated answer suggestion process.
 * - SuggestAnswerInput - The input type for the suggestAnswer function.
 * - SuggestAnswerOutput - The return type for the suggestAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAnswerInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
});
export type SuggestAnswerInput = z.infer<typeof SuggestAnswerInputSchema>;

const SuggestAnswerOutputSchema = z.object({
  suggestedAnswer: z.string().describe('The AI-generated suggested answer.'),
});
export type SuggestAnswerOutput = z.infer<typeof SuggestAnswerOutputSchema>;

export async function suggestAnswer(input: SuggestAnswerInput): Promise<SuggestAnswerOutput> {
  return suggestAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAnswerPrompt',
  input: {schema: SuggestAnswerInputSchema},
  output: {schema: SuggestAnswerOutputSchema},
  prompt: `You are an AI assistant designed to provide helpful answers to user questions.

  Question: {{{question}}}

  Please provide a concise and informative answer to the question above. Your answer should be formatted in Markdown.`,
});

const suggestAnswerFlow = ai.defineFlow(
  {
    name: 'suggestAnswerFlow',
    inputSchema: SuggestAnswerInputSchema,
    outputSchema: SuggestAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
