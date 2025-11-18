
'use client';

import type { Article } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

export function ArticleSource({ article }: { article: Article }) {
  return (
    <div className="h-full w-full bg-muted/20">
      <div className="flex h-full w-full flex-col">
        <header className="flex items-center justify-between border-b bg-background p-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <h2 className="font-semibold">Article Source</h2>
          </div>
          <Button asChild variant="outline">
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
              Open in New Tab
            </a>
          </Button>
        </header>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={article.sourceUrl}
            title={article.title}
            className="h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
