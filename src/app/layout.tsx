import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ExperienceBuddy',
  description: 'Find a buddy for your next experience!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light"> {/* Ensure light mode default or manage theme */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          {/* Add Footer here if needed */}
        </div>
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}
