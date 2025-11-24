'use client';

import { useState } from 'react';
import { usePapers } from '@/context/paper-context';
import type { ClinicalTrialPaper } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Check, X, FileText, Loader2, ListTodo } from 'lucide-react';
import { initialFeedItems } from '@/lib/data';

export default function DashboardPage() {
  const { pendingPapers, approvePaper, rejectPaper, addPendingPaper } = usePapers();
  const [newPaperUrl, setNewPaperUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddPaper = async () => {
    if (!newPaperUrl.trim()) {
        toast({ variant: 'destructive', title: 'URL cannot be empty.' });
        return;
    }
    setIsSubmitting(true);
    
    // Simulate fetching and processing the paper
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For this simulation, we'll just add a placeholder paper.
    // In a real app, you'd fetch the URL and use an AI to generate the data.
    const newPaper: ClinicalTrialPaper = {
      ...initialFeedItems.find(p => p.type === 'paper' && p.id === '2') as ClinicalTrialPaper,
      id: `pending-${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Submitted Paper for Review',
      sourceUrl: newPaperUrl,
    };
    
    addPendingPaper(newPaper);
    
    toast({ title: 'Paper Submitted', description: 'The paper is now pending review.' });
    setNewPaperUrl('');
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pb-24">
      <div className="flex flex-col items-center text-center mb-8">
        <ListTodo className="h-12 w-12 text-primary" />
        <h1 className="font-headline text-4xl font-bold mt-4">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage clinical trial papers and approve AI-generated insights.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle />
            Submit New Clinical Trial
          </CardTitle>
          <CardDescription>
            Enter the URL of a clinical trial paper to add it to the review queue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="https://clinicaltrials.gov/..."
              value={newPaperUrl}
              onChange={(e) => setNewPaperUrl(e.target.value)}
              disabled={isSubmitting}
            />
            <Button onClick={handleAddPaper} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Separator className="my-8" />

      <div>
        <h2 className="font-headline text-2xl font-bold mb-4">Pending Review</h2>
        {pendingPapers.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-lg bg-muted/50">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No papers to review</h3>
            <p className="mt-2 text-sm text-muted-foreground">Submit a paper URL above to begin.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPapers.map((paper) => (
              <Card key={paper.id} className="bg-card">
                <CardHeader>
                  <CardTitle className="text-xl">{paper.title}</CardTitle>
                  <CardDescription>
                    By {paper.principalInvestigator}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {paper.summary}
                  </p>
                  <p className='text-xs text-muted-foreground mt-2'><strong>Source:</strong> {paper.sourceUrl}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => rejectPaper(paper.id)}>
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button size="sm" onClick={() => approvePaper(paper.id)}>
                    <Check className="mr-2 h-4 w-4" />
                    Approve & Add to Feed
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}