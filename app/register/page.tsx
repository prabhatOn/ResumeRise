"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ModernHeader } from "@/components/modern-header"
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  Zap
} from "lucide-react"

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to register")
      }

      toast({
        title: "Account created successfully!",
        description: "You can now sign in with your credentials",
      })

      router.push("/login")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { score: 0, label: "", color: "" }
    
    let score = 0
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[^A-Za-z\d]/.test(password)) score += 1

    if (score <= 2) return { score, label: "Weak", color: "text-red-500" }
    if (score <= 3) return { score, label: "Fair", color: "text-yellow-500" }
    if (score <= 4) return { score, label: "Good", color: "text-blue-500" }
    return { score, label: "Strong", color: "text-green-500" }
  }

  const passwordStrength = getPasswordStrength(form.watch("password") || "")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-float" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-accent rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-3/4 w-32 h-32 bg-gradient-secondary rounded-full blur-2xl opacity-15 animate-float" style={{ animationDelay: "4s" }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,hsl(var(--muted))_50%,transparent_100%)] opacity-5" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,hsl(var(--muted))_50%,transparent_100%)] opacity-5" />
        </div>
      </div>

      {/* Modern Header */}
      <ModernHeader variant="landing" />

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen pt-20 pb-8 px-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Welcome Badge */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="glass-badge px-4 py-2 rounded-full">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="bg-gradient-primary bg-clip-text text-transparent font-medium">
                  Join Thousands of Job Seekers
                </span>
              </div>
            </div>
          </motion.div>

          {/* Registration Card */}
          <motion.div 
            className="glass-card p-8 rounded-2xl space-y-6 shadow-glow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
              <p className="text-muted-foreground">
                Start optimizing your resume with AI-powered insights
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            placeholder="Enter your full name" 
                            className="glass-input pl-10 h-12 border-0 focus:ring-2 focus:ring-primary/20 bg-black/20" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            placeholder="Enter your email" 
                            className="glass-input pl-10 h-12 border-0 focus:ring-2 focus:ring-primary/20 bg-black/20" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="glass-input pl-10 pr-10 h-12 border-0 focus:ring-2 focus:ring-primary/20 bg-black/20" 
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      {field.value && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Password strength:</span>
                            <span className={`font-medium ${passwordStrength.color}`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                passwordStrength.score <= 2 ? 'bg-red-500' :
                                passwordStrength.score <= 3 ? 'bg-yellow-500' :
                                passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="glass-input pl-10 pr-10 h-12 border-0 focus:ring-2 focus:ring-primary/20 bg-black/20" 
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-medium rounded-xl magnetic-btn" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="mt-8 grid grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {[
              { icon: Shield, label: "Secure" },
              { icon: Zap, label: "Fast" },
              { icon: CheckCircle, label: "Trusted" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <motion.div 
                  className="glass-badge w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <item.icon className="w-5 h-5 text-primary" />
                </motion.div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Benefits */}
          <motion.div 
            className="mt-8 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-xs text-muted-foreground text-center mb-4">
              What you&apos;ll get with your free account:
            </p>
            <div className="space-y-2">
              {[
                "AI-powered resume analysis",
                "ATS compatibility scoring",
                "Industry-specific recommendations",
                "Keyword optimization suggestions"
              ].map((benefit, index) => (
                <motion.div 
                  key={benefit}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {benefit}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
