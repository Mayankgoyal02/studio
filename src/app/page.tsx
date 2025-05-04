import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ExperienceCard } from '@/components/ExperienceCard';
import type { Experience } from '@/lib/types';
import { ArrowRight, Search, Users, PartyPopper } from 'lucide-react'; // Import icons
import { getAllExperiences } from '@/lib/data'; // Import data fetching function

// Fetch experiences and select a few to feature
async function getFeaturedExperiences(): Promise<Experience[]> {
    const allExperiences = await getAllExperiences();
    // Simple logic: take the first 3 most recently added (top of the array)
    return allExperiences.slice(0, 3);
}


export default async function Home() {
  const featuredExperiences = await getFeaturedExperiences();

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center bg-gradient-to-b from-primary/10 via-background to-background">
         {/* Optional Subtle Background Pattern/Image */}
         {/*
         <Image
           src="https://picsum.photos/seed/herobg/1920/1080"
           alt="People enjoying an experience together"
           fill
           style={{ objectFit: 'cover', zIndex: -1, opacity: 0.05 }}
           data-ai-hint="group friends fun subtle pattern"
           priority
         />
         */}
        <div className="container px-4 md:px-6 z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tighter text-primary sm:text-4xl md:text-5xl lg:text-6xl">
              Never Experience Alone Again
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg md:text-xl max-w-xl mx-auto">
              Find friendly buddies to share your favorite activities, concerts, trips, and more. Create or join experiences effortlessly.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-subtle-animate bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
                <Link href="/experiences">
                  Find Experiences
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn-subtle-animate w-full sm:w-auto">
                <Link href="/experiences/create">
                  Create an Experience
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Experiences Section */}
      <section className="py-12 md:py-20 bg-secondary/50"> {/* Slightly off-white background */}
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tighter text-center sm:text-3xl mb-8 md:mb-12">
            Featured Experiences Happening Soon
          </h2>
           {featuredExperiences.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {featuredExperiences.map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
           ) : (
               <p className="text-center text-muted-foreground">No featured experiences available right now. Check back soon!</p>
           )}
          <div className="mt-12 text-center">
            <Button asChild variant="link" className="text-primary text-base sm:text-lg font-medium hover:underline">
              <Link href="/experiences">
                See All Experiences <ArrowRight className="ml-1.5 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
       <section className="py-12 md:py-20 border-t">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tighter text-center sm:text-3xl mb-10 md:mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center p-4">
               <div className="p-4 rounded-full bg-primary/10 mb-4 inline-flex">
                 <Search className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
               </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">1. Find or Create</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Browse existing experiences or create your own for others to join.</p>
            </div>
             {/* Step 2 */}
            <div className="flex flex-col items-center p-4">
               <div className="p-4 rounded-full bg-primary/10 mb-4 inline-flex">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
               </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">2. Connect</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Express interest, chat with the host, and coordinate details.</p>
            </div>
             {/* Step 3 */}
            <div className="flex flex-col items-center p-4">
               <div className="p-4 rounded-full bg-primary/10 mb-4 inline-flex">
                 <PartyPopper className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
               </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">3. Enjoy Together</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Meet up with your new buddies and share the awesome experience!</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
