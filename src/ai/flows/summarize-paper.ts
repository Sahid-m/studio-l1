
'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing papers.
 *
 * The flow takes a paper URL as input and returns a summarized version of the paper.
 *
 * @exported summarizePaper - The main function to trigger the summarization flow.
 * @exported SummarizePaperInput - The input type for the summarizePaper function.
 * @exported SummarizePaperOutput - The output type for the summarizePaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {extractArticleContent} from '@/services/article-extractor';

const SummarizePaperInputSchema = z.object({
  paperUrl: z.string().url().describe('URL of the paper to summarize.'),
});
export type SummarizePaperInput = z.infer<typeof SummarizePaperInputSchema>;

const SummarizePaperOutputSchema = z.object({
  summary: z.string().describe('A short summary of the paper.'),
});
export type SummarizePaperOutput = z.infer<typeof SummarizePaperOutputSchema>;

export async function summarizePaper(input: SummarizePaperInput): Promise<SummarizePaperOutput> {
  return summarizePaperFlow(input);
}

const summarizePaperPrompt = ai.definePrompt({
  name: 'summarizePaperPrompt',
  input: {schema: z.object({paperContent: z.string()})},
  output: {schema: SummarizePaperOutputSchema},
  prompt: `Summarize the following clinical trial paper:\n\n{{paperContent}}`,
});

const summarizePaperFlow = ai.defineFlow(
  {
    name: 'summarizePaperFlow',
    inputSchema: SummarizePaperInputSchema,
    outputSchema: SummarizePaperOutputSchema,
  },
  async input => {
    const paperContent = await extractArticleContent(input.paperUrl);
    const {output} = await summarizePaperPrompt({paperContent});
    return output!;
  }
);
