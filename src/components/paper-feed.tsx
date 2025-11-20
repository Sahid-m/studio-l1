
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { recommendPapers } from '@/ai/flows/recommend-papers';
import { usePapers } from '@/context/paper-context';
import type { FeedItem, ClinicalTrialPaper } from '@/lib/types';
import { PaperView } from './paper-view';
import { VideoView } from './video-view';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { EmblaCarouselType } from 'embla-carousel-react';

export function PaperFeed() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, axis: 'y' });
  const { feedItems, setFeedItems, viewHistory, addToViewHistory, initialItems } = usePapers();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const canSwipeVertical = useRef(true);

  const setVerticalSwipe = useCallback((enabled: boolean) => {
    canSwipeVertical.current = enabled;
  }, []);


  const handleSwipe = useCallback(() => {
    if (!emblaApi) return;
    const previousIndex = emblaApi.previousScrollSnap();
    const previousItem = feedItems[previousIndex];
    if (previousItem && previousItem.type === 'paper') {
      addToViewHistory(previousItem.title);
    }
  }, [emblaApi, feedItems, addToViewHistory]);

  useEffect(() => {
    if (!emblaApi) return;

    const onDragStart = (api: EmblaCarouselType, event: Event) => {
      if (!canSwipeVertical.current) {
        event.stopImmediatePropagation();
      }
    };

    emblaApi.on('settle', handleSwipe);
    emblaApi.on('dragStart', onDragStart, true); // Use capture phase

    return () => {
      emblaApi.off('settle', handleSwipe);
      emblaApi.off('dragStart', onDragStart);
    };
  }, [emblaApi, handleSwipe]);


  const handleGetRecommendations = async () => {
    if (viewHistory.length === 0) {
      toast({ title: "Read some papers first!", description: "We need to know what you like before we can recommend more." });
      return;
    }

    setIsLoading(true);
    try {
      const result = await recommendPapers({ viewHistory });
      const recommendedTitles = result.recommendations;
      
      const allPossiblePapers = initialItems.filter(item => item.type === 'paper') as ClinicalTrialPaper[];

      const newPapers = allPossiblePapers.filter(paper => 
        recommendedTitles.includes(paper.title) && !feedItems.some(item => item.id === paper.id)
      );

      if (newPapers.length > 0) {
        setFeedItems(prev => [...prev, ...newPapers]);
        toast({ title: "New recommendations added!", description: "We've added some papers to your feed we think you'll like." });
        setTimeout(() => emblaApi?.scrollTo(feedItems.length), 100);
      } else {
        toast({ title: "No new recommendations", description: "You've seen all our current recommendations for you." });
      }
    } catch (error) {
      console.error("Failed to get recommendations:", error);
      toast({ title: "Error", description: "Could not fetch new recommendations.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full relative">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex flex-col h-full">
          {feedItems.map((item) => (
            <div className="relative min-w-0 flex-shrink-0 flex-grow-0 basis-full h-full" key={item.id}>
              {item.type === 'paper' ? (
                <PaperView paper={item} onVerticalSwipe={setVerticalSwipe} />
              ) : (
                <VideoView video={item} onVerticalSwipe={setVerticalSwipe} />
              )}
            </div>
          ))}
          <div className="relative min-w-0 flex-shrink-0 flex-grow-0 basis-full h-full flex flex-col items-center justify-center p-8 bg-background">
             <div className="text-center max-w-md">
                <Sparkles className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-6 font-headline text-2xl font-semibold">Find more to read?</h2>
                <p className="text-muted-foreground mt-2 mb-6">Let our AI find papers tailored to your interests based on your view history.</p>
                <Button onClick={handleGetRecommendations} disabled={isLoading} size="lg">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Finding papers...' : 'Get Recommendations'}
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
