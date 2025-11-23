
'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing a clinical paper into a video.
 *
 * The flow takes a paper URL and a prompt as input, extracts the paper's content,
 * and then generates a short video based on that content and the user's prompt.
 *
 * @exported summarizePaperToVideo - The main function to trigger the video generation flow.
 * @exported SummarizePaperToVideoInput - The input type for the function.
 * @exported SummarizePaperToVideoOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {extractArticleContent} from '@/services/article-extractor';

const SummarizePaperToVideoInputSchema = z.object({
  paperUrl: z.string().url().describe('URL of the paper to summarize.'),
  prompt: z.string().describe('A prompt to guide the video generation.'),
});
export type SummarizePaperToVideoInput = z.infer<
  typeof SummarizePaperToVideoInputSchema
>;

const SummarizePaperToVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type SummarizePaperToVideoOutput = z.infer<
  typeof SummarizePaperToVideoOutputSchema
>;

export async function summarizePaperToVideo(
  input: SummarizePaperToVideoInput
): Promise<SummarizePaperToVideoOutput> {
  return summarizePaperToVideoFlow(input);
}

const summarizePaperToVideoFlow = ai.defineFlow(
  {
    name: 'summarizePaperToVideoFlow',
    inputSchema: SummarizePaperToVideoInputSchema,
    outputSchema: SummarizePaperToVideoOutputSchema,
  },
  async ({paperUrl, prompt}) => {
    // SIMULATION: We are not calling any models, just pretending to.
    // We can still get the paper content to make it feel more real if needed.
    await extractArticleContent(paperUrl);
    
    // SIMULATION: Wait for a bit to simulate a long-running process
    await new Promise(resolve => setTimeout(resolve, 15000));

    // SIMULATION: Return a static, sample video URL
    return {
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    };
  }
);
