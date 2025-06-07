import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ModernHeader } from "@/components/modern-header"
import { ModernDashboardNav } from "@/components/modern-dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Modern Header */}
      <ModernHeader variant="dashboard" />
      
      {/* Main Dashboard Container */}
      <div className="flex-1 flex pt-20">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:flex w-72 flex-col bg-background/50 backdrop-blur-xl border-r border-border/50">
          <ModernDashboardNav />
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
