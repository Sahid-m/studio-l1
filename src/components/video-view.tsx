
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { VideoSummary } from '@/lib/types';
import { VideoCard } from './video-card';
import { VideoInsights } from './video-insights';
import { VideoSource } from './video-source';
import { cn } from '@/lib/utils';

export function VideoView({ video, onVerticalSwipe }: { video: VideoSummary, onVerticalSwipe: (enabled: boolean) => void }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    startIndex: 1,
    axis: 'x',
  });
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // This stops touch events on the child from bubbling up to the parent
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (!emblaApi) return;
    
    setScrollSnaps(emblaApi.scrollSnapList());

    const onSelect = () => {
      const newIndex = emblaApi.selectedScrollSnap();
      setSelectedIndex(newIndex);
      // Only allow vertical swipe if the main card (index 1) is selected.
      onVerticalSwipe(newIndex === 1);
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    // Initial check
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onVerticalSwipe]);

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  const views = [
    { component: <VideoInsights video={video} />, label: 'Insights' },
    { component: <VideoCard video={video} />, label: 'Video' },
    { component: <VideoSource video={video} onSwipeLeft={() => scrollTo(1)} onSwipeRight={() => scrollTo(0)} />, label: 'Source' },
  ];

  return (
    <div className="h-full w-full relative">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {views.map((view, index) => (
            <div 
              className="relative min-w-0 flex-shrink-0 flex-grow-0 basis-full h-full" 
              key={index}
              // Add the touch handler to the non-central views
              onTouchMove={index !== 1 ? handleTouchMove : undefined}
            >
              {view.component}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-20 left-0 right-0 flex justify-center items-center gap-2 md:hidden">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "p-1 rounded-full transition-all",
              selectedIndex === index ? "bg-primary/20" : "bg-transparent"
            )}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                selectedIndex === index ? "bg-primary" : "bg-muted-foreground/50"
              )}
            />
             <span className="sr-only">Go to {views[index].label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
