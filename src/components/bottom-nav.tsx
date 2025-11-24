
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bookmark, Search, Sparkles, Settings, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppStateContext } from '@/context/app-state-context';
import { AuthContext } from '@/context/auth-context';
import { useContext } from 'react';

export function BottomNav() {
  const pathname = usePathname();
  const appContext = useContext(AppStateContext);
  const authContext = useContext(AuthContext);

  if (authContext?.user === null || appContext?.hasCompletedOnboarding === false) {
    return null;
  }

  const navItems = [
    { href: '/', icon: Home, label: 'Feed' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/create', icon: Sparkles, label: 'Create' },
    { href: '/saved', icon: Bookmark, label: 'Saved' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isDashboardVisible = process.env.NEXT_PUBLIC_SHOW_DASHBOARD === 'true';

  return (
    <nav aria-label="Main Navigation" className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className={cn("mx-auto grid h-full max-w-lg", isDashboardVisible ? "grid-cols-5" : "grid-cols-5")}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'inline-flex flex-col items-center justify-center px-5 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              pathname === item.href ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
            aria-current={pathname === item.href ? 'page' : undefined}
          >
            <item.icon className="mb-1 h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
