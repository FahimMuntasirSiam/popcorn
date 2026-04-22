import Sidebar from "@/components/admin/Sidebar";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-popcorn-dark text-white min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
      <Toaster richColors theme="dark" position="bottom-right" />
    </div>
  );
}
