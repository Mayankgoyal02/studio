'use server';

/**
 * @fileOverview Server Actions for ExperienceBuddy application.
 */

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Experience } from '@/lib/types';
import { _addExperienceInternal, _addAttendeeInternal } from '@/lib/data'; // Internal functions from data store

// Schema for experience creation form (must match client-side validation)
// Note: Date is received as string from FormData, needs transformation if needed by backend
const experienceFormSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(500),
  date: z.string(), // Date comes as string from form data, handle potential conversion if necessary
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  location: z.string().min(3).max(100),
  category: z.string(), // Add validation if using a predefined list
  imageUrl: z.string().url().optional().or(z.literal('')),
});


/**
 * Server Action to create a new experience.
 * @param formData - The FormData object from the form submission.
 */
export async function createExperienceAction(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());

  // Validate the raw form data.
  const validationResult = experienceFormSchema.safeParse(rawData);

  if (!validationResult.success) {
    console.error("Server Action Validation Failed:", validationResult.error.flatten().fieldErrors);
    // TODO: Implement better error handling to return errors to the form
    return {
      success: false,
      message: "Invalid data provided.",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const data = validationResult.data;

  try {
    // Prepare data for the internal function (convert date string to ISO string if needed, depends on storage)
    // Assuming the Calendar component provides a value that can be parsed into a Date
    const dateObject = new Date(data.date);
    const experienceData = {
        ...data,
        date: dateObject.toISOString(), // Store as ISO string
        imageUrl: data.imageUrl || undefined, // Ensure empty string becomes undefined
    };


    // Call the internal function to add to the "database"
    const newExperience = await _addExperienceInternal(experienceData);

    // Revalidate the path to show the new experience in the list
    revalidatePath('/experiences');
    // Optionally revalidate the home page if it shows experiences
    // revalidatePath('/');

  } catch (error) {
    console.error("Error creating experience:", error);
    return {
        success: false,
        message: "Failed to create experience.",
        errors: null
     };
  }

  // Redirect to the experiences list page after successful creation
  // This must be called *outside* the try...catch block
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
