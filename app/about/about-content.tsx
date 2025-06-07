"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  Users, 
  Award, 
  Clock, 
  Target,
  Zap,
  Shield,
  Heart,
  TrendingUp,
  Star,
  CheckCircle,
  Sparkles,
  Globe,
  Rocket
} from "lucide-react"

const stats = [
  { number: "50K+", label: "Resumes Analyzed", icon: TrendingUp },
  { number: "95%", label: "Success Rate", icon: Star },
  { number: "24/7", label: "Support Available", icon: Shield },
  { number: "100+", label: "ATS Systems", icon: CheckCircle },
]

const values = [
  {
    title: "Transparency",
    description: "We believe in complete transparency about how ATS systems work and how our tool analyzes your resume.",
    icon: Globe,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Accessibility",
    description: "Our tools should be accessible to everyone, regardless of their background or experience level.",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500"
  },
  {
    title: "Accuracy",
    description: "We&apos;re committed to providing the most accurate and helpful analysis possible.",
    icon: Target,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    title: "Empowerment",
    description: "We aim to empower job seekers with knowledge and tools to succeed in their job search.",
    icon: Rocket,
    gradient: "from-purple-500 to-violet-500"
  },
]

const team = [
  {
    title: "Our Team",
    description: "Our team consists of HR professionals, data scientists, and software engineers with years of experience in the recruitment industry.",
    icon: Users,
    color: "text-blue-400"
  },
  {
    title: "Our Mission",
    description: "To democratize the job application process by giving job seekers the tools they need to navigate ATS systems effectively.",
    icon: Award,
    color: "text-purple-400"
  },
  {
    title: "Our Story",
    description: "Founded in 2023, ResumeRise was born out of frustration with the black box of ATS systems and a desire to level the playing field.",
    icon: Clock,
    color: "text-emerald-400"
  },
]

export default function AboutPageContent() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.12),transparent_50%)]" />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-purple-500/12 blur-3xl"
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
          style={{ left: '10%', top: '20%' }}
        />        <motion.div
          className="absolute w-96 h-96 rounded-full bg-blue-500/12 blur-3xl"
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
          style={{ right: '10%', bottom: '20%' }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>{/* Main Content */}
      <main className="flex-1">        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-16 lg:pt-20">
          {/* Background Grid/Outline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.08),transparent_50%)]" />
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-4xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-2 text-sm text-purple-300 border border-purple-500/20 mb-6"
              >
                <Sparkles className="h-4 w-4" />
                About ResumeRise
              </motion.div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl mb-6">
                <span className="text-gradient-primary">Revolutionizing</span>
                <br />
                <span className="text-white">Resume Analysis</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                We&apos;re on a mission to help job seekers optimize their resumes and increase their chances of 
                landing interviews through cutting-edge AI technology and deep ATS insights.
              </p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="glass-subtle rounded-2xl p-6 text-center group hover:bg-white/5 transition-all duration-300"
                  >
                    <stat.icon className="h-8 w-8 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Meet Our <span className="text-gradient-primary">Team</span>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Passionate professionals dedicated to transforming the job application process
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {team.map((member, index) => (
                <motion.div
                  key={member.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="glass rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-300"
                >
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <member.icon className={`h-8 w-8 ${member.color}`} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{member.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our <span className="text-gradient-primary">Values</span>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="glass rounded-3xl p-8 group hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r ${value.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl" />
              <div className="relative">
                <Zap className="h-12 w-12 text-purple-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Transform Your Resume?
                </h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of job seekers who have improved their resume effectiveness and landed their dream jobs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity text-white px-8 py-3 rounded-xl font-semibold">
                      Get Started for Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}
