
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ArticleProvider } from '@/context/article-context';
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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <ArticleProvider>
          {children}
          <BottomNav />
          <Toaster />
        </ArticleProvider>
      </body>
    </html>
  );
}
