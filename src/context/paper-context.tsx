
'use client';

import type { ClinicalTrialPaper, FeedItem } from '@/lib/types';
import { initialFeedItems } from '@/lib/data';
import React, { createContext, useContext, useState, useEffect, type ReactNode, Dispatch, SetStateAction } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PaperContextType {
  savedPapers: ClinicalTrialPaper[];
  viewHistory: string[];
  addSavedPaper: (paper: ClinicalTrialPaper) => void;
  removeSavedPaper: (paperId: string) => void;
  isPaperSaved: (paperId: string) => boolean;
  addToViewHistory: (paperTitle: string) => void;
  feedItems: FeedItem[];
  setFeedItems: Dispatch<SetStateAction<FeedItem[]>>;
  getFeedItemById: (id: string) => FeedItem | undefined;
  initialItems: FeedItem[];
  pendingPapers: ClinicalTrialPaper[];
  addPendingPaper: (paper: ClinicalTrialPaper) => void;
  approvePaper: (paperId: string) => void;
  rejectPaper: (paperId: string) => void;
}

const PaperContext = createContext<PaperContextType | undefined>(undefined);

export const PaperProvider = ({ children }: { children: ReactNode }) => {
  const [savedPapers, setSavedPapers] = useState<ClinicalTrialPaper[]>([]);
  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
  const [pendingPapers, setPendingPapers] = useState<ClinicalTrialPaper[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('savedPapers');
      if (saved) setSavedPapers(JSON.parse(saved));
      
      const pending = window.localStorage.getItem('pendingPapers');
      if (pending) setPendingPapers(JSON.parse(pending));
    } catch (error) {
      console.error("Could not load papers from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('savedPapers', JSON.stringify(savedPapers));
    } catch (error) {
      console.error("Could not save papers to localStorage", error);
    }
  }, [savedPapers]);

   useEffect(() => {
    try {
      window.localStorage.setItem('pendingPapers', JSON.stringify(pendingPapers));
    } catch (error) {
      console.error("Could not save pending papers to localStorage", error);
    }
  }, [pendingPapers]);

  const addSavedPaper = (paper: ClinicalTrialPaper) => {
    setSavedPapers((prev) => [...prev, paper]);
  };

  const removeSavedPaper = (paperId: string) => {
    setSavedPapers((prev) => prev.filter((p) => p.id !== paperId));
  };

  const isPaperSaved = (paperId: string) => {
    return savedPapers.some((p) => p.id === paperId);
  };

  const addToViewHistory = (paperTitle: string) => {
    setViewHistory(prev => {
        const newHistory = [paperTitle, ...prev.filter(t => t !== paperTitle)];
        return newHistory.slice(0, 20);
    });
  }

  const getFeedItemById = (id: string): FeedItem | undefined => {
    return feedItems.find(item => item.id === id);
  }

  const addPendingPaper = (paper: ClinicalTrialPaper) => {
    setPendingPapers(prev => [paper, ...prev]);
  };

  const approvePaper = (paperId: string) => {
    const paperToApprove = pendingPapers.find(p => p.id === paperId);
    if (paperToApprove) {
      setFeedItems(prev => [paperToApprove, ...prev]);
      setPendingPapers(prev => prev.filter(p => p.id !== paperId));
      toast({ title: 'Paper Approved!', description: 'The paper has been added to the main feed.' });
    }
  };

  const rejectPaper = (paperId: string) => {
    setPendingPapers(prev => prev.filter(p => p.id !== paperId));
    toast({ variant: 'destructive', title: 'Paper Rejected', description: 'The paper has been removed from the queue.' });
  };


  return (
    <PaperContext.Provider value={{ 
        savedPapers, 
        addSavedPaper, 
        removeSavedPaper, 
        isPaperSaved, 
        viewHistory, 
        addToViewHistory,
        feedItems,
        setFeedItems,
        getFeedItemById,
        initialItems: initialFeedItems,
        pendingPapers,
        addPendingPaper,
        approvePaper,
        rejectPaper
    }}>
      {children}
    </PaperContext.Provider>
  );
};

export const usePapers = () => {
  const context = useContext(PaperContext);
  if (context === undefined) {
    throw new Error('usePapers must be used within a PaperProvider');
  }
  return context;
};