
'use client';

import { useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppStateContext } from '@/context/app-state-context';
import { AuthContext } from '@/context/auth-context';

const GUEST_ROUTE = '/login';

// This component handles all top-level redirects for the app.
export function AppRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const appContext = useContext(AppStateContext);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    // Wait until contexts are loaded
    if (appContext === undefined || authContext === undefined) {
      return;
    }

    const { user, isLoading } = authContext;
    const { hasCompletedOnboarding } = appContext;

    // Don't redirect while loading auth state
    if (isLoading) return;

    const isGuestRoute = pathname === GUEST_ROUTE;
    const isOnboardingRoute = pathname === '/onboarding';

    if (user) {
      // User is logged in
      if (isGuestRoute) {
        // Logged-in users shouldn't be on guest routes
        router.replace('/');
      } else if (hasCompletedOnboarding === false && !isOnboardingRoute) {
        // Force onboarding if not completed
        router.replace('/onboarding');
      }
    } else {
      // User is not logged in
      if (!isGuestRoute) {
        // Non-logged-in users should be on the guest route
        router.replace(GUEST_ROUTE);
      }
    }

  }, [appContext, authContext, pathname, router]);

  return null; // This component doesn't render anything
}
