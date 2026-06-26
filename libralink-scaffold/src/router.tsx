import { createBrowserRouter } from "react-router-dom";
import Placeholder from "@/pages/Placeholder";
import Workflow from "@/pages/Workflow";

export const ROUTES = {
  LANDING: "/",
  LOGIN: "/login",
  STUDENT: "/student",
  RESOURCES: "/resources",
  BOOK_ROOM: "/book-room",
  BORROW_DEVICE: "/borrow-device",
  WAITLIST: "/waitlist",
  NOTIFICATIONS: "/notifications",
  OVERDUE: "/overdue",
  STAFF: "/staff",
  ADMIN: "/admin",
  WORKFLOW: "/workflow",
} as const;

export const router = createBrowserRouter([
  { path: ROUTES.LANDING, element: <Placeholder name="Landing" /> },
  { path: ROUTES.LOGIN, element: <Placeholder name="Login" /> },
  { path: ROUTES.STUDENT, element: <Placeholder name="Student Dashboard" /> },
  { path: ROUTES.RESOURCES, element: <Placeholder name="Resources" /> },
  { path: ROUTES.BOOK_ROOM, element: <Placeholder name="Book Room" /> },
  { path: ROUTES.BORROW_DEVICE, element: <Placeholder name="Borrow Device" /> },
  { path: ROUTES.WAITLIST, element: <Placeholder name="Waitlist" /> },
  { path: ROUTES.NOTIFICATIONS, element: <Placeholder name="Notifications" /> },
  { path: ROUTES.OVERDUE, element: <Placeholder name="Overdue" /> },
  { path: ROUTES.STAFF, element: <Placeholder name="Staff Dashboard" /> },
  { path: ROUTES.ADMIN, element: <Placeholder name="Admin Dashboard" /> },
  { path: ROUTES.WORKFLOW, element: <Workflow /> },
]);