'use server';
/**
 * @fileOverview Recommends articles based on user reading history.
 *
 * - recommendArticles - A function that recommends articles based on reading history.
 * - RecommendArticlesInput - The input type for the recommendArticles function.
 * - RecommendArticlesOutput - The return type for the recommendArticles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendArticlesInputSchema = z.object({
  readingHistory: z
    .array(z.string())
    .describe('An array of article titles the user has read.'),
});
export type RecommendArticlesInput = z.infer<typeof RecommendArticlesInputSchema>;

const RecommendArticlesOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of recommended article titles.'),
});
export type RecommendArticlesOutput = z.infer<typeof RecommendArticlesOutputSchema>;

export async function recommendArticles(input: RecommendArticlesInput): Promise<RecommendArticlesOutput> {
  return recommendArticlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendArticlesPrompt',
  input: {schema: RecommendArticlesInputSchema},
  output: {schema: RecommendArticlesOutputSchema},
  prompt: `You are an article recommendation engine. Given the user's reading history, recommend three articles that the user might be interested in.

Reading History: {{#each readingHistory}}{{{this}}}\n{{/each}}

Recommendations:`,
});

const recommendArticlesFlow = ai.defineFlow(
  {
    name: 'recommendArticlesFlow',
    inputSchema: RecommendArticlesInputSchema,
    outputSchema: RecommendArticlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
