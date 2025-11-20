
'use client';

import { usePapers } from '@/context/paper-context';
import { VideoInsights } from '@/components/video-insights';
import { notFound } from 'next/navigation';
import type { VideoSummary } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function VideoInsightsPage({ params }: { params: { id: string } }) {
  const { getFeedItemById } = usePapers();
  const item = getFeedItemById(params.id);

  if (!item || item.type !== 'video') {
    notFound();
  }

  return (
    <div className="h-svh flex flex-col">
       <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Button asChild size="icon" variant="outline" className="h-8 w-8">
                <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to Feed</span>
                </Link>
            </Button>
            <h1 className="font-semibold text-lg truncate">Video Insights</h1>
        </header>
        <main className="flex-1 overflow-auto">
            <VideoInsights video={item as VideoSummary} />
        </main>
    </div>
  );
}
