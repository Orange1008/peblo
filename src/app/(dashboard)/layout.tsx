import { Sidebar } from "@/components/Sidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { NotesProvider } from "@/lib/notes-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotesProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <TopNavbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 lg:pb-6 scroll-smooth">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </NotesProvider>
  );
}
