"use client"

import { useState, useRef, useEffect } from "react"
import { useInView } from "@/hooks/use-in-view"
import { 
  Check, 
  Star, 
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Shield,
  Infinity,
  Gift,
  Clock,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

interface PricingPlan {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  popular: boolean
  features: {
    text: string
    included: boolean
    premium?: boolean
  }[]
  cta: string
  color: string
  gradient: string
  icon: any
  badge?: string
  savings?: string
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started with basic resume optimization",
    price: {
      monthly: 0,
      yearly: 0
    },
    popular: false,
    features: [
      { text: "1 resume analysis per month", included: true },
      { text: "Basic ATS compatibility check", included: true },
      { text: "Format optimization tips", included: true },
      { text: "Email support", included: true },
      { text: "Advanced keyword analysis", included: false },
      { text: "Industry-specific insights", included: false },
      { text: "Unlimited analyses", included: false },
      { text: "Priority support", included: false }
    ],
    cta: "Get Started Free",
    color: "text-slate-600",
    gradient: "from-slate-500 to-slate-600",
    icon: Gift
  },
  {
    id: "pro",
    name: "Professional",
    description: "Everything you need for serious job searching",
    price: {
      monthly: 29,
      yearly: 19
    },
    popular: true,
    badge: "Most Popular",
    savings: "Save 34%",
    features: [
      { text: "Unlimited resume analyses", included: true },
      { text: "Advanced ATS compatibility", included: true },
      { text: "Industry-specific optimization", included: true },
      { text: "Keyword density analysis", included: true },
      { text: "Real-time formatting fixes", included: true },
      { text: "Cover letter optimization", included: true },
      { text: "Priority email support", included: true },
      { text: "LinkedIn profile optimization", included: false }
    ],
    cta: "Start Pro Trial",
    color: "text-purple-600",
    gradient: "from-purple-500 to-pink-500",
    icon: Zap
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Advanced features for power users and teams",
    price: {
      monthly: 79,
      yearly: 59
    },
    popular: false,
    savings: "Save 25%",
    features: [
      { text: "Everything in Professional", included: true },
      { text: "LinkedIn profile optimization", included: true, premium: true },
      { text: "Personal branding analysis", included: true, premium: true },
      { text: "Interview question generator", included: true, premium: true },
      { text: "Salary negotiation insights", included: true, premium: true },
      { text: "1-on-1 career coaching call", included: true, premium: true },
      { text: "API access for integrations", included: true, premium: true },
      { text: "White-label solutions", included: true, premium: true }
    ],
    cta: "Go Enterprise",
    color: "text-yellow-600",
    gradient: "from-yellow-500 to-orange-500",
    icon: Crown
  }
]

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { threshold: 0.3 })

  useEffect(() => {
    if (isInView) {
      setIsVisible(true)
    }
  }, [isInView])

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Pricing Plans
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">
              Choose Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Success Plan
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
            Unlock your career potential with AI-powered resume optimization
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 p-1 bg-slate-800/50 backdrop-blur-sm rounded-2xl w-fit mx-auto border border-slate-700">
            <span className={`px-4 py-2 text-sm font-medium transition-colors ${!isYearly ? 'text-white' : 'text-slate-400'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
            />
            <div className="flex items-center gap-2">
              <span className={`px-4 py-2 text-sm font-medium transition-colors ${isYearly ? 'text-white' : 'text-slate-400'}`}>
                Yearly
              </span>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">
                Save up to 34%
              </Badge>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const isHovered = hoveredPlan === plan.id
            const price = isYearly ? plan.price.yearly : plan.price.monthly
            
            return (
              <div
                key={plan.id}
                className={`relative group transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-medium shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className={`relative h-full p-8 rounded-3xl border transition-all duration-500 group-hover:scale-105 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-white/10 to-purple-500/10 border-purple-500/30 shadow-2xl shadow-purple-500/20'
                    : 'bg-white/5 border-slate-700 hover:border-slate-600'
                } backdrop-blur-xl`}>
                  
                  {/* Animated Background */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${plan.gradient}/10`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${plan.gradient} text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                        {plan.savings && isYearly && (
                          <span className="text-sm text-green-400 font-medium">{plan.savings}</span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-300 mb-8 leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">
                          ${price}
                        </span>
                        <span className="text-slate-400">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      </div>
                      {isYearly && plan.price.monthly > 0 && (
                        <div className="text-sm text-slate-400 mt-1">
                          <span className="line-through">${plan.price.monthly}/month</span>
                          <span className="text-green-400 ml-2">
                            Save ${(plan.price.monthly - plan.price.yearly) * 12}/year
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div 
                          key={featureIndex}
                          className={`flex items-start gap-3 transition-all duration-300 ${
                            isHovered ? 'translate-x-2' : ''
                          }`}
                          style={{ transitionDelay: `${featureIndex * 50}ms` }}
                        >
                          {feature.included ? (
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                              feature.premium 
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                                : 'bg-gradient-to-r from-green-500 to-emerald-500'
                            }`}>
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center mt-0.5">
                              <span className="w-2 h-2 bg-slate-400 rounded-full" />
                            </div>
                          )}
                          <span className={`text-sm ${
                            feature.included ? 'text-white' : 'text-slate-500'
                          } ${feature.premium ? 'font-medium' : ''}`}>
                            {feature.text}
                            {feature.premium && (
                              <Crown className="w-3 h-3 text-yellow-500 ml-1 inline" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button 
                      className={`w-full py-6 rounded-2xl text-lg font-semibold transition-all duration-300 group-hover:scale-105 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-purple-500/30'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  } bg-gradient-to-r ${plan.gradient}/20 blur-xl`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Features */}
        <div className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '800ms' }}>
          {[
            {
              icon: Shield,
              title: "Money-Back Guarantee",
              description: "30-day full refund if you're not satisfied",
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: Clock,
              title: "Instant Results",
              description: "Get your optimized resume in under 2 minutes",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: Users,
              title: "Expert Support",
              description: "Professional career coaches available 24/7",
              color: "from-purple-500 to-pink-500"
            }
          ].map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300 text-sm">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* FAQ Preview */}
        <div className={`text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '1000ms' }}>
          <p className="text-slate-300 mb-4">
            Have questions? Check out our{' '}
            <a href="#faq" className="text-purple-400 hover:text-purple-300 underline">
              frequently asked questions
            </a>
            {' '}or{' '}
            <a href="#contact" className="text-purple-400 hover:text-purple-300 underline">
              contact our team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
