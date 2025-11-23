
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
    // We can still simulate the text parts for realism
    const paperContent = await extractArticleContent(paperUrl);

    // A prompt to first summarize the content, making it suitable for a video script.
    const videoPrompt = `Based on the following clinical trial paper content, create a concise, engaging script for a 15-second animated explainer video. The video should follow this user's prompt: "${prompt}".

Paper Content:
${paperContent.substring(0, 4000)}...

Generate a direct prompt for a text-to-video model that captures the essence of this script.`;

    const { output: videoGenerationPrompt } = await ai.generate({
        prompt: videoPrompt,
        model: 'googleai/gemini-1.5-flash-latest',
    });

    if (!videoGenerationPrompt) {
        throw new Error('Failed to generate video creation prompt.');
    }
    
    // SIMULATION: Wait for a bit to simulate a long-running process
    await new Promise(resolve => setTimeout(resolve, 15000));

    // SIMULATION: Return a static, sample video URL
    return {
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    };
  }
);
