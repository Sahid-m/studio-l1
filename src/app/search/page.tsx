
'use client';

import { useState } from 'react';
import { usePapers } from '@/context/paper-context';
import type { ClinicalTrialPaper } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { SearchIcon, X } from 'lucide-react';

export default function SearchPage() {
  const { savedPapers } = usePapers(); // Or all papers if you have a source
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPapers, setFilteredPapers] = useState<ClinicalTrialPaper[]>([]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredPapers([]);
      return;
    }
    const results = savedPapers.filter((paper) =>
      paper.title.toLowerCase().includes(term.toLowerCase()) ||
      paper.summary.toLowerCase().includes(term.toLowerCase()) ||
      paper.principalInvestigator.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPapers(results);
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <h1 className="font-headline text-4xl font-bold mb-8">Search Papers</h1>
      
      <div className="relative mb-8">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by title, investigator, or summary..."
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
        {searchTerm && filteredPapers.length === 0 && (
            <div className="text-center py-16">
                <p className="text-muted-foreground">No papers found for "{searchTerm}"</p>
            </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} className="flex flex-col overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
              <div className="relative h-48 w-full">
                <Image src={paper.imageUrl} alt={paper.title} fill className="object-cover" data-ai-hint={paper.imageHint} />
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-xl leading-tight">{paper.title}</CardTitle>
                <CardDescription>By {paper.principalInvestigator}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {paper.summary.split('\n\n')[0]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
