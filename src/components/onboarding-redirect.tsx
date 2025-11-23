
'use client';

import { useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppStateContext } from '@/context/app-state-context';

// This component is responsible for redirecting the user to the onboarding flow
// if they haven't completed it yet.
export function OnboardingRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const appContext = useContext(AppStateContext);

  useEffect(() => {
    if (appContext?.hasCompletedOnboarding === false && pathname !== '/onboarding') {
      router.replace('/onboarding');
    }
  }, [appContext?.hasCompletedOnboarding, pathname, router]);

  return null; // This component doesn't render anything
}
