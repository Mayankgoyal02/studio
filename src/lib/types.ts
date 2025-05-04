export interface Experience {
  id: string;
  title: string;
  description: string;
  date: string; // Store as ISO string or Timestamp? ISO for simplicity first.
  time: string; // e.g., "19:00"
  location: string; // Simple text for now
  category: string; // e.g., "Music", "Sports", "Travel", "Food", "Arts"
  imageUrl?: string; // Optional image URL
  creatorId: string; // ID of the user who created the experience
  creatorName: string; // Name of the creator for display
  attendees: string[]; // List of user IDs interested/attending
}
