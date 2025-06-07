"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js"
import { Bar, Radar, Doughnut } from "react-chartjs-2"
import { BarChart3, TrendingUp, Download, Eye, Zap } from "lucide-react"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
)

interface ResumeScores {
  atsScore: number
  keywordScore: number
  grammarScore?: number
  formattingScore?: number
  sectionScore?: number
  actionVerbScore?: number
  relevanceScore?: number
  bulletPointScore?: number
  languageToneScore?: number
  lengthScore?: number
  industryScore?: number
}

interface ModernResumeChartsProps {
  scores: ResumeScores
  industry?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function ModernResumeCharts({ scores, industry }: ModernResumeChartsProps) {
  const [chartType, setChartType] = useState("radar")

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981" // green
    if (score >= 60) return "#f59e0b" // yellow
    return "#ef4444" // red
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-green-500/10 to-green-500/5"
    if (score >= 60) return "from-yellow-500/10 to-yellow-500/5"
    return "from-red-500/10 to-red-500/5"
  }

  // Prepare data labels and values
  const labels = [
    "ATS Compatibility",
    "Keyword Match",
    "Grammar",
    "Formatting",
    "Sections",
    "Action Verbs",
    "Relevance",
    "Bullet Points",
    "Language Tone",
    "Length",
    ...(scores.industryScore ? [`${industry || "Industry"} Fit`] : []),
  ]

  const values = [
    scores.atsScore,
    scores.keywordScore,
    scores.grammarScore || 0,
    scores.formattingScore || 0,
    scores.sectionScore || 0,
    scores.actionVerbScore || 0,
    scores.relevanceScore || 0,
    scores.bulletPointScore || 0,
    scores.languageToneScore || 0,
    scores.lengthScore || 0,
    ...(scores.industryScore ? [scores.industryScore] : []),
  ]

  // Prepare data for bar chart
  const barData = {
    labels,
    datasets: [
      {
        label: "Score",
        data: values,
        backgroundColor: values.map(score => `${getScoreColor(score)}20`),
        borderColor: values.map(score => getScoreColor(score)),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  // Prepare data for radar chart
  const radarData = {
    labels,
    datasets: [
      {
        label: "Score",
        data: values,
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        pointBackgroundColor: values.map(score => getScoreColor(score)),
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  // Prepare data for doughnut chart
  const doughnutData = {
    labels,
    datasets: [
      {
        label: "Score",
        data: values,
        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#06b6d4",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#ec4899",
          "#84cc16",
          "#f97316",
          "#6b7280",
          "#14b8a6",
        ],
        borderWidth: 0,
        hoverBorderWidth: 3,
        hoverBorderColor: "#fff",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#374151",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (context: any) => `Score: ${context.parsed.y || context.raw}/100`,
        },
      },
    },
  }

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "#f3f4f6",
        },
        ticks: {
          color: "#6b7280",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          maxRotation: 45,
        },
      },
    },
  }

  const radarOptions = {
    ...chartOptions,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: "#6b7280",
          backdropColor: "transparent",
        },
        grid: {
          color: "#e5e7eb",
        },
        pointLabels: {
          color: "#374151",
          font: {
            size: 12,
          },
        },
      },
    },
  }

  const doughnutOptions = {
    ...chartOptions,
    cutout: "60%",
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: true,
        position: "right" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: "#374151",
        },
      },
    },
  }

  const averageScore = Math.round(values.reduce((sum, score) => sum + score, 0) / values.length)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Resume Score Visualization
                </CardTitle>
                <CardDescription>
                  Visual representation of your resume performance across all criteria
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`glass-badge bg-gradient-to-r ${getScoreBg(averageScore)}`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {averageScore}% Average
                </Badge>
                <Button variant="outline" size="sm" className="glass-button">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={chartType} onValueChange={setChartType} className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass-tabs">
                <TabsTrigger value="radar" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Radar
                </TabsTrigger>
                <TabsTrigger value="bar" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Bar Chart
                </TabsTrigger>
                <TabsTrigger value="doughnut" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Breakdown
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-6 relative">
                <TabsContent value="radar" className="h-[500px] mt-0">
                  <div className="h-full relative">
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Radar data={radarData} options={radarOptions} />
                    </motion.div>
                  </div>
                </TabsContent>
                
                <TabsContent value="bar" className="h-[500px] mt-0">
                  <div className="h-full relative">
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Bar data={barData} options={barOptions} />
                    </motion.div>
                  </div>
                </TabsContent>
                
                <TabsContent value="doughnut" className="h-[500px] mt-0">
                  <div className="h-full relative">
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <Doughnut data={doughnutData} options={doughnutOptions} />
                    </motion.div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Score Summary */}
            <motion.div 
              className="mt-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{values.filter(s => s >= 80).length}</p>
                  <p className="text-xs text-gray-600">Excellent Scores</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{values.filter(s => s >= 60 && s < 80).length}</p>
                  <p className="text-xs text-gray-600">Good Scores</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{values.filter(s => s < 60).length}</p>
                  <p className="text-xs text-gray-600">Need Improvement</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{averageScore}%</p>
                  <p className="text-xs text-gray-600">Overall Average</p>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
