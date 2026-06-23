import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { router } from "@/router";

export default function App() {
  return (
    <AuthProvider>
      <div id="toast-container" className="fixed top-4 right-4 z-50" />
      {/* PeakModeBanner placeholder — Role 3 wires the real one in later */}
      <RouterProvider router={router} />
    </AuthProvider>
  );
}