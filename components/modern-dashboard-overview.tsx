"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  FileText, 
  BarChart3, 
  Upload, 
  Clock, 
  TrendingUp,
  Target,
  Star,
  ArrowRight,
  Sparkles,
  Award,
  Calendar,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface DashboardData {
  user: {
    name: string
    email: string
  }
  stats: {
    resumeCount: number
    analysisCount: number
    averageScore: number
    lastUpload: Date | null
  }
  recentResumes: Array<{
    id: number
    title: string
    createdAt: Date
    score: number | null
  }>
}

interface ModernDashboardOverviewProps {
  data: DashboardData
}

export function ModernDashboardOverview({ data }: ModernDashboardOverviewProps) {
  const { user, stats, recentResumes } = data

  // Calculate score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-green-500/20 to-green-500/5"
    if (score >= 60) return "from-yellow-500/20 to-yellow-500/5"
    return "from-red-500/20 to-red-500/5"
  }

  const statCards = [
    {
      title: "Total Resumes",
      value: stats.resumeCount.toString(),
      description: "Uploaded resumes",
      icon: FileText,
      gradient: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-500"
    },
    {
      title: "Analyses",
      value: stats.analysisCount.toString(),
      description: "Total analyses performed",
      icon: BarChart3,
      gradient: "from-purple-500/20 to-purple-500/5",
      iconColor: "text-purple-500"
    },
    {
      title: "Average Score",
      value: stats.averageScore > 0 ? `${stats.averageScore}/100` : "N/A",
      description: "Average resume score",
      icon: TrendingUp,
      gradient: stats.averageScore > 0 ? getScoreBg(stats.averageScore) : "from-gray-500/20 to-gray-500/5",
      iconColor: stats.averageScore > 0 ? getScoreColor(stats.averageScore) : "text-gray-500"
    },
    {
      title: "Last Upload",
      value: stats.lastUpload ? new Date(stats.lastUpload).toLocaleDateString() : "N/A",
      description: "Date of last resume upload",
      icon: Clock,
      gradient: "from-green-500/20 to-green-500/5",
      iconColor: "text-green-500"
    }
  ]

  const tips = [
    {
      title: "Use Action Verbs",
      description: "Start bullet points with action verbs like 'Achieved', 'Implemented', 'Developed'.",
      icon: Target
    },
    {
      title: "Quantify Achievements",
      description: "Include numbers and percentages to demonstrate impact.",
      icon: BarChart3
    },
    {
      title: "Tailor to Job Description",
      description: "Customize your resume for each job application.",
      icon: Star
    },
    {
      title: "Keep it Simple",
      description: "Use clean formatting and avoid complex layouts for ATS compatibility.",
      icon: Award
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome back, {user.name}!
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Ready to optimize your career journey?
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button size="lg" className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transition-transform group-hover:scale-105" />
            <div className="relative flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Resume</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group glass rounded-2xl p-6 border border-border/50 hover:border-border/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient}`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <Sparkles className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{card.title}</h3>
            <div className="text-3xl font-bold mb-2">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Resumes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="glass rounded-2xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Resumes</h2>
              <Badge variant="secondary" className="text-xs">
                {recentResumes.length} total
              </Badge>
            </div>

            {recentResumes.length > 0 ? (
              <div className="space-y-4">
                {recentResumes.map((resume, index) => (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="group flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{resume.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {resume.score !== null ? (
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getScoreColor(resume.score)}`}>
                            {resume.score}/100
                          </div>
                          <Progress value={resume.score} className="w-16 h-2 mt-1" />
                        </div>
                      ) : (
                        <Badge variant="outline">Not analyzed</Badge>
                      )}
                      
                      <Link href={`/dashboard/resumes/${resume.id}`}>
                        <Button variant="ghost" size="sm" className="group/btn">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                          <ArrowRight className="w-3 h-3 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="p-6 rounded-full bg-gradient-to-br from-muted/50 to-muted/20 mb-4">
                  <FileText className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No resumes uploaded yet</h3>
                <p className="text-muted-foreground mb-4">Get started by uploading your first resume</p>
                <Link href="/dashboard/upload">
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Resume
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Tips Card */}
          <div className="glass rounded-2xl p-6 border border-border/50">
            <h2 className="text-xl font-semibold mb-6">Tips to Improve</h2>
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="group p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 mt-0.5">
                      <tip.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm mb-1">{tip.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-2xl p-6 border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dashboard/upload">
                <Button variant="ghost" className="w-full justify-start group">
                  <Upload className="w-4 h-4 mr-3" />
                  Upload New Resume
                  <ArrowRight className="w-3 h-3 ml-auto transition-transform group-hover:translate-x-1" />
                </Button>              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
