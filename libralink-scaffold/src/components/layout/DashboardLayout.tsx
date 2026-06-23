import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4 hidden md:block">{/* Sidebar slot — Role 3 */}</aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b px-4 flex items-center">{/* Topbar slot — Role 3 */}</header>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}