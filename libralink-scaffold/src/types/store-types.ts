// Shared data contract shapes for our global application state

export interface Room {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'reserved' | 'occupied' | 'maintenance';
  floor: string;
  version: number;
}

export interface Device {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'loaned' | 'maintenance';
  version: number;
}

export interface Booking {
  id: string;
  userId: string;
  resourceId: string;
  resourceType: 'room' | 'device';
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'overdue' | 'cancelled';
  qrPayload: string;
  version: number;
}

export interface WaitlistEntry {
  id: string;
  userId: string;
  resourceId: string;
  priorityScore: number;
  position: number;
  urgencyUsed: boolean;
  claimWindowExpiry?: number;
}

// LOOK HERE: This is the exact keyword 'Notification' the compiler is crying about!
export interface Notification {
  id: string;
  userId: string;
  type: 'booking_created' | 'overdue' | 'waitlist_advance' | 'conflict';
  message: string;
  read: boolean;
  channels: ('push' | 'sms' | 'email')[];
  timestamp: number;
}

export interface ActivityLog {
  id: string;
  staffId: string;
  action: string;
  resourceId?: string;
  userId?: string;
  timestamp: number;
  note?: string;
}

export interface RealtimeEvent {
  type: 'room_update' | 'booking_created' | 'waitlist_advance' | 'conflict';
  payload: any;
}