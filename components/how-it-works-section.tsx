"use client"

import { useState, useRef, useEffect } from "react"
import { useInView } from "@/hooks/use-in-view"
import { 
  Upload, 
  Brain, 
  BarChart3, 
  Download,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Target
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Step {
  id: number
  icon: any
  title: string
  description: string
  details: string[]
  color: string
  gradient: string
}

const steps: Step[] = [
  {
    id: 1,
    icon: Upload,
    title: "Upload Your Resume",
    description: "Drag & drop or select your resume file. We support PDF, DOC, and DOCX formats.",
    details: [
      "Secure file processing",
      "Multiple format support",
      "Instant parsing",
      "Privacy protected"
    ],
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    icon: Brain,
    title: "AI Analysis",
    description: "Our advanced AI analyzes your resume against ATS systems and industry standards.",
    details: [
      "ATS compatibility check",
      "Keyword optimization",
      "Format analysis",
      "Industry benchmarking"
    ],
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    icon: BarChart3,
    title: "Get Insights",
    description: "Receive detailed analytics and actionable recommendations to improve your resume.",
    details: [
      "Compatibility score",
      "Improvement suggestions",
      "Industry insights",
      "Competitive analysis"
    ],
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    icon: Download,
    title: "Download & Apply",
    description: "Get your optimized resume and start applying with confidence.",
    details: [
      "Optimized format",
      "ATS-friendly layout",
      "Enhanced keywords",
      "Ready to submit"
    ],
    color: "text-orange-500",
    gradient: "from-orange-500 to-red-500"
  }
]

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { threshold: 0.3 })

  useEffect(() => {
    if (isInView) {
      setIsVisible(true)
    }
  }, [isInView])

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/5 to-emerald-400/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              How It Works
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-100 dark:to-white bg-clip-text text-transparent">
              Simple Steps to
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Resume Success
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Transform your resume in minutes with our AI-powered analysis and optimization process
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Steps Navigation */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index
              
              return (
                <div
                  key={step.id}
                  className={`group cursor-pointer transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onClick={() => setActiveStep(index)}
                >
                  <div className={`relative p-6 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-white dark:bg-slate-800 shadow-2xl scale-105 ring-1 ring-purple-500/20' 
                      : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg'
                  }`}>
                    {/* Step Number & Icon */}
                    <div className="flex items-start gap-4">
                      <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? `bg-gradient-to-r ${step.gradient} text-white` 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        <Icon className="w-6 h-6" />
                        {isActive && (
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                            isActive 
                              ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400' 
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                          }`}>
                            Step {step.id}
                          </span>
                          {isActive && (
                            <ArrowRight className="w-4 h-4 text-purple-500 animate-bounce-x" />
                          )}
                        </div>
                        
                        <h3 className={`text-xl font-bold mb-2 transition-colors ${
                          isActive ? step.color : 'text-slate-900 dark:text-white'
                        }`}>
                          {step.title}
                        </h3>
                        
                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                          {step.description}
                        </p>
                        
                        {/* Details */}
                        <div className={`space-y-2 overflow-hidden transition-all duration-300 ${
                          isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          {step.details.map((detail, detailIndex) => (
                            <div 
                              key={detailIndex}
                              className="flex items-center gap-2"
                              style={{ transitionDelay: `${detailIndex * 100}ms` }}
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Visual Demo */}
          <div className={`relative transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="relative bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl p-8 overflow-hidden">
              {/* Mock Interface */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-white/60 text-sm font-mono">ResumeATS Pro</div>
                </div>

                {/* Current Step Demo */}
                <div className="space-y-4">
                  {activeStep === 0 && (
                    <div className="animate-fadeIn">
                      <div className="border-2 border-dashed border-purple-400 rounded-xl p-8 text-center">
                        <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-bounce" />
                        <p className="text-white mb-2">Drop your resume here</p>
                        <p className="text-white/60 text-sm">PDF, DOC, DOCX supported</p>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="animate-fadeIn space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
                          <span className="text-white">Analyzing resume...</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-progress" style={{ width: '75%' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="animate-fadeIn space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-green-400 mb-1">87%</div>
                          <div className="text-white/60 text-sm">ATS Score</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-2xl font-bold text-blue-400 mb-1">24</div>
                          <div className="text-white/60 text-sm">Keywords</div>
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-yellow-400" />
                          <span className="text-white text-sm">Recommendations</span>
                        </div>
                        <ul className="text-white/80 text-sm space-y-1">
                          <li>• Add more technical keywords</li>
                          <li>• Improve formatting consistency</li>
                          <li>• Quantify achievements</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="animate-fadeIn text-center">
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4 animate-scaleIn" />
                        <p className="text-white mb-2">Resume Optimized!</p>
                        <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0">
                          <Download className="w-4 h-4 mr-2" />
                          Download Resume
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 animate-pulse" />
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl animate-float" />
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-500/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center mt-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '800ms' }}>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 group border-0"
          >
            <Zap className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            Start Your Analysis
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}
