"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Menu, 
  X, 
  Sparkles, 
  User, 
  Settings, 
  LogOut, 
  BarChart3, 
  Upload,
  Zap
} from "lucide-react"
import { LucideIcon } from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon?: LucideIcon
}

interface ModernHeaderProps {
  variant?: "landing" | "dashboard"
}

export function ModernHeader({ variant = "landing" }: ModernHeaderProps) {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
    const navItems: NavItem[] = variant === "landing"
    ? [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/blog", label: "Blog" },
      ]
    : [
        { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/dashboard/upload", label: "Upload", icon: Upload },
      ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "glass shadow-xl backdrop-blur-xl" 
          : "bg-transparent"
      }`}
    >      {/* Navigation Bar */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 lg:h-20">          {/* Logo - Left Section - Fixed Width */}
          <div className="w-64">
            <Link 
              href="/" 
              className="group flex items-center space-x-3 transition-transform duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-accent rounded-full animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gradient-primary">
                  ResumeRise
                </span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  AI-Powered
                </Badge>
              </div>
            </Link>
          </div>{/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-auto">
            <div className="flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-2">
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                    </div>
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-3/4 rounded-full" />
                  </Link>
                )
              })}
            </div>
          </div>          {/* Right Side Actions - Fixed Width */}
          <div className="flex items-center justify-end space-x-4 w-64">            {/* User Actions - Reserve consistent space */}
            <div className="flex items-center space-x-3 min-w-[180px] justify-end">
              {!isMounted || status === "loading" ? (
                // Loading placeholder to prevent layout shift
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-9 bg-muted/50 rounded-md animate-pulse" />
                  <div className="w-24 h-9 bg-muted/50 rounded-md animate-pulse" />
                </div>
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-105 transition-transform">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                          {session.user?.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glass" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {session.user?.name && (
                          <p className="font-medium">{session.user.name}</p>
                        )}
                        {session.user?.email && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 dark:text-red-400"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-sm font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="magnetic-btn bg-gradient-primary text-white shadow-lg hover:shadow-glow">
                      <Zap className="w-4 h-4 mr-2" />
                      Get Started
                    </Button>
                  </Link>                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden ml-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 glass rounded-2xl mt-2 mb-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center px-3 py-2 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {Icon && <Icon className="w-5 h-5 mr-3" />}
                    {item.label}
                  </Link>
                )              })}
              
              {isMounted && status !== "loading" && !session && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full magnetic-btn bg-gradient-primary text-white">
                      <Zap className="w-4 h-4 mr-2" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
