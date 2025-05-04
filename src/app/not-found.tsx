import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)]"> {/* Ensure it takes significant height */}
        <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-destructive mb-4 sm:mb-6" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">404 - Page Not Found</h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-md">
            Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-xs sm:max-w-none">
             <Button asChild className="btn-subtle-animate w-full sm:w-auto">
                 <Link href="/">Go Back Home</Link>
             </Button>
             <Button variant="outline" asChild className="btn-subtle-animate w-full sm:w-auto">
                 <Link href="/experiences">Browse Experiences</Link>
             </Button>
        </div>
    </div>
  )
}
