
'use client';

import { useArticles } from '@/context/article-context';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Inbox } from 'lucide-react';

export default function SavedArticlesPage() {
  const { savedArticles } = useArticles();

  if (savedArticles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100svh-8rem)] text-center p-4">
        <Inbox className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-6 font-headline text-2xl font-semibold">No saved articles yet</h2>
        <p className="mt-2 text-muted-foreground">Articles you save will appear here.</p>
        <Button asChild className="mt-6">
          <Link href="/">Start Reading</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <h1 className="font-headline text-4xl font-bold mb-8">Saved Articles</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {savedArticles.map((article) => (
          <Card key={article.id} className="flex flex-col overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
            <div className="relative h-48 w-full">
              <Image src={article.imageUrl} alt={article.title} fill className="object-cover" data-ai-hint={article.imageHint} />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl leading-tight">{article.title}</CardTitle>
              <CardDescription>By {article.author}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.content.split('\n\n')[0]}
                </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
