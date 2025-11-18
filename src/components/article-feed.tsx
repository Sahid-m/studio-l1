
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { recommendArticles } from '@/ai/flows/recommend-articles';
import { useArticles } from '@/context/article-context';
import type { Article } from '@/lib/types';
import { initialArticles } from '@/lib/data';
import { ArticleCard } from './article-card';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function ArticleFeed() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, axis: 'x' });
  const { addToReadingHistory, readingHistory } = useArticles();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleArticleSwipe = useCallback(() => {
    if (!emblaApi) return;
    const previousIndex = emblaApi.previousScrollSnap();
    const previousArticle = articles[previousIndex];
    if (previousArticle) {
      addToReadingHistory(previousArticle.title);
    }
  }, [emblaApi, articles, addToReadingHistory]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('settle', handleArticleSwipe);
      return () => {
        emblaApi.off('settle', handleArticleSwipe);
      };
    }
  }, [emblaApi, handleArticleSwipe]);

  const handleGetRecommendations = async () => {
    if (readingHistory.length === 0) {
      toast({ title: "Read some articles first!", description: "We need to know what you like before we can recommend more." });
      return;
    }

    setIsLoading(true);
    try {
      const result = await recommendArticles({ readingHistory });
      const recommendedTitles = result.recommendations;
      
      const allPossibleArticles = initialArticles;

      const newArticles = allPossibleArticles.filter(article => 
        recommendedTitles.includes(article.title) && !articles.some(a => a.id === article.id)
      );

      if (newArticles.length > 0) {
        setArticles(prev => [...prev, ...newArticles]);
        toast({ title: "New recommendations added!", description: "We've added some articles to your feed we think you'll like." });
        setTimeout(() => emblaApi?.scrollTo(articles.length), 100);
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
        <div className="flex h-full">
          {articles.map((article) => (
            <div className="relative min-w-0 flex-shrink-0 flex-grow-0 basis-full h-full" key={article.id}>
              <ArticleCard article={article} />
            </div>
))}
          <div className="relative min-w-0 flex-shrink-0 flex-grow-0 basis-full h-full flex flex-col items-center justify-center p-8 bg-background">
             <div className="text-center max-w-md">
                <Sparkles className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-6 font-headline text-2xl font-semibold">Find more to read?</h2>
                <p className="text-muted-foreground mt-2 mb-6">Let our AI find articles tailored to your interests based on your reading history.</p>
                <Button onClick={handleGetRecommendations} disabled={isLoading} size="lg">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Finding articles...' : 'Get Recommendations'}
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
