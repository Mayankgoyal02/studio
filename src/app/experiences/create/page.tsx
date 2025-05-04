'use client'; // Required for form handling with react-hook-form

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

// Define available categories
const categories = ['Music', 'Sports', 'Travel', 'Food', 'Arts', 'Other'];

// Define Zod schema for form validation
const experienceFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }).max(100),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(500),
  date: z.date({ required_error: 'A date for the experience is required.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:MM).' }), // HH:MM format
  location: z.string().min(3, { message: 'Location must be at least 3 characters.' }).max(100),
  category: z.string({ required_error: 'Please select a category.' }).refine(val => categories.includes(val), { message: "Invalid category selected." }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')), // Optional image URL
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

// TODO: Replace with actual user ID from authentication
const MOCK_USER_ID = 'mockUser123';
const MOCK_USER_NAME = 'Current User'; // Replace with actual username

export default function CreateExperiencePage() {
  const { toast } = useToast();
   const router = useRouter();
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      time: '19:00', // Default time example
      location: '',
      category: undefined,
      imageUrl: '',
      // date will be set by the Calendar component
    },
    mode: 'onChange', // Validate on change
  });

  // TODO: Implement actual submission logic (e.g., call an API endpoint or Server Action)
  async function onSubmit(data: ExperienceFormValues) {
     console.log("Submitting data:", data);

     // Simulate API call / Server Action
     await new Promise(resolve => setTimeout(resolve, 1000));

     // Construct the new experience object (basic example)
     const newExperience = {
         id: Date.now().toString(), // Temporary ID generation
         ...data,
         date: data.date.toISOString(), // Convert date to string for storage/API
         creatorId: MOCK_USER_ID,
         creatorName: MOCK_USER_NAME,
         attendees: [],
     };

     console.log("Simulated new experience:", newExperience);

    toast({
      title: 'Experience Created!',
      description: `"${data.title}" has been listed.`,
      variant: 'default', // Use 'default' or omit for standard toast
    });

    // Redirect to the newly created experience page (or the main list)
    // router.push(`/experiences/${newExperience.id}`); // Ideal redirect
     router.push('/experiences'); // Redirect to list for now
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center">Create a New Experience</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Hiking Trip to Bear Mountain" {...field} />
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">Give your experience a catchy title.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell potential buddies more about the experience..."
                    className="resize-y min-h-[100px] sm:min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">Include details like what to expect, what to bring, etc.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
             {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                   <FormDescription className="text-xs sm:text-sm">When is it happening?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             {/* Time */}
            <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Time (HH:MM)</FormLabel>
                    <FormControl>
                    <Input type="time" placeholder="e.g., 19:00" {...field} />
                    </FormControl>
                     <FormDescription className="text-xs sm:text-sm">What time does it start?</FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>


          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Central Park, NYC or Online" {...field} />
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">Where will the experience take place?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 <FormDescription className="text-xs sm:text-sm">Help others find your experience.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

           {/* Image URL (Optional) */}
           <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">Add an image link to make your listing stand out.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Submit Button */}
          <Button type="submit" className="w-full btn-subtle-animate" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating...' : 'Create Experience'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
