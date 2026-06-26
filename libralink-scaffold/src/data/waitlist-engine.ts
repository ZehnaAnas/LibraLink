import type { PriorityFactor } from "@/types/data-types";
import { users, bookings, waitlistEntries, MOCK_NOW } from "./mock-data";

/**
 * Returns the current time used for date math.
 * Checks if the actual system time is near our mock dataset time.
 * If not, it uses MOCK_NOW to keep the mock evaluations realistic.
 */
export function getCurrentTime(): number {
  const realNow = Math.floor(Date.now() / 1000);
  // If the system time is in the same ballpark as mock data, use real time.
  // Otherwise, use MOCK_NOW (e.g. for testing).
  return Math.abs(realNow - MOCK_NOW) < 86400 * 30 ? realNow : MOCK_NOW;
}

/**
 * Checks if two Unix timestamps (in seconds) belong to the same calendar week.
 * Week starts on Monday and ends on Sunday.
 */
function getMonday(timestamp: number): number {
  const date = new Date(timestamp * 1000);
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return Math.floor(monday.getTime() / 1000);
}

/**
 * Enforces anti-gaming rules for academic urgency usage:
 * 1. 48-hour cooldown between uses.
 * 2. Maximum of 2 urgent flags per calendar week (resets Monday).
 */
export function canUseUrgency(userId: string): { allowed: boolean; reason?: string } {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return { allowed: false, reason: "User not found." };
  }

  if (user.restricted) {
    return {
      allowed: false,
      reason: "Your account is currently restricted due to overdue items.",
    };
  }

  // Gather all historical urgency timestamps from this user's waitlist entries
  const userEntries = waitlistEntries.filter((entry) => entry.userId === userId);
  const auditTrail = userEntries.flatMap((entry) => entry.urgencyAuditTrail || []);
  
  if (auditTrail.length === 0) {
    return { allowed: true };
  }

  // Sort timestamps ascending
  auditTrail.sort((a, b) => a - b);
  const now = getCurrentTime();

  // 1. Check 48h cooldown
  const latestTimestamp = auditTrail[auditTrail.length - 1];
  const cooldownPeriod = 48 * 3600; // 48 hours in seconds
  if (now - latestTimestamp < cooldownPeriod) {
    const remainingSeconds = cooldownPeriod - (now - latestTimestamp);
    const remainingHours = Math.ceil(remainingSeconds / 3600);
    return {
      allowed: false,
      reason: `Urgent flag has a 48h cooldown. Please wait another ${remainingHours} hours before requesting again.`,
    };
  }

  // 2. Check max 2 urgent flags per calendar week (resetting on Monday)
  const currentMonday = getMonday(now);
  const weeklyUrgentRequests = auditTrail.filter((timestamp) => timestamp >= currentMonday);

  if (weeklyUrgentRequests.length >= 2) {
    return {
      allowed: false,
      reason: "You have used your urgent allocation this week. Resets Monday.",
    };
  }

  return { allowed: true };
}

/**
 * Calculates a deterministic priority score out of 100 based on 4 factors:
 * 1. Account age score (0-25 pts)
 * 2. Academic urgency (0-30 pts, anti-gamed)
 * 3. Booking reliability (0-25 pts)
 * 4. Wait time accumulation (0-20 pts)
 */
export function calculatePriorityScore(
  userId: string,
  resourceId: string
): { total: number; factors: PriorityFactor[] } {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return { total: 0, factors: [] };
  }

  // 1. Account Age Score (0 - 25 pts)
  // Derive deterministically from the user's sequential numeric ID
  const idNum = parseInt(userId.replace(/\D/g, ""), 10) || 100;
  const ageScore = (idNum * 7) % 26; // Resolves to a deterministic integer in range [0, 25]

  const factorAge: PriorityFactor = {
    name: "Account Age",
    score: ageScore,
    maxScore: 25,
    description: "Points awarded based on account registration longevity.",
  };

  // 2. Academic Urgency Score (0 - 30 pts)
  // Check if there is an active waitlist entry for this user + resource, and if they used urgency
  const entry = waitlistEntries.find(
    (w) => w.userId === userId && w.resourceId === resourceId
  );
  const urgencyUsed = entry ? entry.urgencyUsed : false;
  const urgencyScore = urgencyUsed ? 30 : 0;

  const factorUrgency: PriorityFactor = {
    name: "Academic Urgency",
    score: urgencyScore,
    maxScore: 30,
    description: "Priority boost for urgent academic needs.",
  };

  // 3. Booking Reliability Score (0 - 25 pts)
  // Derived from the user's overdueCount and completed booking count
  const userBookings = bookings.filter((b) => b.userId === userId);
  const completedCount = userBookings.filter((b) => b.status === "completed").length;
  const overdueCount = user.overdueCount;
  
  // Starting base of 20, reward completions, penalize overdue counts
  const reliabilityScore = Math.max(
    0,
    Math.min(25, Math.floor(20 + completedCount * 1.5 - overdueCount * 6))
  );

  const factorReliability: PriorityFactor = {
    name: "Booking Reliability",
    score: reliabilityScore,
    maxScore: 25,
    description: "Reflects history of returning resources on time.",
  };

  // 4. Wait Time Accumulation Score (0 - 20 pts)
  // Derived from position in the waitlist queue
  const position = entry ? entry.position : 0;
  // Position 1 has waited the longest -> 20 pts, Position 2 -> 16 pts, etc.
  const waitTimeScore = entry ? Math.max(0, 20 - (position - 1) * 4) : 0;

  const factorWaitTime: PriorityFactor = {
    name: "Wait Time",
    score: waitTimeScore,
    maxScore: 20,
    description: "Points accrued while waiting in the resource queue.",
  };

  const total = ageScore + urgencyScore + reliabilityScore + waitTimeScore;

  return {
    total,
    factors: [factorAge, factorUrgency, factorReliability, factorWaitTime],
  };
}
