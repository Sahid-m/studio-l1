
'use client';

import type { Article } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface ArticleContextType {
  savedArticles: Article[];
  readingHistory: string[];
  addSavedArticle: (article: Article) => void;
  removeSavedArticle: (articleId: string) => void;
  isArticleSaved: (articleId: string) => boolean;
  addToReadingHistory: (articleTitle: string) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider = ({ children }: { children: ReactNode }) => {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [readingHistory, setReadingHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('savedArticles');
      const articles = item ? JSON.parse(item) : [];
      setSavedArticles(articles);
    } catch (error) {
      console.error("Could not load saved articles from localStorage", error);
      setSavedArticles([]);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
      }
    } catch (error) {
      console.error("Could not save articles to localStorage", error);
    }
  }, [savedArticles]);

  const addSavedArticle = (article: Article) => {
    setSavedArticles((prev) => [...prev, article]);
  };

  const removeSavedArticle = (articleId: string) => {
    setSavedArticles((prev) => prev.filter((a) => a.id !== articleId));
  };

  const isArticleSaved = (articleId: string) => {
    return savedArticles.some((a) => a.id === articleId);
  };

  const addToReadingHistory = (articleTitle: string) => {
    setReadingHistory(prev => {
        const newHistory = [articleTitle, ...prev.filter(t => t !== articleTitle)];
        return newHistory.slice(0, 20); // Keep last 20 articles in history
    });
  }

  return (
    <ArticleContext.Provider value={{ savedArticles, addSavedArticle, removeSavedArticle, isArticleSaved, readingHistory, addToReadingHistory }}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};
