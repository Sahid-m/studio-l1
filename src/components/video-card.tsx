
'use client';

import type { VideoSummary } from '@/lib/types';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';

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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
            videoRef.current?.play();
        } else {
            videoRef.current?.pause();
        }
      },
      { threshold: 0.7 } 
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
          title={video.title}
        />
        
        <div className={cn("absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity", isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100")}>
             <Play className={cn("h-20 w-20 text-white/80 drop-shadow-lg transition-transform duration-300", isPlaying ? "opacity-0 scale-150" : "opacity-100 scale-100")} />
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
          </div>
        )}

        <div className="absolute bottom-28 left-6 right-6 text-white pointer-events-none">
            <h2 className="font-headline text-2xl font-bold">{video.title}</h2>
            <p className="text-sm text-white/80 mt-1 line-clamp-2">{video.summary}</p>
        </div>

        <div className="absolute bottom-20 left-0 right-0 px-6 pointer-events-none">
            <Progress value={progress} className="h-1 bg-white/20 [&>div]:bg-white" aria-label="Video progress" />
        </div>
        
      </div>
    </div>
  );
}

    