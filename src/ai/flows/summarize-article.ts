'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing articles.
 *
 * The flow takes an article URL as input and returns a summarized version of the article.
 *
 * @exported summarizeArticle - The main function to trigger the summarization flow.
 * @exported SummarizeArticleInput - The input type for the summarizeArticle function.
 * @exported SummarizeArticleOutput - The output type for the summarizeArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {extractArticleContent} from '@/services/article-extractor';

const SummarizeArticleInputSchema = z.object({
  articleUrl: z.string().url().describe('URL of the article to summarize.'),
});
export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

const SummarizeArticleOutputSchema = z.object({
  summary: z.string().describe('A short summary of the article.'),
});
export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

export async function summarizeArticle(input: SummarizeArticleInput): Promise<SummarizeArticleOutput> {
  return summarizeArticleFlow(input);
}

const summarizeArticlePrompt = ai.definePrompt({
  name: 'summarizeArticlePrompt',
  input: {schema: SummarizeArticleInputSchema},
  output: {schema: SummarizeArticleOutputSchema},
  prompt: `Summarize the following article:\n\n{{articleContent}}`,
});

const summarizeArticleFlow = ai.defineFlow(
  {
    name: 'summarizeArticleFlow',
    inputSchema: SummarizeArticleInputSchema,
    outputSchema: SummarizeArticleOutputSchema,
  },
  async input => {
    const articleContent = await extractArticleContent(input.articleUrl);
    const {output} = await summarizeArticlePrompt({articleContent});
    return output!;
  }
);
