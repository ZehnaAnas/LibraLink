import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface WaitlistEntry {
  resourceId: string;
  userId: string;
  [key: string]: unknown;
}

interface WaitlistState {
  // A dictionary mapping resource IDs to an array of waiting students
  queue: Record<string, WaitlistEntry[]>;
  // Adds a student to the waitlist queue for a resource
  addToWaitlist: (entry: WaitlistEntry) => void;
  // Removes a student from the queue when they claim a spot or leave
  removeFromWaitlist: (resourceId: string, userId: string) => void;
}

export const useWaitlistStore = create<WaitlistState>()(
  subscribeWithSelector((set) => ({
    // Initialize our queue database as a blank object
    queue: {},

    addToWaitlist: (entry) =>
      set((state) => {
        const currentQueue = state.queue[entry.resourceId] || [];
        return {
          queue: {
            ...state.queue,
            // Add the new student to the end of the existing list
            [entry.resourceId]: [...currentQueue, entry],
          },
        };
      }),

    removeFromWaitlist: (resourceId, userId) =>
      set((state) => {
        const currentQueue = state.queue[resourceId] || [];
        return {
          queue: {
            ...state.queue,
            // Filter out the student who is leaving the list
            [resourceId]: currentQueue.filter((item) => item.userId !== userId),
          },
        };
      }),
  }))
);