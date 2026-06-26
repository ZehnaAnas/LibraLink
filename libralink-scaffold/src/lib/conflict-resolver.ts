// We keep this as a normal import because useNotificationStore is actual working code logic
import { useNotificationStore } from '../stores/notificationStore';

type Room = {
  version: number;
  name: string;
};

type Notification = Parameters<
  ReturnType<typeof useNotificationStore.getState>['addNotification']
>[0];

export const resolveBookingConflict = (
  currentRoom: Room,
  requestedVersion: number,
  userId: string
): boolean => {
  if (currentRoom.version !== requestedVersion) {
    
    // We explicitly label this variable as a 'Notification' type.
    // This uses contextual typing, telling TypeScript that the channels array is mutable!
    const conflictAlert: Notification = {
      id: `err-${Date.now()}`,
      userId: userId,
      type: 'conflict',
      message: `Booking failed for ${currentRoom.name}: Content was updated by another session.`,
      read: false,
      channels: ['push'], // We removed 'as const' so it matches the mutable type perfectly!
      timestamp: Date.now(),
    };

    useNotificationStore.getState().addNotification(conflictAlert);
    return false;
  }

  return true;
};