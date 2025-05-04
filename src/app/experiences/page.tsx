import { ExperienceCard } from '@/components/ExperienceCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Experience } from '@/lib/types';
import { Search } from 'lucide-react';
import { getAllExperiences } from '@/lib/data'; // Import from data store
import { redirect } from 'next/navigation'; // Import redirect for server action


// Define available categories for filtering
const categories = ['All', 'Music', 'Sports', 'Travel', 'Food', 'Arts', 'Other'];


// Server component to fetch and display experiences
export default async function ExperiencesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

  // Fetch all experiences initially
  const allExperiences = await getAllExperiences();

  // Apply filtering based on searchParams
  const query = searchParams?.query as string | undefined;
  const category = searchParams?.category as string | undefined;
  const location = searchParams?.location as string | undefined;

  let filteredExperiences = allExperiences;

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


  // Server action to handle form submission and redirect with query params
  async function handleSearch(formData: FormData) {
    'use server';
    const query = formData.get('query') as string || '';
    const category = formData.get('category') as string || 'all';
    const location = formData.get('location') as string || '';

    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (category && category !== 'all') params.set('category', category);
    if (location) params.set('location', location);

    // Redirect with the new search parameters
    redirect(`/experiences?${params.toString()}`);
  }


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center">Find Your Next Experience Buddy</h1>

      {/* Search and Filter Form - Use the server action */}
      <form action={handleSearch} className="mb-8 p-4 border rounded-lg bg-card shadow-sm">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
           {/* Keyword Search */}
           <div className="space-y-1 col-span-1 sm:col-span-2 lg:col-span-1">
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
             <Select name="category" defaultValue={searchParams?.category as string || 'all'}>
                <SelectTrigger id="category" className="bg-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                     // Use lowercase value for consistency
                    <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>


          {/* Submit Button */}
          <Button type="submit" className="w-full sm:w-auto btn-subtle-animate col-span-1 sm:col-span-2 lg:col-span-1">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
         </div>
      </form>


      {/* Experiences Grid */}
      {filteredExperiences.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredExperiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">No experiences found matching your criteria.</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

       {/* TODO: Add Pagination if the list grows large */}
    </div>
  );
}
