"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Target, 
  Zap, 
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3
} from "lucide-react"

interface SectionHeatmap {
  name: string
  score: number
  weight: number
}

interface ModernResumeHeatmapProps {
  sections: SectionHeatmap[]
  industry: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

export function ModernResumeHeatmap({ sections, industry }: ModernResumeHeatmapProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return {
      bg: "from-green-500/20 to-green-500/5",
      text: "text-green-400",
      icon: CheckCircle,
      border: "border-green-500/30"
    }
    if (score >= 60) return {
      bg: "from-yellow-500/20 to-yellow-500/5",
      text: "text-yellow-400",
      icon: AlertCircle,
      border: "border-yellow-500/30"
    }
    return {
      bg: "from-red-500/20 to-red-500/5",
      text: "text-red-400",
      icon: XCircle,
      border: "border-red-500/30"
    }
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
  }

  const averageScore = sections.length > 0 
    ? Math.round(sections.reduce((sum, section) => sum + section.score, 0) / sections.length)
    : 0

  const bestSection = sections.length > 0 
    ? sections.reduce((best, current) => current.score > best.score ? current : best, sections[0])
    : { name: "N/A", score: 0, weight: 0 }
  
  const worstSection = sections.length > 0 
    ? sections.reduce((worst, current) => current.score < worst.score ? current : worst, sections[0])
    : { name: "N/A", score: 0, weight: 0 }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header Card */}
      <motion.div variants={itemVariants}>
        <div className="glass-card border-0 p-6 rounded-2xl">
          <div className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl flex items-center gap-2 font-semibold text-foreground">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Resume Section Analysis
                </h3>
                <p className="text-muted-foreground">
                  Detailed breakdown of each resume section performance for {industry} industry
                </p>
              </div>
              <Badge variant="outline" className="glass-badge">
                <Target className="w-3 h-3 mr-1" />
                {averageScore}% Overall
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
        <div className={`glass-card p-4 rounded-2xl bg-gradient-to-br ${getScoreColor(averageScore).bg} border ${getScoreColor(averageScore).border}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/80">Overall Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(averageScore).text}`}>
                {averageScore}%
              </p>
              <p className="text-xs text-muted-foreground">{getScoreLabel(averageScore)}</p>
            </div>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${getScoreColor(averageScore).bg}`}>
              {(() => {
                const ScoreIcon = getScoreColor(averageScore).icon
                return <ScoreIcon className={`w-6 h-6 ${getScoreColor(averageScore).text}`} />
              })()}
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/80">Best Section</p>
              <p className="text-lg font-semibold text-blue-400">{bestSection.name}</p>
              <p className="text-sm text-muted-foreground">{bestSection.score}% score</p>
            </div>
            <Award className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/80">Needs Focus</p>
              <p className="text-lg font-semibold text-orange-400">{worstSection.name}</p>
              <p className="text-sm text-muted-foreground">{worstSection.score}% score</p>
            </div>
            <TrendingUp className="w-6 h-6 text-orange-400" />
          </div>
        </div>
      </motion.div>

      {/* Section Breakdown */}
      <motion.div variants={itemVariants}>
        <div className="glass-card border-0 p-6 rounded-2xl">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-foreground">Section Performance Breakdown</h4>
            <p className="text-muted-foreground">
              Individual analysis of each resume section with improvement recommendations
            </p>
          </div>
          <div className="space-y-4">            {sections.map((section) => {
              const scoreInfo = getScoreColor(section.score)
              const ScoreIcon = scoreInfo.icon
              
              return (
                <motion.div
                  key={section.name}
                  variants={itemVariants}
                  className={`p-4 rounded-xl bg-gradient-to-r ${scoreInfo.bg} border ${scoreInfo.border} hover:scale-[1.02] transition-all duration-200`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${scoreInfo.bg}`}>
                        <ScoreIcon className={`w-5 h-5 ${scoreInfo.text}`} />
                      </div>
                      <div>
                        <h5 className="font-medium text-foreground">{section.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          Weight: {section.weight}% • {getScoreLabel(section.score)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${scoreInfo.text}`}>{section.score}%</p>
                      <Badge variant="outline" className="text-xs">
                        {getScoreLabel(section.score)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className={scoreInfo.text}>{section.score}%</span>
                    </div>
                    <Progress 
                      value={section.score} 
                      className="h-2 bg-muted/30"
                    />
                  </div>

                  {section.score < 70 && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/20 border border-muted/30">
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Improvement Tip</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {section.name === "Contact Information" && "Ensure all contact details are current and professional"}
                            {section.name === "Professional Summary" && "Add quantifiable achievements and industry keywords"}
                            {section.name === "Work Experience" && "Use action verbs and quantify your accomplishments"}
                            {section.name === "Skills" && "Include relevant technical and soft skills for your target role"}
                            {section.name === "Education" && "List relevant coursework, certifications, and academic achievements"}
                            {!["Contact Information", "Professional Summary", "Work Experience", "Skills", "Education"].includes(section.name) && 
                              "Focus on relevant keywords and clear formatting for this section"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}

            {sections.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Section Data Available</h3>
                <p className="text-muted-foreground">
                  Section analysis will appear here after processing your resume.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
