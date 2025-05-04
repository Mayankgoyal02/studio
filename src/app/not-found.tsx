import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
            Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <div className="flex space-x-4">
             <Button asChild className="btn-subtle-animate">
                 <Link href="/">Go Back Home</Link>
             </Button>
             <Button variant="outline" asChild className="btn-subtle-animate">
                 <Link href="/experiences">Browse Experiences</Link>
             </Button>
        </div>
    </div>
  )
}
