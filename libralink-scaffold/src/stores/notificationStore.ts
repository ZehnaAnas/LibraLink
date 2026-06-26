import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Notification } from '../types/store-types';

interface NotificationState {
  notifications: Notification[];
  activeToasts: Notification[];
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>()(
  subscribeWithSelector((set) => ({
    notifications: [],
    activeToasts: [],

    addNotification: (notification) =>
      set((state) => {
        const updatedNotifications = [notification, ...state.notifications];
        const updatedToasts = [...state.activeToasts, notification];

        if (updatedToasts.length > 3) {
          updatedToasts.shift();
        }

        return {
          notifications: updatedNotifications,
          activeToasts: updatedToasts,
        };
      }),
  }))
);