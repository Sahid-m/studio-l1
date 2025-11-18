'use client';

import { useState } from 'react';
import { useArticles } from '@/context/article-context';
import type { Article } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { SearchIcon, X } from 'lucide-react';

export default function SearchPage() {
  const { savedArticles } = useArticles(); // Or all articles if you have a source
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredArticles([]);
      return;
    }
    const results = savedArticles.filter((article) =>
      article.title.toLowerCase().includes(term.toLowerCase()) ||
      article.content.toLowerCase().includes(term.toLowerCase()) ||
      article.author.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredArticles(results);
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <h1 className="font-headline text-4xl font-bold mb-8">Search Articles</h1>
      
      <div className="relative mb-8">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by title, author, or content..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 text-base h-12"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
            onClick={() => handleSearch('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div>
        {searchTerm && filteredArticles.length === 0 && (
            <div className="text-center py-16">
                <p className="text-muted-foreground">No articles found for "{searchTerm}"</p>
            </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="flex flex-col overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
              <div className="relative h-48 w-full">
                <Image src={article.imageUrl} alt={article.title} fill className="object-cover" data-ai-hint={article.imageHint} />
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-xl leading-tight">{article.title}</CardTitle>
                <CardDescription>By {article.author}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {article.content.split('\n\n')[0]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
