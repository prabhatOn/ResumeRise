"use client"

import { useState, useRef, useEffect } from "react"
import { useInView } from "@/hooks/use-in-view"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Brain, 
  Target, 
  BarChart3, 
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Star,
  Zap
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface Feature {
  id: string
  icon: LucideIcon
  title: string
  description: string
  details: string[]
  color: string
  gradient: string
  metric: string
  value: string
}

const features: Feature[] = [
  {
    id: "ats-analysis",
    icon: Brain,
    title: "AI-Powered ATS Analysis",
    description: "Advanced algorithms scan your resume like real ATS systems, identifying optimization opportunities.",
    details: [
      "98% ATS compatibility accuracy",
      "Real-time parsing simulation",
      "Industry-specific keyword analysis",
      "Format optimization suggestions"
    ],
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-500",
    metric: "ATS Score",
    value: "98%"
  },
  {
    id: "industry-targeting",
    icon: Target,
    title: "Industry-Specific Targeting",
    description: "Tailored analysis for your target industry with role-specific recommendations.",
    details: [
      "50+ industry templates",
      "Role-specific keyword matching",
      "Competitive analysis insights",
      "Market trend integration"
    ],
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    metric: "Match Rate",
    value: "94%"
  },
  {
    id: "performance-tracking",
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track your resume's performance with detailed analytics and improvement insights.",
    details: [
      "Comprehensive scoring system",
      "Progress tracking over time",
      "Benchmarking against top performers",
      "Actionable improvement suggestions"
    ],
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500",
    metric: "Improvement",
    value: "+85%"
  },
  {
    id: "security-privacy",
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Your data is protected with bank-level encryption and privacy controls.",
    details: [
      "End-to-end encryption",
      "GDPR compliant data handling",
      "Secure cloud infrastructure",
      "No data sharing with third parties"
    ],
    color: "text-red-500",
    gradient: "from-red-500 to-orange-500",
    metric: "Security",
    value: "100%"
  }
]

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (!isInView) return
    
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isInView])

  return (
    <section ref={ref} className="py-24 lg:py-32 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-6 glass px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Powerful Features
          </Badge>
          
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="block text-gradient-primary mt-2">Land Your Dream Job</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive suite of AI-powered tools transforms your resume into an interview-winning document
          </p>
        </motion.div>

        {/* Feature Details Display Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            className="max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass rounded-3xl p-8 lg:p-12 shadow-2xl border border-border/20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Details */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${features[activeFeature].gradient}`}>
                      {(() => {
                        const IconComponent = features[activeFeature].icon;
                        return <IconComponent className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gradient-primary">
                        {features[activeFeature].title}
                      </h3>
                      <p className="text-muted-foreground">Advanced Capabilities</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {features[activeFeature].details.map((detail, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right Side - Visualization */}
                <div className="relative">
                  <div className="glass-subtle rounded-2xl p-6 border border-border/20">
                    {/* Mock Dashboard */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-sm font-medium">Analysis Complete</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {features[activeFeature].value}
                        </Badge>
                      </div>
                      
                      {/* Progress Bars */}
                      <div className="space-y-3">
                        {features[activeFeature].details.map((_, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Metric {index + 1}</span>
                              <span className="font-semibold">{95 - index * 3}%</span>
                            </div>
                            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${features[activeFeature].gradient} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${95 - index * 3}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Live Data Simulation */}
                      <div className="mt-6 p-4 bg-muted/20 rounded-xl">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-gradient-primary">2.4k</div>
                            <div className="text-xs text-muted-foreground">Processed</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gradient-secondary">98%</div>
                            <div className="text-xs text-muted-foreground">Success Rate</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gradient-accent">Live</div>
                            <div className="text-xs text-muted-foreground">Status</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-primary rounded-full blur-xl opacity-20 animate-float" />
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-accent rounded-full blur-lg opacity-30 animate-float" style={{ animationDelay: "1s" }} />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Bottom CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto border border-border/20">
            <h3 className="text-2xl font-bold mb-4 text-gradient-primary">
              Ready to Transform Your Resume?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of professionals who&apos;ve landed their dream jobs with our AI-powered platform
            </p>
            <Button 
              size="lg" 
              className="magnetic-btn bg-gradient-primary text-white px-8 py-4 shadow-xl hover:shadow-glow group"
            >
              <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Try All Features Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>        </motion.div>
      </div>
    </section>
  )
}
