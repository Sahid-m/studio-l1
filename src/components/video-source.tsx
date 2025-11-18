
'use client';

import type { VideoSummary } from '@/lib/types';
import { Globe, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export function VideoSource({ video, onSwipeLeft, onSwipeRight }: { video: VideoSummary, onSwipeLeft?: () => void, onSwipeRight?: () => void }) {
  return (
    <div className="h-full w-full bg-muted/20">
      <div className="flex h-full w-full flex-col">
        <header className="flex items-center justify-between border-b bg-background p-2 md:p-4">
          <div className="flex items-center gap-2">
            {onSwipeLeft && (
                <Button size="icon" variant="ghost" onClick={onSwipeLeft}>
                    <ArrowLeft />
                    <span className="sr-only">Go back to video</span>
                </Button>
            )}
            <Globe className="h-5 w-5 hidden sm:block" />
            <h2 className="font-semibold text-sm sm:text-base truncate">Original Paper Source</h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href={video.sourceUrl} target="_blank" rel="noopener noreferrer">
              Open in New Tab
            </a>
          </Button>
        </header>
        <div className="flex-1 overflow-hidden relative group">
          <iframe
            src={video.sourceUrl}
            title={`Source for: ${video.title}`}
            className="h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
           {/* Swipe affordance for desktop */}
           <div className="absolute inset-y-0 left-0 hidden md:flex items-center justify-center px-4 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                {onSwipeLeft && (
                    <Button size="icon" variant="secondary" onClick={onSwipeLeft} className='rounded-full'>
                        <ArrowLeft />
                    </Button>
                )}
            </div>
            <div className="absolute inset-y-0 right-0 hidden md:flex items-center justify-center px-4 bg-gradient-to-l from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                {onSwipeRight && (
                    <Button size="icon" variant="secondary" onClick={onSwipeRight} className='rounded-full'>
                        <ArrowRight />
                    </Button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
