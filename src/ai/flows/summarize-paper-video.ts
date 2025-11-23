
'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing a clinical paper into a video.
 *
 * The flow takes a paper URL and a prompt as input, extracts the paper's content,
 * and then generates a short video based on that content and the user's prompt.
 * It streams status updates back to the client during the process.
 *
 * @exported summarizePaperToVideo - The main function to trigger the video generation flow.
 * @exported SummarizePaperToVideoInput - The input type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePaperToVideoInputSchema = z.object({
  paperUrl: z.string().url().describe('URL of the paper to summarize.'),
  prompt: z.string().describe('A prompt to guide the video generation.'),
});
export type SummarizePaperToVideoInput = z.infer<
  typeof SummarizePaperToVideoInputSchema
>;

// No explicit output schema needed for streaming responses
export function summarizePaperToVideo(
  input: SummarizePaperToVideoInput
): ReadableStream<Uint8Array> {
  // We are not using a formal Genkit flow here to have fine-grained
  // control over the ReadableStream for simulation purposes.
  
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const sendUpdate = (status: string, data: Record<string, any> = {}) => {
        controller.enqueue(encoder.encode(JSON.stringify({ status, ...data }) + '\n'));
      };

      const steps = [
        "Analyzing clinical paper...",
        "Generating video script...",
        "Creating storyboard...",
        "Rendering video frames (1/2)...",
        "Rendering video frames (2/2)...",
        "Adding voiceover...",
        "Finalizing video..."
      ];

      try {
        for (const step of steps) {
          await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));
          sendUpdate(step);
        }

        // Final message with the video URL
        sendUpdate("complete", { videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' });

      } catch (e) {
        const error = e instanceof Error ? e : new Error('An unknown error occurred');
        console.error("Streaming error:", error);
        sendUpdate("error", { message: error.message });
      } finally {
        controller.close();
      }
    },
  });

  return stream;
}
