
'use client';

import type { ClinicalTrialPaper, FeedItem } from '@/lib/types';
import { initialFeedItems } from '@/lib/data';
import React, { createContext, useContext, useState, useEffect, type ReactNode, Dispatch, SetStateAction } from 'react';

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
}

const PaperContext = createContext<PaperContextType | undefined>(undefined);

export const PaperProvider = ({ children }: { children: ReactNode }) => {
  const [savedPapers, setSavedPapers] = useState<ClinicalTrialPaper[]>([]);
  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('savedPapers');
      const papers = item ? JSON.parse(item) : [];
      setSavedPapers(papers);
    } catch (error) {
      console.error("Could not load saved papers from localStorage", error);
      setSavedPapers([]);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('savedPapers', JSON.stringify(savedPapers));
      }
    } catch (error) {
      console.error("Could not save papers to localStorage", error);
    }
  }, [savedPapers]);

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
        return newHistory.slice(0, 20); // Keep last 20 papers in history
    });
  }

  const getFeedItemById = (id: string): FeedItem | undefined => {
    return feedItems.find(item => item.id === id);
  }

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
        initialItems: initialFeedItems
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
