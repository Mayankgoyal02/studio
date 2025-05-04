'use server';

/**
 * @fileOverview Server Actions for ExperienceBuddy application.
 */

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Experience } from '@/lib/types';
import { _addExperienceInternal, _addAttendeeInternal } from '@/lib/data'; // Internal functions from data store

// Define available categories (consider moving to a shared constants file)
const categories = ['Music', 'Sports', 'Travel', 'Food', 'Arts', 'Other'];

// Schema for experience creation form data *received* by the server action
// Note: Dates arrive as strings from FormData.
const experienceServerActionSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }).max(100),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(500),
  // Expect an ISO 8601 date string (YYYY-MM-DDTHH:mm:ss.sssZ) from the client
  date: z.string().datetime({ message: "Invalid date format. Expected ISO 8601 string." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:MM).' }),
  location: z.string().min(3, { message: 'Location must be at least 3 characters.' }).max(100),
  category: z.string().refine(val => categories.map(c=>c.toLowerCase()).includes(val.toLowerCase()), { message: "Invalid category selected." }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')), // Optional image URL
});


/**
 * Server Action to create a new experience.
 * @param formData - The FormData object from the form submission.
 */
export async function createExperienceAction(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  console.log("Server Action received raw data:", rawData);


  // Validate the raw form data using the server-specific schema
  const validationResult = experienceServerActionSchema.safeParse(rawData);

  if (!validationResult.success) {
    console.error("Server Action Validation Failed:", validationResult.error.flatten().fieldErrors);
    // Return validation errors to the client
    return {
      success: false,
      message: "Invalid data provided. Please check the form.",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  // Data is now validated according to the server schema
  const data = validationResult.data;
  console.log("Server Action validated data:", data);

  try {
    // Attempt to parse the validated date string
    const dateObject = new Date(data.date);

    // Double-check if the date object is valid after parsing
    if (isNaN(dateObject.getTime())) {
        console.error("Server Action: Date parsing resulted in an invalid date:", data.date);
        // This case should ideally be caught by z.string().datetime(), but added as a safeguard
        return {
            success: false,
            message: "Invalid date provided.",
            errors: { date: ["The provided date could not be processed."] },
        };
    }

    // Prepare data for the internal storage function
    const experienceData = {
        ...data,
        // Ensure the date stored is consistently ISO format
        date: dateObject.toISOString(),
        // Ensure empty string becomes undefined for optional fields
        imageUrl: data.imageUrl || undefined,
        // Make category consistent (e.g., Title Case) if desired, depends on how you want to store/display it
        // category: data.category.charAt(0).toUpperCase() + data.category.slice(1).toLowerCase(),
    };


    console.log("Attempting to add experience with data:", experienceData);
    const newExperience = await _addExperienceInternal(experienceData);
    console.log("Successfully added experience, ID:", newExperience.id);

    // Revalidate paths to reflect the newly added experience
    revalidatePath('/experiences');
    revalidatePath('/'); // Revalidate home page as well if it shows featured items

  } catch (error) {
    console.error("Error during experience creation process:", error); // Log the actual underlying error
    // Provide a user-friendly error message for unexpected errors
    return {
        success: false,
        message: "Failed to create experience due to a server error. Please try again later.",
        errors: null // Avoid exposing detailed internal errors to the client
     };
  }

  // Redirect ONLY on successful creation (outside try...catch)
  redirect('/experiences');

  // Note: The redirect technically prevents this return, but it's good practice for type safety
  // return { success: true, message: "Experience created successfully!", errors: null };
}


/**
 * Server Action for a user to express interest in an experience.
 * @param experienceId - The ID of the experience.
 * @param userId - The ID of the user expressing interest (TODO: Get from auth).
 */
export async function expressInterestAction(experienceId: string) {
    // TODO: Replace MOCK_USER_ID_INTEREST with actual user ID from authentication context
    const MOCK_USER_ID_INTEREST = 'mockUserInterest456'; // Example ID

    if (!experienceId) {
        console.error("Express Interest: Missing experienceId");
        // Handle error appropriately, maybe return an error status
        return { success: false, message: "Missing experience ID." };
    }

    try {
        const success = await _addAttendeeInternal(experienceId, MOCK_USER_ID_INTEREST);

        if (success) {
            console.log(`User ${MOCK_USER_ID_INTEREST} expressed interest in ${experienceId}`);
            // Revalidate the specific experience page to show the updated attendee list
            revalidatePath(`/experiences/${experienceId}`);
             // Optionally revalidate the main list if it shows attendee count
             // revalidatePath('/experiences');
            return { success: true, message: "Interest expressed successfully." };
        } else {
             console.error(`Failed to add attendee for experience ${experienceId}`);
             return { success: false, message: "Failed to express interest. Experience might not exist." };
        }
    } catch (error) {
        console.error("Error expressing interest:", error);
         return { success: false, message: "An error occurred while expressing interest." };
    }
}
