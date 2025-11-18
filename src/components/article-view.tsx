
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { Article } from '@/lib/types';
import { ArticleCard } from './article-card';
import { ArticleInsights } from './article-insights';
import { ArticleSource } from './article-source';
import { Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ArticleView({ article, onVerticalSwipe }: { article: Article, onVerticalSwipe: (enabled: boolean) => void }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    startIndex: 1,
    axis: 'x',
  });
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // This handler is now used for the Insights page to allow its internal scroll
  // while preventing the parent vertical carousel from firing.
  // The logic to stop propagation has been moved to the parent (ArticleFeed).
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    // We only need to handle this for the Insights page, which has vertical content.
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      // The actual prevention now happens in ArticleFeed's dragStart handler
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    
    setScrollSnaps(emblaApi.scrollSnapList());

    const onSelect = () => {
      const newIndex = emblaApi.selectedScrollSnap();
      setSelectedIndex(newIndex);
      // Disable vertical swiping if we are on the Insights page (index 0).
      // This is the key communication to the parent component.
      onVerticalSwipe(newIndex !== 0);
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
    { component: <ArticleInsights article={article} onWheel={handleWheel} />, label: 'Insights' },
    { component: <ArticleCard article={article} />, label: 'Article' },
    { component: <ArticleSource article={article} onSwipeLeft={() => scrollTo(1)} />, label: 'Source' },
  ];

  return (
    <div className="h-full w-full relative">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {views.map((view, index) => (
            <div className="relative min-w-0 flex-shrink-0 flex-grow-0 basis-full h-full" key={index}>
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
