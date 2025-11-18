
'use client';

import type { VideoSummary } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function VideoCard({ video }: { video: VideoSummary }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleFullScreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
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

    return () => {
      videoElement.removeEventListener('timeupdate', updateProgress);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <Card className="flex flex-col h-full w-full overflow-hidden border-0 shadow-none rounded-none bg-black">
      <div className="relative h-full w-full flex items-center justify-center">
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-contain"
          loop
          playsInline
          muted={isMuted}
          onClick={togglePlay}
        />
        
        {!isPlaying && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
             <Image 
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover opacity-50"
                data-ai-hint={video.imageHint}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
             <Play className="h-20 w-20 text-white/80 drop-shadow-lg" />
          </div>
        )}

        <div className="absolute bottom-20 left-6 right-6 text-white">
            <h2 className="font-headline text-2xl font-bold">{video.title}</h2>
            <p className="text-sm text-white/80 mt-1 line-clamp-2">{video.summary}</p>
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-4">
             <Button size="icon" variant="ghost" className="rounded-full h-12 w-12 bg-black/40 text-white hover:bg-black/60 hover:text-white" onClick={toggleMute}>
                {isMuted ? <VolumeX /> : <Volume2 />}
            </Button>
             <Button size="icon" variant="ghost" className="rounded-full h-12 w-12 bg-black/40 text-white hover:bg-black/60 hover:text-white" onClick={handleFullScreen}>
                <Maximize />
            </Button>
        </div>

        <div className="absolute bottom-[4.5rem] left-0 right-0 px-6">
            <Progress value={progress} className="h-1 bg-white/20 [&>div]:bg-white" />
        </div>
      </div>
    </Card>
  );
}
