
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { PaperProvider } from '@/context/paper-context';
import { BottomNav } from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: 'ArticleFlow',
  description: 'A new way to discover and read articles.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <PaperProvider>
          <div className='md:hidden h-full'>
            {children}
            <BottomNav />
          </div>
          <div className='hidden md:block'>
            <div className="flex h-screen w-screen items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold">ArticleFlow</h1>
                <p className="text-muted-foreground">
                  This app is optimized for a mobile experience.
                </p>
                <p className="text-muted-foreground">
                  Please open it on a mobile device or use your browser's developer tools to simulate one.
                </p>
              </div>
            </div>
          </div>
          <Toaster />
        </PaperProvider>
      </body>
    </html>
  );
}
