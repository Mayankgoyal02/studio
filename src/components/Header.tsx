import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, PlusCircle, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 sm:px-6 md:px-8">
        <Link href="/" className="mr-4 flex items-center space-x-2 md:mr-6">
          <Users className="h-6 w-6 text-primary flex-shrink-0" />
          <span className="font-bold hidden sm:inline-block">ExperienceBuddy</span>
          <span className="font-bold sm:hidden text-lg">EB</span> {/* Shorter name for mobile */}
        </Link>
        <nav className="flex flex-1 items-center space-x-4 sm:space-x-6">
          <Link href="/experiences" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Experiences
          </Link>
          {/* Add more nav links here if needed */}
        </nav>
        <div className="flex items-center space-x-1 sm:space-x-2">
           <Button variant="ghost" size="icon" asChild>
             <Link href="/experiences">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search Experiences</span>
             </Link>
           </Button>
           <Button asChild className="btn-subtle-animate">
            <Link href="/experiences/create">
              <PlusCircle className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Create Experience</span>
              <span className="sr-only sm:hidden">Create Experience</span>
            </Link>
          </Button>
          {/* Add Auth buttons here later (Login/Signup/User Profile) */}
        </div>
      </div>
    </header>
  );
}
