import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ExperienceCard } from '@/components/ExperienceCard';
import type { Experience } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

// TODO: Replace with actual data fetching
const featuredExperiences: Experience[] = [
  {
    id: '1',
    title: 'Summer Music Fest',
    description: 'Looking for someone to join me at the annual Summer Music Fest. Great bands, good vibes!',
    date: '2024-07-20T00:00:00Z',
    time: '14:00',
    location: 'Central Park',
    category: 'Music',
    imageUrl: 'https://picsum.photos/seed/musicfest/600/400',
    creatorId: 'user123',
    creatorName: 'Alex',
    attendees: [],
  },
  {
    id: '2',
    title: 'Weekend Hiking Trip',
    description: 'Planning a scenic hike this weekend. Need a buddy who enjoys nature and a good walk.',
    date: '2024-07-13T00:00:00Z',
    time: '09:00',
    location: 'Mountain View Trail',
    category: 'Sports', // Or 'Travel'? Let's use Sports for now
    imageUrl: 'https://picsum.photos/seed/hiking/600/400',
    creatorId: 'user456',
    creatorName: 'Sam',
    attendees: ['user789'],
  },
  {
    id: '3',
    title: 'New Italian Restaurant Opening',
    description: 'Want to check out the new Italian place downtown? Looking for a fellow foodie!',
    date: '2024-07-18T00:00:00Z',
    time: '19:30',
    location: 'Downtown Eats',
    category: 'Food',
    imageUrl: 'https://picsum.photos/seed/foodie/600/400',
    creatorId: 'user101',
    creatorName: 'Chloe',
    attendees: [],
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center bg-gradient-to-b from-teal-100 via-background to-background">
         {/* Optional Background Image */}
         {/*
         <Image
           src="https://picsum.photos/seed/herobg/1920/1080"
           alt="People enjoying an experience together"
           fill
           style={{ objectFit: 'cover', zIndex: -1, opacity: 0.1 }}
           data-ai-hint="group friends fun"
           priority
         />
         */}
        <div className="container px-4 md:px-6 z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              Never Experience Alone Again
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Find friendly buddies to share your favorite activities, concerts, trips, and more.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-subtle-animate bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/experiences">
                  Find Experiences
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn-subtle-animate">
                <Link href="/experiences/create">
                  Create an Experience
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Experiences Section */}
      <section className="py-12 md:py-20 bg-secondary">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-8 md:mb-12">
            Featured Experiences
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredExperiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="link" className="text-primary text-lg">
              <Link href="/experiences">
                See All Experiences <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works Section (Optional) */}
       <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-8 md:mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
               <div className="p-4 rounded-full bg-primary/10 mb-4">
                 <Search className="h-10 w-10 text-primary" />
               </div>
              <h3 className="text-xl font-semibold mb-2">1. Find Experiences</h3>
              <p className="text-muted-foreground">Browse or search for activities you're interested in.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="p-4 rounded-full bg-primary/10 mb-4">
                <Users className="h-10 w-10 text-primary" />
               </div>
              <h3 className="text-xl font-semibold mb-2">2. Connect with Buddies</h3>
              <p className="text-muted-foreground">Show interest and connect with the host and other attendees.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="p-4 rounded-full bg-primary/10 mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-party-popper h-10 w-10 text-primary"><path d="M5.77 7.43A1.5 1.5 0 0 1 7.2 6.1l1.63.5A1.5 1.5 0 0 1 10.3 8l.5 1.62a1.5 1.5 0 0 1-1.43 1.88l-1.6-.4a1.5 1.5 0 0 1-1.8-1.5l-.3-1.56Z"/><path d="m12.3 15.7 1.63.5a1.5 1.5 0 0 1 1.43 1.88l-.5 1.62a1.5 1.5 0 0 1-1.87 1.43l-1.63-.5a1.5 1.5 0 0 1-1.43-1.88l.5-1.62a1.5 1.5 0 0 1 1.87-1.43Z"/><path d="M11 6V3"/><path d="M7 12H4"/><path d="m18 8 2-2"/><path d="m6 6-2-2"/><path d="m18 16 2 2"/><path d="m6 18-2 2"/><path d="M13 21v-3"/><path d="M17 12h3"/></svg>
               </div>
              <h3 className="text-xl font-semibold mb-2">3. Enjoy Together</h3>
              <p className="text-muted-foreground">Meet up and share the experience!</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
