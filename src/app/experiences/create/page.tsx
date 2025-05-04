'use client'; // Required for form handling with react-hook-form

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldErrors } from 'react-hook-form';
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
import { createExperienceAction } from '@/app/actions'; // Import the server action
import { useState } from 'react'; // Import useState for loading state

// Define available categories (consider moving to a shared constants file)
const categories = ['Music', 'Sports', 'Travel', 'Food', 'Arts', 'Other'];

// Define Zod schema for *client-side* form validation
const experienceFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }).max(100),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(500),
  // Use z.date() for client-side calendar interaction
  date: z.date({ required_error: 'A date for the experience is required.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:MM).' }), // HH:MM format
  location: z.string().min(3, { message: 'Location must be at least 3 characters.' }).max(100),
  // Use the full category name for selection, ensure it's one of the valid options
  category: z.string({ required_error: 'Please select a category.' }).refine(val => categories.includes(val), { message: "Invalid category selected." }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')), // Optional image URL
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

export default function CreateExperiencePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false); // Local loading state

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      time: '19:00', // Default time example
      location: '',
      category: undefined,
      imageUrl: '',
      date: undefined, // Date is initially undefined
    },
    mode: 'onChange', // Validate on change
  });

  // Handle form submission using the server action
  async function onSubmit(data: ExperienceFormValues) {
    setIsSubmitting(true); // Set loading state
    form.clearErrors(); // Clear previous errors

    // Create FormData to send to the server action
    const formData = new FormData();

    // Iterate over validated data and append to FormData
    Object.entries(data).forEach(([key, value]) => {
       if (key === 'date' && value instanceof Date) {
            // Convert the Date object to an ISO string (UTC) for the server action
            formData.append(key, value.toISOString());
       } else if (key === 'category' && typeof value === 'string'){
            // Send category value as is (e.g., "Music")
            formData.append(key, value);
        } else if (value !== undefined && value !== null) {
           // Append other values as strings
           formData.append(key, String(value));
       }
    });

     console.log("Client: Submitting form data:", Object.fromEntries(formData.entries()));


    try {
      // Call the server action
      const result = await createExperienceAction(formData);
      console.log("Client: Received result from server action:", result);

      // Server action handles successful redirection via throwing a redirect error.
      // This error is handled by the Next.js framework itself.
      // We only handle explicit non-success results returned from the action here.
      if (result && !result.success) {
         toast({
           title: 'Error Creating Experience',
           description: result.message || 'Please check the form for errors.',
           variant: 'destructive',
         });

         // Map server-side validation errors back to form fields
         if (result.errors) {
            Object.entries(result.errors).forEach(([field, messages]) => {
                // Ensure field exists in the form schema before setting error
                if (field in form.getValues()) {
                    form.setError(field as keyof ExperienceFormValues, {
                        type: 'server',
                        message: messages?.join(', ') // Join multiple error messages if any
                    });
                } else {
                    console.warn(`Server returned error for unknown field: ${field}`);
                }
            });
         }
      }
      // If the action was successful and redirected, the framework handles it,
      // and code execution might not reach here if the redirect is immediate.
      // If the action was successful but didn't redirect (which it should),
      // we might want a success toast here, but currently, the action redirects.

    } catch (error) {
      // Catch *unexpected* errors during action execution.
      // Redirect errors thrown by `redirect()` in the server action are
      // handled by the Next.js framework and should not reach this catch block.
      console.error("Client: Unexpected error during form submission:", error);
      toast({
        title: 'An Unexpected Error Occurred',
        description: 'Could not create experience. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false); // Reset loading state regardless of outcome
    }
  }

  // Helper function to handle potential server-side errors on the form
  // Note: This might be redundant now if server errors are set directly in onSubmit
  const handleServerErrors = (errors: FieldErrors<ExperienceFormValues> | null | undefined) => {
      if (!errors) return;
      Object.entries(errors).forEach(([field, errorArray]) => {
         const fieldName = field as keyof ExperienceFormValues;
         if (form.getValues(fieldName) !== undefined && errorArray && errorArray.length > 0) {
           form.setError(fieldName, { type: 'server', message: errorArray[0] });
         }
      });
  };


  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center">Create a New Experience</h1>
      <Form {...form}>
        {/* Update form tag to use the onSubmit handler */}
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
                            'w-full pl-3 text-left font-normal justify-start', // Ensure text alignment
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP') // 'PPP' -> Oct 20, 2023
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
                        onSelect={(date) => {
                           field.onChange(date); // Update form state
                           console.log("Date selected:", date?.toISOString()); // Log the ISO string
                        }}
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
                       // Use the full category name as the value
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
                  {/* Ensure field value is handled correctly (might be null/undefined initially) */}
                  <Input placeholder="https://example.com/image.jpg" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">Add an image link to make your listing stand out.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Submit Button */}
          {/* Disable button while submitting */}
          <Button type="submit" className="w-full btn-subtle-animate" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Experience'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
