"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ModernHeader } from "@/components/modern-header"
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Eye,
  EyeOff,
  Shield,
  Zap,
  CheckCircle
} from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error || "Failed to login")
      }

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
                  Welcome Back
                </span>
              </div>
            </div>
          </motion.div>

          {/* Login Card */}
          <motion.div 
            className="glass-card p-8 rounded-2xl space-y-6 shadow-glow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
              <p className="text-muted-foreground">
                Access your resume analysis dashboard
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            autoComplete="email"
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
                            placeholder="Enter your password"
                            className="glass-input pl-10 pr-10 h-12 border-0 focus:ring-2 focus:ring-primary/20 bg-black/20" 
                            autoComplete="current-password"
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-medium rounded-xl magnetic-btn" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link 
                  href="/register" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-xs text-muted-foreground mb-4">
              Trusted by thousands of job seekers worldwide
            </p>
            <div className="flex justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-500" />
                <span>ATS Optimized</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-500" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-purple-500" />
                <span>Industry Specific</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
