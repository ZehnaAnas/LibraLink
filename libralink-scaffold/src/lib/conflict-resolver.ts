import { useNotificationStore } from "../stores/notificationStore";
import type { Notification } from "@/types/data-types";

type Room = {
  version: number;
  name: string;
};

export const resolveBookingConflict = (
  currentRoom: Room,
  requestedVersion: number,
  userId: string
): boolean => {
  if (currentRoom.version !== requestedVersion) {
    const conflictAlert: Notification = {
      id: `err-${Date.now()}`,
      userId: userId,
      type: "conflict",
      message: `Booking failed for ${currentRoom.name}: Content was updated by another session.`,
      read: false,
      channels: ["push"],
      timestamp: Math.floor(Date.now() / 1000), // Adjusted to Unix timestamp in seconds
    };

    useNotificationStore.getState().addNotification(conflictAlert);
    return false;
  }

  return true;
};
