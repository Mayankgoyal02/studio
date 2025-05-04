'use server';
/**
 * @fileOverview In-memory data store and access functions for experiences.
 * Simulates a database for demonstration purposes. Data resets on server restart.
 */

import type { Experience } from './types';

// Initial mock data - acts as our "database"
let experiencesStore: Experience[] = [
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

/**
 * Retrieves all experiences from the store.
 * Simulates an async database call.
 */
export async function getAllExperiences(): Promise<Experience[]> {
  console.log('getAllExperiences called. Returning:', experiencesStore.length, 'experiences');
  // Simulate async delay
  await new Promise(resolve => setTimeout(resolve, 50));
  // Return a copy to prevent direct modification of the store
  return [...experiencesStore];
}

/**
 * Retrieves a single experience by its ID.
 * Simulates an async database call.
 */
export async function getExperienceById(id: string): Promise<Experience | null> {
   // Simulate async delay
  await new Promise(resolve => setTimeout(resolve, 50));
  const experience = experiencesStore.find(exp => exp.id === id);
  return experience ? { ...experience } : null; // Return a copy
}


// TODO: Replace with actual user ID from authentication
const MOCK_USER_ID = 'mockUser123';
const MOCK_USER_NAME = 'Current User'; // Replace with actual username


/**
 * Adds a new experience to the store. ONLY intended to be called from Server Actions.
 * Simulates an async database write.
 * @param experienceData - The data for the new experience, excluding ID, attendees, creatorId, creatorName.
 * @returns The newly created experience object with generated fields.
 */
export async function _addExperienceInternal(
    experienceData: Omit<Experience, 'id' | 'attendees' | 'creatorId' | 'creatorName'>
): Promise<Experience> {
    console.log('_addExperienceInternal called with data:', experienceData);
    // Simulate async delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const newExperience: Experience = {
        id: Date.now().toString(), // Simple unique ID generation
        ...experienceData,
        creatorId: MOCK_USER_ID, // Use mock user ID
        creatorName: MOCK_USER_NAME, // Use mock user name
        attendees: [], // Start with no attendees
    };

    experiencesStore.unshift(newExperience); // Add to the beginning of the array
    console.log('Added new experience:', newExperience);
    console.log('Current store size:', experiencesStore.length);
    console.log('Current store content:', experiencesStore); // Log entire store after adding
    return { ...newExperience }; // Return a copy
}

/**
 * Simulates adding a user to the attendees list of an experience.
 * ONLY intended to be called from Server Actions.
 * @param experienceId The ID of the experience.
 * @param userId The ID of the user expressing interest.
 * @returns boolean indicating success or failure (e.g., experience not found).
 */
export async function _addAttendeeInternal(experienceId: string, userId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay

    const experienceIndex = experiencesStore.findIndex(exp => exp.id === experienceId);

    if (experienceIndex === -1) {
        console.error(`Experience with ID ${experienceId} not found.`);
        return false;
    }

    const experience = experiencesStore[experienceIndex];

    // Prevent creator from attending their own event or duplicates
    if (experience.creatorId === userId || experience.attendees.includes(userId)) {
        console.log(`User ${userId} is already creator or attendee for experience ${experienceId}.`);
        // Still return true as the desired state (user is associated) is met
        return true;
    }

    // Create a new object with the updated attendees list
    const updatedExperience = {
        ...experience,
        attendees: [...experience.attendees, userId],
    };

    // Replace the old experience object with the updated one
    experiencesStore[experienceIndex] = updatedExperience;

    console.log(`User ${userId} added as attendee for experience ${experienceId}. New attendees:`, updatedExperience.attendees);
    return true;
}
