"use client"

import { useState } from "react"
import { 
  Mail, 
  Phone, 
  MapPin,
  Twitter,
  Linkedin,
  Github,
  ArrowRight,
  Heart,
  Zap,
  Shield,
  Star,
  Award,
  Users,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "/api" },
    { name: "Integrations", href: "/integrations" }
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Contact", href: "/contact" }
  ],
  resources: [
    { name: "Help Center", href: "/help" },
    { name: "Resume Templates", href: "/templates" },
    { name: "Career Guide", href: "/guide" },
    { name: "ATS Tips", href: "/ats-tips" },
    { name: "Success Stories", href: "/testimonials" }
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "GDPR", href: "/gdpr" },
    { name: "Security", href: "/security" }
  ]
}

const socialLinks = [  { icon: Twitter, href: "https://twitter.com/resumerise", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/resumerise", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/resumerise", label: "GitHub" }
]

const stats = [
  { icon: Users, value: "50K+", label: "Happy Users" },
  { icon: TrendingUp, value: "94%", label: "Success Rate" },
  { icon: Star, value: "4.9/5", label: "User Rating" },
  { icon: Award, value: "15+", label: "Awards Won" }
]

export default function ModernFooter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.4) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="relative">
        {/* Newsletter Section */}
        <div className="border-b border-slate-700/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 border-purple-700">
                    Stay Updated
                  </Badge>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">
                  Get the latest career insights
                </h3>
                
                <p className="text-slate-300 text-lg leading-relaxed">
                  Join 10,000+ professionals getting weekly tips on resume optimization, 
                  job market trends, and career advancement strategies.
                </p>
              </div>

              <div className="relative">
                <form onSubmit={handleSubscribe} className="flex gap-4">
                  <div className="flex-1 relative">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500 h-12 rounded-xl"
                      required
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 h-12 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                    disabled={isSubscribed}
                  >
                    {isSubscribed ? (
                      "Subscribed!"
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
                
                <p className="text-slate-400 text-sm mt-3">
                  No spam, unsubscribe at any time. Read our{" "}
                  <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                    Privacy Policy
                  </a>
                </p>

                {isSubscribed && (
                  <div className="absolute -bottom-16 left-0 right-0 bg-green-500/10 border border-green-500/20 rounded-xl p-4 animate-slideUp">
                    <div className="flex items-center gap-2 text-green-400">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Successfully subscribed!</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-b border-slate-700/50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-white">ResumeRise</span>
                </div>
                  <p className="text-slate-300 leading-relaxed mb-6">
                  AI-powered resume optimization that helps professionals land their dream jobs. 
                  Join thousands who&apos;ve transformed their careers with our intelligent ATS analysis.
                </p>

                {/* Contact Info */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <span>hello@resumerise.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300 hover:scale-110"
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Links Sections */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 lg:col-span-3">
                <div>
                  <h4 className="text-white font-semibold text-lg mb-6">Product</h4>
                  <ul className="space-y-3">
                    {footerLinks.product.map((link) => (
                      <li key={link.name}>
                        <a 
                          href={link.href}
                          className="text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold text-lg mb-6">Company</h4>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <a 
                          href={link.href}
                          className="text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold text-lg mb-6">Resources</h4>
                  <ul className="space-y-3">
                    {footerLinks.resources.map((link) => (
                      <li key={link.name}>
                        <a 
                          href={link.href}
                          className="text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 text-slate-400">
                <span>© 2025 ResumeRise. All rights reserved.</span>
                <span className="hidden md:block">•</span>
                <div className="flex items-center gap-2">
                  <span>Made with</span>
                  <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>for job seekers worldwide</span>
                </div>
              </div>

              <div className="flex gap-6 text-sm">
                {footerLinks.legal.map((link) => (
                  <a 
                    key={link.name}
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
