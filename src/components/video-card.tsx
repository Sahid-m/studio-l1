
'use client';

import type { VideoSummary } from '@/lib/types';
import Image from 'next/image';
import { Play, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function VideoCard({ video }: { video: VideoSummary }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateProgress = () => {
      setProgress((videoElement.currentTime / videoElement.duration) * 100);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('timeupdate', updateProgress);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    // This will auto-play videos when they scroll into view, muted.
    // The IntersectionObserver is a more performant way to handle this.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
            videoRef.current?.play();
        } else {
            videoRef.current?.pause();
        }
      },
      { threshold: 0.7 } // Start playing when 70% of the video is visible
    );

    observer.observe(videoElement);

    return () => {
      videoElement.removeEventListener('timeupdate', updateProgress);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden border-0 shadow-none rounded-none bg-black">
      <div className="relative h-full w-full flex items-center justify-center group" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-contain"
          loop
          playsInline
          muted
        />
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
             <Play className={cn("h-20 w-20 text-white/80 drop-shadow-lg transition-opacity", isPlaying ? "opacity-0" : "opacity-100")} />
        </div>
        
        {!isPlaying && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
             <Image 
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover opacity-50 -z-10"
                data-ai-hint={video.imageHint}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent -z-10"/>
             <Play className="h-20 w-20 text-white/80 drop-shadow-lg" />
          </div>
        )}

        <div className="absolute bottom-40 left-6 right-6 text-white pointer-events-none">
            <h2 className="font-headline text-2xl font-bold">{video.title}</h2>
            <p className="text-sm text-white/80 mt-1 line-clamp-2">{video.summary}</p>
        </div>

        <div className="absolute bottom-28 left-0 right-0 px-6 pointer-events-none">
            <Progress value={progress} className="h-1 bg-white/20 [&>div]:bg-white" />
        </div>
        
        <div className="absolute bottom-10 left-6 right-6">
             <Button asChild variant="outline" className="w-full bg-black/30 text-white border-white/50 backdrop-blur-sm">
                <Link href={`/video/${video.id}/insights`}>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    View Insights
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
