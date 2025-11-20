'use client';

import type { ClinicalTrialPaper } from '@/lib/types';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Share2, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { usePapers } from '@/context/paper-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

export function PaperCard({ paper }: { paper: ClinicalTrialPaper }) {
  const { addSavedPaper, removeSavedPaper, isPaperSaved } = usePapers();
  const { toast } = useToast();
  const isSaved = isPaperSaved(paper.id);
  const router = useRouter();
  const touchStartX = React.useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX.current - touchEndX > 75) { // Swipe left
      router.push(`/paper/${paper.id}/insights`);
    }
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      removeSavedPaper(paper.id);
      toast({ title: "Paper removed from saved." });
    } else {
      addSavedPaper(paper);
      toast({ title: "Paper saved for later!" });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: paper.title,
          url: paper.sourceUrl,
        });
      } catch (error) {
        console.error('Error sharing', error);
        toast({ title: "Could not share paper.", variant: "destructive" });
      }
    } else {
      navigator.clipboard.writeText(paper.sourceUrl);
      toast({ title: "Paper URL copied to clipboard." });
    }
  };

  const getStatusColor = (status: ClinicalTrialPaper['status']) => {
    switch (status) {
      case 'Recruiting': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'Terminated': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  return (
     <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="h-full w-full">
        <Card className="flex flex-col h-full w-full overflow-hidden border-0 shadow-none rounded-none md:rounded-lg md:border md:shadow-sm">
        <CardHeader className="relative p-0">
            <div className="relative h-64 w-full md:h-80">
            <Image
                src={paper.imageUrl}
                alt={paper.title}
                fill
                className="object-cover"
                data-ai-hint={paper.imageHint}
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 p-6 w-full">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-primary text-primary">{paper.phase}</Badge>
                    <Badge className={`border-transparent text-primary-foreground ${getStatusColor(paper.status)}`}>{paper.status}</Badge>
                </div>
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                    {paper.title}
                </h1>
                <p className="pt-2 text-sm text-foreground/80">
                    By {paper.principalInvestigator} &middot; {paper.publishedDate}
                </p>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
                <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-background/70 backdrop-blur-sm" onClick={handleSaveToggle}>
                    <Bookmark className={isSaved ? 'fill-primary text-primary transition-all' : 'transition-all'} />
                    <span className="sr-only">{isSaved ? 'Unsave Paper' : 'Save Paper'}</span>
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-background/70 backdrop-blur-sm" onClick={handleShare}>
                    <Share2 />
                    <span className="sr-only">Share Paper</span>
                </Button>
            </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
            <div className="px-6 pb-24 text-base leading-relaxed text-foreground/90">
                {paper.summary.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
                ))}
            </div>
            </ScrollArea>
        </CardContent>
        </Card>
    </div>
  );
}
