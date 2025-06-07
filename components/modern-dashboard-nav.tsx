"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LayoutDashboard,
  Upload,
  FileText,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  Star
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const navigationItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Dashboard overview"
  },  {
    title: "Upload Resume",
    href: "/dashboard/upload",
    icon: Upload,
    description: "Upload new resume",
    badge: "New"
  },
  {
    title: "My Resumes",
    href: "/dashboard/resumes",
    icon: FileText,
    description: "Manage your resumes"
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Account settings"
  }
]

const quickStats = [
  { label: "Resumes Analyzed", value: "12", icon: FileText },
  { label: "Avg ATS Score", value: "87%", icon: TrendingUp },
  { label: "Interviews", value: "5", icon: Users },
]

export function ModernDashboardNav() {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="glass rounded-2xl p-6 border border-border/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Welcome back!</h2>
              <p className="text-sm text-muted-foreground">Ready to optimize your career?</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="space-y-3">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <span className="text-sm font-bold text-primary">{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Navigation
        </h3>
        
        {navigationItems.map((item, index) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`group relative flex items-center p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Content */}
                <div className="relative flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-white/20" 
                      : "bg-muted/50 group-hover:bg-muted"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-xs transition-colors ${
                      isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Hover effect */}
                {hoveredItem === item.href && !isActive && (
                  <motion.div
                    layoutId="hoverTab"
                    className="absolute inset-0 bg-muted/50 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Upgrade Section */}
      <div className="mt-8">
        <div className="glass rounded-2xl p-6 border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Upgrade to Pro</h3>
              <p className="text-xs text-muted-foreground">Unlock advanced features</p>
            </div>
          </div>
          
          <Button className="w-full" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  )
}
