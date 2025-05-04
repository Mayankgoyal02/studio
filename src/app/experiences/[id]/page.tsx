import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Experience } from '@/lib/types';
import { Calendar, Clock, MapPin, Tag, User, Users, MessageSquarePlus } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

// TODO: Replace with actual data fetching logic by ID
async function getExperienceById(id: string): Promise<Experience | null> {
  // Simulate fetching data
   const allExperiences: Experience[] = [
    {
      id: '1',
      title: 'Summer Music Fest',
      description: 'Looking for someone to join me at the annual Summer Music Fest. Great bands, good vibes! Pack light, bring sunscreen, and be ready to dance. We can meet near the main entrance.',
      date: '2024-07-20T00:00:00Z',
      time: '14:00',
      location: 'Central Park',
      category: 'Music',
      imageUrl: 'https://picsum.photos/seed/musicfest/800/500',
      creatorId: 'user123',
      creatorName: 'Alex',
      attendees: ['user456', 'user789'], // Example attendees
    },
    {
      id: '2',
      title: 'Weekend Hiking Trip',
      description: 'Planning a scenic hike this weekend. Approximately 5 miles, moderate difficulty. Need a buddy who enjoys nature and a good walk. Bring water and snacks. Meet at the trailhead parking lot.',
      date: '2024-07-13T00:00:00Z',
      time: '09:00',
      location: 'Mountain View Trail',
      category: 'Sports',
      imageUrl: 'https://picsum.photos/seed/hiking/800/500',
      creatorId: 'user456',
      creatorName: 'Sam',
      attendees: ['user789'],
    },
     {
      id: '3',
      title: 'New Italian Restaurant Opening',
      description: 'Want to check out the new Italian place downtown? Heard great things about their pasta. Looking for a fellow foodie! Let\'s meet there.',
      date: '2024-07-18T00:00:00Z',
      time: '19:30',
      location: 'Downtown Eats',
      category: 'Food',
      imageUrl: 'https://picsum.photos/seed/foodie/800/500',
      creatorId: 'user101',
      creatorName: 'Chloe',
      attendees: [],
    },
    {
      id: '4',
      title: 'Art Gallery Visit',
      description: 'Exploring the modern art gallery next Saturday. Features contemporary artists. Anyone interested in joining? We can grab coffee afterwards.',
      date: '2024-07-27T00:00:00Z',
      time: '11:00',
      location: 'City Art Gallery',
      category: 'Arts',
      imageUrl: 'https://picsum.photos/seed/artgallery/800/500',
      creatorId: 'user555',
      creatorName: 'Maria',
      attendees: ['user123'],
    },
     {
      id: '5',
      title: 'Travel Buddy for Europe Trip',
      description: 'Planning a 2-week backpacking trip through Europe in August. Itinerary includes Paris, Rome, and Berlin. Seeking a travel companion to share costs and experiences.',
      date: '2024-08-05T00:00:00Z', // Represents start date
      time: 'N/A',
      location: 'Europe (Multiple)',
      category: 'Travel',
      imageUrl: 'https://picsum.photos/seed/europetrip/800/500',
      creatorId: 'user999',
      creatorName: 'Ben',
      attendees: [],
    },
  ];

  const experience = allExperiences.find(exp => exp.id === id);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return experience || null;
}

// Map category slugs to Lucide icons (copied from ExperienceCard, consider centralizing)
const categoryIcons: { [key: string]: React.ElementType } = {
  music: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music-2"><circle cx="8" cy="18" r="4"/><path d="M12 18V2l7 4-7 4"/></svg>, // Using Music2 as Music is taken
  sports: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-basketball"><circle cx="12" cy="12" r="10"/><path d="M7.2 7.2a10 10 0 0 1 9.6 9.6"/><path d="M16.8 7.2a10 10 0 0 0-9.6 9.6"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 22a10 10 0 0 0-10-10"/><path d="M2 12h20"/></svg>, // Using Basketball as example
  travel: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plane"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>,
  food: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>,
  arts: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.477-1.125-.297-.29-.688-.477-1.125-.477-.926 0-1.688.746-1.688 1.688 0 .437.18.835.477 1.125.297.29.688.477 1.125.477C13.27 19.312 12 21.8 12 21.8c-5.5 0-10-4.5-10-10S6.5 2 12 2Z"/><path d="M5.14 5.14a10 10 0 0 0-1.042 8.486"/><path d="M18.86 18.86a10 10 0 0 0 1.042-8.486"/></svg>,
  default: Tag,
};


