"use client"
import { useEffect, useState } from "react"
import DashboardSidebar from "./dashboard-sidebar"
import DashboardContent from "./dashboard-content"
import { SidebarProvider } from "./ui/sidebar"

export type DashboardView = "overview" | "reports" | "programs" | "ai" | "scanner" | "settings"

export default function Dashboard({ initialView = "overview" }: { initialView?: DashboardView }) {
  const [activeView, setActiveView] = useState<DashboardView>(initialView)
  const [globalSearch, setGlobalSearch] = useState("")

  useEffect(() => {
    setActiveView(initialView)
  }, [initialView])

  return (
    <SidebarProvider>
      <DashboardSidebar activeView={activeView} />
      <DashboardContent
        activeView={activeView}
        globalSearch={globalSearch}
        onGlobalSearchChange={setGlobalSearch}
      />
    </SidebarProvider>
  )
}
