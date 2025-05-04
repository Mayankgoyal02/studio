import type { Experience } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Tag, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ExperienceCardProps {
  experience: Experience;
}

// Map category slugs to Lucide icons
const categoryIcons: { [key: string]: React.ElementType } = {
  music: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music-2"><circle cx="8" cy="18" r="4"/><path d="M12 18V2l7 4-7 4"/></svg>, // Using Music2 as Music is taken
  sports: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-basketball"><circle cx="12" cy="12" r="10"/><path d="M7.2 7.2a10 10 0 0 1 9.6 9.6"/><path d="M16.8 7.2a10 10 0 0 0-9.6 9.6"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 22a10 10 0 0 0-10-10"/><path d="M2 12h20"/></svg>, // Using Basketball as example
  travel: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plane"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>,
  food: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>,
  arts: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.477-1.125-.297-.29-.688-.477-1.125-.477-.926 0-1.688.746-1.688 1.688 0 .437.18.835.477 1.125.297.29.688.477 1.125.477C13.27 19.312 12 21.8 12 21.8c-5.5 0-10-4.5-10-10S6.5 2 12 2Z"/><path d="M5.14 5.14a10 10 0 0 0-1.042 8.486"/><path d="M18.86 18.86a10 10 0 0 0 1.042-8.486"/></svg>,
  default: Tag, // Default icon if category not found
};


export function ExperienceCard({ experience }: ExperienceCardProps) {
  const CategoryIcon = categoryIcons[experience.category.toLowerCase()] || categoryIcons.default;

  let formattedDate = 'Invalid Date';
  try {
     formattedDate = format(new Date(experience.date), 'PPP'); // Format date nicely, e.g., "Jun 15, 2024"
  } catch (error) {
    console.error("Error formatting date:", experience.date, error);
    // Keep formattedDate as 'Invalid Date'
  }

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-shadow duration-200 hover:shadow-lg">
      {experience.imageUrl && (
         <div className="relative w-full h-48">
          <Image
            src={experience.imageUrl}
            alt={experience.title}
            fill // Use fill for responsive images within a relative parent
            style={{ objectFit: 'cover' }} // Ensure the image covers the area
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={`${experience.category} event`} // AI Hint for image search
            priority={false} // Don't prioritize images in a list by default
          />
         </div>
      )}
      <CardHeader className="pb-4">
        <CardTitle className="text-lg leading-tight mb-1">{experience.title}</CardTitle>
         <div className="flex items-center text-sm text-muted-foreground mb-2">
          <User className="mr-1.5 h-4 w-4 flex-shrink-0" />
          <span>Hosted by {experience.creatorName}</span>
        </div>
        <CardDescription className="line-clamp-2 text-sm">{experience.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center">
          <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" />
          <span>{experience.time}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
          <span>{experience.location}</span>
        </div>
         <div className="flex items-center pt-1">
          <CategoryIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-primary" />
          <Badge variant="secondary">{experience.category}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full btn-subtle-animate" variant="outline">
          <Link href={`/experiences/${experience.id}`}>
            View Details
          </Link>
        </Button>
         {/* Future: Add "Express Interest" button here */}
      </CardFooter>
    </Card>
  );
}
