export type ResourceStatus = "available" | "booked" | "maintenance" | "occupied";

export type BookingStatus = "active" | "completed" | "overdue" | "pending" | "cancelled";

export interface Room {
  id: string; // USR-, RM-, DV-, B-, D- prefixes (RM-A101)
  name: string;
  capacity: number;
  floor: number;
  status: ResourceStatus;
  version: number;
}

export interface Device {
  id: string; // DV-LP-01
  name: string;
  category: "laptop" | "charger" | "camera";
  status: ResourceStatus;
  version: number;
}

export interface User {
  id: string; // USR-193
  name: string;
  email: string;
  role: "student" | "staff" | "admin";
  restricted: boolean;
  overdueCount: number;
  bookingHistory: string[]; // Array of Booking IDs
}

export interface Booking {
  id: string; // B-7483
  userId: string;
  resourceId: string;
  resourceType: string; // "room" | "device"
  startTime: number; // Unix timestamp in seconds
  endTime: number; // Unix timestamp in seconds
  status: BookingStatus;
  qrPayload: string; // LBK:<bookingId>:<userId>:<resourceId>:<unixTimestamp>
  version: number;
}

export interface WaitlistEntry {
  id: string; // W- or similar (e.g. B-, USR-, etc. prefixes)
  userId: string;
  resourceId: string;
  priorityScore: number;
  position: number;
  urgencyUsed: boolean;
  urgencyAuditTrail: number[]; // Array of Unix timestamps of urgent requests
  claimWindowExpiry?: number; // Unix timestamp in seconds
}

export interface PriorityFactor {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

// Function signatures
export type CanUseUrgency = (userId: string) => {
  allowed: boolean;
  reason?: string;
};

export type CalculatePriorityScore = (
  userId: string,
  resourceId: string
) => {
  total: number;
  factors: PriorityFactor[];
};

export interface Notification {
  id: string; // N- or D- or similar
  userId: string;
  type: "booking_created" | "overdue" | "waitlist_advance" | "conflict";
  message: string;
  read: boolean;
  channels: ("push" | "sms" | "email")[];
  timestamp: number; // Unix timestamp in seconds
}

export interface ActivityLog {
  id: string; // ACT- or D- or similar
  staffId: string;
  action: string;
  resourceId?: string;
  userId?: string;
  timestamp: number; // Unix timestamp in seconds
  note?: string;
}

