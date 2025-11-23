
'use client';

import React, { createContext, useState, useEffect, type ReactNode } from 'react';

type ContentPreference = 'article' | 'video' | 'both';

interface AppStateContextType {
  hasCompletedOnboarding: boolean | undefined;
  setHasCompletedOnboarding: (value: boolean) => void;
  contentPreference: ContentPreference;
  setContentPreference: (value: ContentPreference) => void;
  therapeuticInterests: string[];
  setTherapeuticInterests: (interests: string[]) => void;
  toggleTherapeuticInterest: (interest: string) => void;
}

export const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

const ONBOARDING_KEY = 'medlens_onboarding_complete';
const PREFERENCE_KEY = 'medlens_content_preference';
const INTERESTS_KEY = 'medlens_therapeutic_interests';

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState<boolean | undefined>(undefined);
  const [contentPreference, setContentPreferenceState] = useState<ContentPreference>('both');
  const [therapeuticInterests, setTherapeuticInterestsState] = useState<string[]>([]);

  useEffect(() => {
    try {
      const onboardingComplete = window.localStorage.getItem(ONBOARDING_KEY) === 'true';
      setHasCompletedOnboardingState(onboardingComplete);

      const savedPreference = window.localStorage.getItem(PREFERENCE_KEY) as ContentPreference;
      if (savedPreference) {
        setContentPreferenceState(savedPreference);
      }

      const savedInterests = window.localStorage.getItem(INTERESTS_KEY);
      if (savedInterests) {
        setTherapeuticInterestsState(JSON.parse(savedInterests));
      }
    } catch (error) {
      console.error("Failed to load user preferences from localStorage", error);
      setHasCompletedOnboardingState(false);
    }
  }, []);

  const setHasCompletedOnboarding = (value: boolean) => {
    try {
      window.localStorage.setItem(ONBOARDING_KEY, String(value));
      setHasCompletedOnboardingState(value);
    } catch (error) {
      console.error("Could not save onboarding status to localStorage", error);
    }
  };

  const setContentPreference = (value: ContentPreference) => {
    try {
      window.localStorage.setItem(PREFERENCE_KEY, value);
      setContentPreferenceState(value);
    } catch (error) {
      console.error("Could not save content preference to localStorage", error);
    }
  };

  const setTherapeuticInterests = (interests: string[]) => {
     try {
      window.localStorage.setItem(INTERESTS_KEY, JSON.stringify(interests));
      setTherapeuticInterestsState(interests);
    } catch (error) {
      console.error("Could not save therapeutic interests to localStorage", error);
    }
  }

  const toggleTherapeuticInterest = (interest: string) => {
    setTherapeuticInterestsState(prev => {
        const newInterests = prev.includes(interest)
            ? prev.filter(i => i !== interest)
            : [...prev, interest];
        try {
            window.localStorage.setItem(INTERESTS_KEY, JSON.stringify(newInterests));
        } catch (error) {
            console.error("Could not save therapeutic interests to localStorage", error);
        }
        return newInterests;
    });
  }


  return (
    <AppStateContext.Provider value={{ 
        hasCompletedOnboarding, 
        setHasCompletedOnboarding,
        contentPreference,
        setContentPreference,
        therapeuticInterests,
        setTherapeuticInterests,
        toggleTherapeuticInterest
    }}>
      {children}
    </AppStateContext.Provider>
  );
};
