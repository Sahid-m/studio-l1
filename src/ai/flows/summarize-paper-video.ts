
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
import { googleAI } from '@genkit-ai/google-genai';

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
    const paperContent = await extractArticleContent(paperUrl);

    // A prompt to first summarize the content, making it suitable for a video script.
    const videoPrompt = `Based on the following clinical trial paper content, create a concise, engaging script for a 15-second animated explainer video. The video should follow this user's prompt: "${prompt}".

Paper Content:
${paperContent.substring(0, 4000)}...

Generate a direct prompt for a text-to-video model that captures the essence of this script. The prompt should be a single, descriptive paragraph. For example: "An animated video explaining the efficacy of a new drug for Alzheimer's disease, showing brain neurons and cognitive improvement."`;

    const { output: videoGenerationPrompt } = await ai.generate({
        prompt: videoPrompt,
        model: 'googleai/gemini-1.5-flash-latest',
    });


    if (!videoGenerationPrompt) {
        throw new Error('Failed to generate video creation prompt.');
    }

    let { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: videoGenerationPrompt as string,
        config: {
          durationSeconds: 8,
          aspectRatio: '9:16',
        },
      });

      if (!operation) {
        throw new Error('Expected the model to return an operation');
      }
    
      // Wait until the operation completes.
      while (!operation.done) {
        operation = await ai.checkOperation(operation);
        // Sleep for 5 seconds before checking again.
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    
      if (operation.error) {
        throw new Error('failed to generate video: ' + operation.error.message);
      }
    
      const video = operation.output?.message?.content.find((p) => !!p.media);
      if (!video || !video.media?.url) {
        throw new Error('Failed to find the generated video');
      }

    return {
      videoUrl: video.media.url,
    };
  }
);
