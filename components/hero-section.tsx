"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Sparkles, 
  FileCheck, 
  BarChart3, 
  Target, 
  Zap,
  CheckCircle,
  TrendingUp,
  Shield,
  Brain,
  Star
} from "lucide-react"

export function HeroSection() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const features = [
    { icon: FileCheck, text: "ATS-Optimized Analysis", color: "text-blue-500" },
    { icon: Brain, text: "AI-Powered Insights", color: "text-purple-500" },
    { icon: Target, text: "Industry Targeting", color: "text-green-500" },
    { icon: TrendingUp, text: "Performance Tracking", color: "text-orange-500" },
  ]

  const stats = [
    { value: "98%", label: "Success Rate", icon: CheckCircle },
    { value: "50K+", label: "Resumes Analyzed", icon: FileCheck },
    { value: "2.5x", label: "More Interviews", icon: TrendingUp },
    { value: "24/7", label: "AI Analysis", icon: Brain },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 pt-16 lg:pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-float" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-accent rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-3/4 w-32 h-32 bg-gradient-secondary rounded-full blur-2xl opacity-15 animate-float" style={{ animationDelay: "4s" }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,hsl(var(--muted))_50%,transparent_100%)] opacity-5" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,hsl(var(--muted))_50%,transparent_100%)] opacity-5" />
        </div>

        {/* Mouse follower gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-5 pointer-events-none transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-6 px-4 py-2 glass hover:shadow-glow transition-all duration-300">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-gradient-primary font-semibold">AI-Powered Resume Analysis</span>
              <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </Badge>
          </div>

          {/* Main Headline */}
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="block text-foreground">Transform Your</span>
              <span className="block text-gradient-primary">Resume Into</span>
              <span className="block text-foreground">Interview Gold</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Get your resume past ATS systems and into hiring managers' hands. 
              <span className="text-gradient-secondary font-semibold"> Our AI analyzes, optimizes, and transforms </span>
              your resume for maximum impact.
            </p>
          </div>

          {/* Dynamic Feature Display */}
          <div className="animate-scale-in mb-8" style={{ animationDelay: "0.6s" }}>
            <div className="inline-flex items-center space-x-3 glass rounded-2xl px-6 py-4 shadow-glow">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 transition-all duration-500 ${
                      index === currentFeature 
                        ? `${feature.color} scale-110` 
                        : "text-muted-foreground scale-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {index === currentFeature && (
                      <span className="text-sm font-medium">{feature.text}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="animate-scale-in flex flex-col sm:flex-row gap-4 justify-center mb-12" style={{ animationDelay: "0.8s" }}>
            <Link href="/register">
              <Button 
                size="lg" 
                className="magnetic-btn bg-gradient-primary text-white text-lg px-8 py-4 h-auto shadow-xl hover:shadow-glow group"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Analyze My Resume
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                variant="outline" 
                size="lg" 
                className="glass text-lg px-8 py-4 h-auto hover:shadow-lg group border-primary/20 hover:border-primary/40"
              >
                <Shield className="w-5 h-5 mr-2" />
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="animate-fade-in grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16" style={{ animationDelay: "1s" }}>
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div 
                  key={index} 
                  className="interactive-card text-center group hover:scale-105 transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-gradient-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Social Proof */}
          <div className="animate-fade-in mt-16" style={{ animationDelay: "1.2s" }}>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">4.9/5 from 10,000+ users</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                "ResumeRise helped me land my dream job at a Fortune 500 company. 
                The AI insights were game-changing!" - Sarah K., Software Engineer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
