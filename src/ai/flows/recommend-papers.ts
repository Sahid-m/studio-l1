
'use server';
/**
 * @fileOverview Recommends papers based on user view history.
 *
 * - recommendPapers - A function that recommends papers based on view history.
 * - RecommendPapersInput - The input type for the recommendPapers function.
 * - RecommendPapersOutput - The return type for the recommendPapers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendPapersInputSchema = z.object({
  viewHistory: z
    .array(z.string())
    .describe('An array of paper titles the user has viewed.'),
});
export type RecommendPapersInput = z.infer<typeof RecommendPapersInputSchema>;

const RecommendPapersOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of recommended paper titles.'),
});
export type RecommendPapersOutput = z.infer<typeof RecommendPapersOutputSchema>;

export async function recommendPapers(input: RecommendPapersInput): Promise<RecommendPapersOutput> {
  return recommendPapersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendPapersPrompt',
  input: {schema: RecommendPapersInputSchema},
  output: {schema: RecommendPapersOutputSchema},
  prompt: `You are a clinical trial paper recommendation engine. Given the user's view history, recommend three papers that the user might be interested in.

View History: {{#each viewHistory}}{{{this}}}\n{{/each}}

Recommendations:`,
});

const recommendPapersFlow = ai.defineFlow(
  {
    name: 'recommendPapersFlow',
    inputSchema: RecommendPapersInputSchema,
    outputSchema: RecommendPapersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
