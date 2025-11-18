
'use client';

import type { Article } from '@/lib/types';
import Image from 'next/image';
import { Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useArticles } from '@/context/article-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

export function ArticleCard({ article }: { article: Article }) {
  const { addSavedArticle, removeSavedArticle, isArticleSaved } = useArticles();
  const { toast } = useToast();
  const isSaved = isArticleSaved(article.id);

  const handleSaveToggle = () => {
    if (isSaved) {
      removeSavedArticle(article.id);
      toast({ title: "Article removed from saved." });
    } else {
      addSavedArticle(article);
      toast({ title: "Article saved for later!" });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          url: article.sourceUrl,
        });
      } catch (error) {
        console.error('Error sharing', error);
        toast({ title: "Could not share article.", variant: "destructive" });
      }
    } else {
      navigator.clipboard.writeText(article.sourceUrl);
      toast({ title: "Article URL copied to clipboard." });
    }
  };

  return (
    <Card className="flex flex-col h-full w-full overflow-hidden border-0 shadow-none rounded-none md:rounded-lg md:border md:shadow-sm">
      <CardHeader className="relative p-0">
        <div className="relative h-64 w-full md:h-80">
           <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            data-ai-hint={article.imageHint}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 p-6 w-full">
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                {article.title}
            </h1>
            <p className="pt-2 text-sm text-foreground/80">
                By {article.author} &middot; {article.publishedDate}
            </p>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
            <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-background/70 backdrop-blur-sm" onClick={handleSaveToggle}>
                <Bookmark className={isSaved ? 'fill-primary text-primary transition-all' : 'transition-all'} />
                <span className="sr-only">{isSaved ? 'Unsave Article' : 'Save Article'}</span>
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-background/70 backdrop-blur-sm" onClick={handleShare}>
                <Share2 />
                <span className="sr-only">Share Article</span>
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100svh-16rem-6rem-4rem)] md:h-[calc(100vh-20rem-6rem)]">
          <div className="px-6 pb-24 text-base leading-relaxed text-foreground/90">
            {article.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
