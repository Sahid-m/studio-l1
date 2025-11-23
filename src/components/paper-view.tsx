
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { ClinicalTrialPaper } from '@/lib/types';
import { PaperCard } from './paper-card';
import { PaperInsights } from './paper-insights';
import { PaperSource } from './paper-source';
import { cn } from '@/lib/utils';

export function PaperView({ paper, onVerticalSwipe }: { paper: ClinicalTrialPaper, onVerticalSwipe: (enabled: boolean) => void }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    startIndex: 1,
    axis: 'x',
  });
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    onVerticalSwipe(newIndex === 1);
  }, [emblaApi, onVerticalSwipe]);

  useEffect(() => {
    if (!emblaApi) return;
    
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.stopPropagation();
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
  }

  const views = [
    { component: <PaperInsights paper={paper} onWheel={handleWheel} onTouchMove={handleTouchMove} />, label: 'Insights' },
    { component: <PaperCard paper={paper} />, label: 'Paper' },
    { component: <PaperSource paper={paper} onSwipeLeft={() => scrollTo(1)} onSwipeRight={() => scrollTo(0)} onWheel={handleWheel} onTouchMove={handleTouchMove} />, label: 'Source' },
  ];

  return (
    <div className="h-full w-full relative">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {views.map((view, index) => (
            <div 
              className="relative min-w-0 flex-shrink-0 flex-grow-0 basis-full h-full" 
              key={index}
              aria-hidden={selectedIndex !== index}
            >
              {view.component}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-20 left-0 right-0 flex justify-center items-center gap-2 md:hidden" role="tablist" aria-label="Paper Views">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={selectedIndex === index}
            aria-controls={`panel-${index}`}
            onClick={() => scrollTo(index)}
            className={cn(
              "p-1 rounded-full transition-all",
              selectedIndex === index ? "bg-primary/20" : "bg-transparent"
            )}
            aria-label={`Go to ${views[index].label}`}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                selectedIndex === index ? "bg-primary" : "bg-muted-foreground/50"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

    