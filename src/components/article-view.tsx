
'use client';

import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { Article } from '@/lib/types';
import { ArticleCard } from './article-card';
import { ArticleInsights } from './article-insights';
import { ArticleSource } from './article-source';
import { Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ArticleView({ article }: { article: Article }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    startIndex: 1,
    axis: 'x',
  });
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  const views = [
    { component: <ArticleInsights article={article} />, label: 'Insights' },
    { component: <ArticleCard article={article} />, label: 'Article' },
    { component: <ArticleSource article={article} />, label: 'Source' },
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