// Server component to handle fetching and display
export default async function ExperienceDetailPage({ params }: { params: { id: string } }) {
  const experience = await getExperienceById(params.id);

  if (!experience) {
    notFound(); // Trigger 404 page if experience not found
  }

  const CategoryIcon = categoryIcons[experience.category.toLowerCase()] || categoryIcons.default;

   let formattedDate = 'Invalid Date';
   try {
     formattedDate = format(new Date(experience.date), 'PPPP'); // e.g., Tuesday, June 15th, 2024
   } catch (error) {
      console.error("Error formatting date:", experience.date, error);
   }

  // TODO: Implement a server action for expressing interest
  async function expressInterest() {
    'use server';
    // Placeholder for logic:
    // 1. Check if user is logged in
    // 2. Check if user is already an attendee or the creator
    // 3. Add user ID to the experience's attendees list in the database
    // 4. Maybe send a notification to the creator
    console.log(`User expressed interest in experience ${params.id}`);
    // Revalidate data if necessary
    // redirect or show a success message (via client component or toast)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

         {/* Left Column (Image & Actions) */}
        <div className="md:col-span-1 space-y-6">
          {experience.imageUrl && (
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-md">
              <Image
                src={experience.imageUrl}
                alt={experience.title}
                fill
                 style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 33vw"
                 data-ai-hint={`${experience.category} event detail`}
                 priority // Prioritize the main image on the detail page
              />
            </div>
          )}
           {/* Actions Card */}
           <Card>
              <CardHeader>
                  <CardTitle className="text-lg">Interested in joining?</CardTitle>
              </CardHeader>
              <CardContent>
                  {/*
                    This button needs to be in a Client Component or use a form
                    with the server action for progressive enhancement.
                    Let's use a form for now.
                   */}
                 <form action={expressInterest}>
                     <Button type="submit" className="w-full btn-subtle-animate bg-accent text-accent-foreground hover:bg-accent/90">
                        <MessageSquarePlus className="mr-2 h-5 w-5" /> Express Interest
                    </Button>
                 </form>
                  <p className="text-xs text-muted-foreground mt-2 text-center">Let the host know you'd like to join!</p>
              </CardContent>
           </Card>

           {/* Attendees Card (Optional) */}
           {experience.attendees && experience.attendees.length > 0 && (
             <Card>
               <CardHeader>
                 <CardTitle className="text-lg flex items-center">
                   <Users className="mr-2 h-5 w-5 text-primary" />
                   Buddies Interested ({experience.attendees.length})
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <ul className="space-y-2 text-sm text-muted-foreground">
                   {/* TODO: Fetch actual attendee names/profiles */}
                   {experience.attendees.map((attendeeId) => (
                     <li key={attendeeId} className="flex items-center">
                        <User className="mr-2 h-4 w-4" /> User {attendeeId.substring(0, 4)}...
                     </li>
                   ))}
                 </ul>
               </CardContent>
             </Card>
           )}

         </div>

         {/* Right Column (Details) */}
         <div className="md:col-span-2 space-y-6">
           {/* Title and Meta */}
           <div className="border-b pb-4 mb-6">
             <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{experience.title}</h1>
              <div className="flex items-center text-md text-muted-foreground mb-3">
                <User className="mr-1.5 h-5 w-5 flex-shrink-0" />
                <span>Hosted by <span className="font-medium text-foreground">{experience.creatorName}</span></span>
             </div>
              <div className="flex items-center">
                  <CategoryIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <Badge variant="secondary" className="text-sm">{experience.category}</Badge>
             </div>
           </div>


           {/* Details Card */}
            <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Details</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4 text-base">
                    <div className="flex items-start">
                      <Calendar className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
                      <div>
                        <span className="font-medium">Date:</span> {formattedDate}
                     </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
                      <div>
                         <span className="font-medium">Time:</span> {experience.time}
                      </div>
                    </div>
                     <div className="flex items-start">
                      <MapPin className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
                      <div>
                         <span className="font-medium">Location:</span> {experience.location}
                      </div>
                    </div>
                 </CardContent>
            </Card>

            {/* Description Card */}
             <Card>
                <CardHeader>
                    <CardTitle className="text-xl">About this Experience</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Use whitespace-pre-wrap to respect newlines in the description */}
                    <p className="text-base text-foreground whitespace-pre-wrap">{experience.description}</p>
                </CardContent>
             </Card>

           {/* Back Button */}
           <div className="mt-8">
             <Button variant="outline" asChild>
               <Link href="/experiences">← Back to Experiences</Link>
             </Button>
           </div>

         </div>
       </div>
    </div>
  );
}

// Optional: Generate static paths if you have a known set of experiences
// export async function generateStaticParams() {
//   // Fetch all experience IDs
//   const experiences = await getAllExperienceIds(); // Implement this function
//   return experiences.map((exp) => ({
//     id: exp.id,
//   }));
// }
