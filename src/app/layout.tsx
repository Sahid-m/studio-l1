
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { PaperProvider } from '@/context/paper-context';
import { BottomNav } from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: 'TrialFlow',
  description: 'A new way to discover and read clinical trial papers.',
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
        <PaperProvider>
          {children}
          <BottomNav />
          <Toaster />
        </PaperProvider>
      </body>
    </html>
  );
}
