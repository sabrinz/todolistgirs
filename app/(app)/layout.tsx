import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Topbar } from "@/components/layout/topbar"
import { ThemeProvider } from "@/components/layout/theme-provider"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--tdp-bg)" }}>
      <ThemeProvider />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-4 pb-28 md:p-6 md:pb-6">{children}</main>
      </div>
      <BottomNav />
    </div>
  )
}