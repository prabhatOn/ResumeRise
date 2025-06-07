"use client"

import { useState, useRef, useEffect } from "react"
import { useInView } from "@/hooks/use-in-view"
import { 
  Star, 
  Quote,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Award,
  User,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  industry: string
  avatar: string
  content: string
  rating: number
  metrics: {
    label: string
    value: string
    improvement: string
  }[]
  tags: string[]
  verified: boolean
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Software Engineer",
    company: "Google",
    industry: "Technology",
    avatar: "/placeholder-user.jpg",
    content: "ResumeATS transformed my job search completely. The AI insights helped me tailor my resume perfectly for each application. I went from 2% response rate to 40% in just two weeks!",
    rating: 5,
    metrics: [
      { label: "Response Rate", value: "40%", improvement: "+38%" },
      { label: "Interviews", value: "12", improvement: "+10" },
      { label: "ATS Score", value: "94%", improvement: "+27%" }
    ],
    tags: ["Software Engineering", "Tech Industry", "ATS Optimization"],
    verified: true
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Marketing Director",
    company: "Nike",
    industry: "Consumer Goods",
    avatar: "/placeholder-user.jpg",
    content: "The industry-specific recommendations were game-changing. I landed 3 final-round interviews and got my dream job at Nike with a 35% salary increase. The ROI on this tool is incredible!",
    rating: 5,
    metrics: [
      { label: "Salary Increase", value: "35%", improvement: "+$28k" },
      { label: "Final Interviews", value: "3", improvement: "+3" },
      { label: "ATS Score", value: "92%", improvement: "+24%" }
    ],
    tags: ["Marketing", "Leadership", "Brand Management"],
    verified: true
  },
  {
    id: 3,
    name: "Dr. Emily Watson",
    role: "Data Scientist",
    company: "Microsoft",
    industry: "Technology",
    avatar: "/placeholder-user.jpg",
    content: "As a PhD transitioning to industry, I struggled to translate my academic experience. ResumeATS helped me highlight transferable skills and industry-relevant keywords. Landed at Microsoft in 6 weeks!",
    rating: 5,
    metrics: [
      { label: "Time to Hire", value: "6 weeks", improvement: "-12 weeks" },
      { label: "Interview Rate", value: "45%", improvement: "+42%" },
      { label: "ATS Score", value: "96%", improvement: "+31%" }
    ],
    tags: ["Data Science", "PhD Transition", "FAANG"],
    verified: true
  },
  {
    id: 4,
    name: "James Thompson",
    role: "Product Manager",
    company: "Stripe",
    industry: "Fintech",
    avatar: "/placeholder-user.jpg",
    content: "The keyword optimization was spot-on. Every suggestion made sense and aligned with what recruiters were actually looking for. Multiple offers and chose Stripe - couldn't be happier!",
    rating: 5,
    metrics: [
      { label: "Offers Received", value: "4", improvement: "+4" },
      { label: "Response Rate", value: "38%", improvement: "+35%" },
      { label: "ATS Score", value: "91%", improvement: "+22%" }
    ],
    tags: ["Product Management", "Fintech", "Strategy"],
    verified: true
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "UX Designer",
    company: "Airbnb",
    industry: "Technology",
    avatar: "/placeholder-user.jpg",
    content: "The formatting suggestions were brilliant - made my portfolio links and design projects much more prominent. Recruiters could finally see my value clearly. Dream job achieved!",
    rating: 5,
    metrics: [
      { label: "Portfolio Views", value: "250%", improvement: "+150%" },
      { label: "Design Interviews", value: "8", improvement: "+6" },
      { label: "ATS Score", value: "89%", improvement: "+19%" }
    ],
    tags: ["UX Design", "Portfolio Optimization", "Creative Industry"],
    verified: true
  }
]

const industryIcons = {
  "Technology": Briefcase,
  "Consumer Goods": TrendingUp,
  "Fintech": Award,
  "Creative": GraduationCap
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { threshold: 0.3 })

  useEffect(() => {
    if (isInView) {
      setIsVisible(true)
    }
  }, [isInView])

  useEffect(() => {
    if (!isAutoPlaying || !isVisible) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, isVisible])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-slate-900 dark:to-pink-950/20 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Testimonial Cards Background */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.2) 2px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
            <Star className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Success Stories
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-100 dark:to-white bg-clip-text text-transparent">
              Trusted by
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              10,000+ Professionals
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            See how our AI-powered resume optimization helped professionals land their dream jobs
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className={`relative transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="relative max-w-5xl mx-auto">
            {/* Navigation Buttons */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Testimonial Card */}
            <div 
              key={currentTestimonial.id}
              className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 dark:border-slate-700/30 animate-fadeIn"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 opacity-20">
                <Quote className="w-16 h-16 text-purple-500" />
              </div>

              <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Testimonial Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < currentTestimonial.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-slate-300'
                        }`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                      {currentTestimonial.rating}.0
                    </span>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                    "{currentTestimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                        <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <User className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                        </div>
                      </div>
                      {currentTestimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-lg">
                        {currentTestimonial.name}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400">
                        {currentTestimonial.role}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          {currentTestimonial.company}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-sm text-slate-500">
                          {currentTestimonial.industry}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {currentTestimonial.tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-lg mb-4">
                    Results Achieved
                  </h4>
                  
                  {currentTestimonial.metrics.map((metric, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-r from-slate-50 to-purple-50 dark:from-slate-800 dark:to-purple-900/20 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {metric.label}
                        </span>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {metric.improvement}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div className={`flex justify-center gap-3 mt-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '600ms' }}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setIsAutoPlaying(false)
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8'
                  : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '800ms' }}>
          {[
            { label: 'Success Rate', value: '94%', description: 'Land interviews' },
            { label: 'Avg. Salary Boost', value: '28%', description: 'Higher offers' },
            { label: 'Time Saved', value: '15hrs', description: 'Per application' },
            { label: 'Client Rating', value: '4.9/5', description: 'Satisfaction' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/30"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="font-semibold text-slate-900 dark:text-white mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
