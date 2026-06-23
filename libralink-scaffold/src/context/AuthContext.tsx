import { createContext, useState, type ReactNode } from "react";

export type UserRole = "student" | "staff" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  restricted: boolean;
  overdueCount: number;
}

export interface AuthContextValue {
  user: UserProfile;
  role: UserRole;
  darkMode: boolean;
  peakMode: boolean;
  setRole: (role: UserRole) => void;
  toggleDark: () => void;
  togglePeak: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: "USR-193",
  name: "Demo Student",
  email: "demo.student@university.edu",
  role: "student",
  restricted: false,
  overdueCount: 0,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEMO_USER);
  const [darkMode, setDarkMode] = useState(false);
  const [peakMode, setPeakMode] = useState(false);

  const setRole = (role: UserRole) => {
    setUser((prev) => ({ ...prev, role }));
  };

  const toggleDark = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const togglePeak = () => setPeakMode((prev) => !prev);

  const value: AuthContextValue = {
    user,
    role: user.role,
    darkMode,
    peakMode,
    setRole,
    toggleDark,
    togglePeak,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}