
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Sparkles, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { summarizePaperToVideo } from '@/ai/flows/summarize-paper-video';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  paperUrl: z.string().url({ message: 'Please enter a valid URL.' }),
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters.' }).max(200, { message: "Prompt cannot exceed 200 characters."}),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateVideoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paperUrl: '',
      prompt: 'An animated explainer video, simple and clear, for a general audience.',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedVideoUrl(null);
    
    try {
      const result = await summarizePaperToVideo(data);
      if (result.videoUrl) {
        
        const fetch = (await import('node-fetch')).default;
        // The URL from Veo is temporary, so we fetch it and convert to a data URI to make it permanent.
        const videoDownloadResponse = await fetch(
            `${result.videoUrl}&key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`
          );

        if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
            throw new Error('Failed to download video');
        }
        
        const videoBuffer = await videoDownloadResponse.arrayBuffer();
        const base64Video = Buffer.from(videoBuffer).toString('base64');
        const videoDataUri = `data:video/mp4;base64,${base64Video}`;
        
        setGeneratedVideoUrl(videoDataUri);

        toast({
          title: 'Video Generated!',
          description: 'Your video summary has been successfully created.',
        });
      } else {
        throw new Error('Video generation did not return a URL.');
      }
    } catch (error: any) {
      console.error('Video generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'There was a problem generating your video.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 pb-24">
      <div className="flex flex-col items-center text-center mb-8">
        <Sparkles className="h-12 w-12 text-primary" />
        <h1 className="font-headline text-4xl font-bold mt-4">Create Video Summary</h1>
        <p className="text-muted-foreground mt-2">
          Turn any clinical trial paper into a short, animated video summary with AI.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Video Generation</CardTitle>
          <CardDescription>Enter a paper URL and a prompt to create your video.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="paperUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://clinicaltrials.gov/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the video style, e.g., 'A simple animated explainer...'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Video className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Generating Video...' : 'Generate Video'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
         <Alert className="mt-8">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Hold tight! AI is at work.</AlertTitle>
            <AlertDescription>
                Video generation can take a minute or two. Please don't close this page.
            </AlertDescription>
        </Alert>
      )}

      {generatedVideoUrl && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Generated Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
              <video
                src={generatedVideoUrl}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
