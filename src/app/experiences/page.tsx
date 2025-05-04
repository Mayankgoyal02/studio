import { ExperienceCard } from '@/components/ExperienceCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Experience } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';

// TODO: Replace with actual data fetching and filtering logic
async function getExperiences(searchParams: { [key: string]: string | string[] | undefined }): Promise<Experience[]> {
  console.log("Search Params:", searchParams); // Log received params
  // Simulate fetching data
  const allExperiences: Experience[] = [
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
      category: 'Sports',
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
    {
      id: '4',
      title: 'Art Gallery Visit',
      description: 'Exploring the modern art gallery next Saturday. Anyone interested in joining?',
      date: '2024-07-27T00:00:00Z',
      time: '11:00',
      location: 'City Art Gallery',
      category: 'Arts',
      imageUrl: 'https://picsum.photos/seed/artgallery/600/400',
      creatorId: 'user555',
      creatorName: 'Maria',
      attendees: [],
    },
     {
      id: '5',
      title: 'Travel Buddy for Europe Trip',
      description: 'Planning a 2-week backpacking trip through Europe in August. Seeking a travel companion.',
      date: '2024-08-05T00:00:00Z', // Represents start date
      time: 'N/A',
      location: 'Europe (Multiple)',
      category: 'Travel',
      imageUrl: 'https://picsum.photos/seed/europetrip/600/400',
      creatorId: 'user999',
      creatorName: 'Ben',
      attendees: [],
    },
  ];

  // Basic filtering simulation
  let filteredExperiences = allExperiences;
  const query = searchParams?.query as string | undefined;
  const category = searchParams?.category as string | undefined;
  const location = searchParams?.location as string | undefined;
  // Add date filtering later

  if (query) {
    filteredExperiences = filteredExperiences.filter(exp =>
      exp.title.toLowerCase().includes(query.toLowerCase()) ||
      exp.description.toLowerCase().includes(query.toLowerCase())
    );
  }
  if (category && category !== 'all') {
     filteredExperiences = filteredExperiences.filter(exp => exp.category.toLowerCase() === category.toLowerCase());
  }
   if (location) {
    filteredExperiences = filteredExperiences.filter(exp => exp.location.toLowerCase().includes(location.toLowerCase()));
  }


  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return filteredExperiences;
}

// Define available categories
const categories = ['All', 'Music', 'Sports', 'Travel', 'Food', 'Arts'];

export default async function ExperiencesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const experiences = await getExperiences(searchParams);

  // We need a server action to handle form submission and redirect with query params
  async function handleSearch(formData: FormData) {
    'use server';
    const query = formData.get('query') as string || '';
    const category = formData.get('category') as string || 'all';
    const location = formData.get('location') as string || '';

    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (category && category !== 'all') params.set('category', category);
    if (location) params.set('location', location);

    // Use redirect from next/navigation - needs to be done client-side or handled differently server-side.
    // For now, let's rely on the form's default GET behavior by adding inputs.
    // Or, use a client component wrapper for the form. Let's stick to server for now.
    // We will rebuild the URL and redirect server-side (less ideal for UX but works without client JS for now)
    const { redirect } = await import('next/navigation');
    redirect(`/experiences?${params.toString()}`);
  }


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">Find Your Next Experience Buddy</h1>

      {/* Search and Filter Form */}
      {/* Using GET method for simple filtering via URL params */}
      <form method="GET" action="/experiences" className="mb-8 p-4 border rounded-lg bg-card shadow">
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
           {/* Keyword Search */}
           <div className="space-y-1">
             <label htmlFor="query" className="text-sm font-medium">Keyword</label>
            <Input
              id="query"
              name="query"
              placeholder="Search by keyword..."
              defaultValue={searchParams?.query as string || ''}
              className="bg-background"
            />
           </div>

           {/* Location Search */}
           <div className="space-y-1">
              <label htmlFor="location" className="text-sm font-medium">Location</label>
             <Input
               id="location"
               name="location"
               placeholder="Enter city or area"
               defaultValue={searchParams?.location as string || ''}
               className="bg-background"
             />
           </div>

          {/* Category Filter */}
           <div className="space-y-1">
             <label htmlFor="category" className="text-sm font-medium">Category</label>
              {/* Hidden input needed for GET form submission if Select isn't named */}
             {/* <input type="hidden" name="category" value={searchParams?.category || 'all'} /> */}
             <Select name="category" defaultValue={searchParams?.category as string || 'all'}>
                <SelectTrigger id="category" className="bg-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>


          {/* Submit Button */}
          <Button type="submit" className="w-full sm:w-auto btn-subtle-animate">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
           {/* Add More Filters Button (Future) */}
           {/*
           <Button type="button" variant="outline" className="w-full sm:w-auto">
             <SlidersHorizontal className="mr-2 h-4 w-4" /> More Filters
           </Button>
            */}
         </div>
      </form>


      {/* Experiences Grid */}
      {experiences.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">No experiences found matching your criteria.</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

       {/* TODO: Add Pagination */}
    </div>
  );
}
