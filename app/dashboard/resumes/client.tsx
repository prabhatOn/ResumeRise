"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Eye, Download, Calendar, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

interface Analysis {
  totalScore: number
  atsScore?: number | null
  keywordScore?: number | null
  formattingScore?: number | null
  sectionScore?: number | null
  suggestions?: string | null
  createdAt: Date
}

interface Resume {
  id: number
  title: string
  fileType: string
  content: string
  createdAt: Date
  analyses: Analysis[]
}

interface ResumesPageClientProps {
  resumes: Resume[]
}

export default function ResumesPageClient({ resumes }: ResumesPageClientProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()
  
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this resume?")) return
    
    setDeletingId(id)
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        router.refresh()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete resume")
      }    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Delete error:", error)
      alert(`Failed to delete resume: ${error instanceof Error ? error.message : "Please try again."}`)
    }finally {
      setDeletingId(null)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  if (resumes.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Resumes</h1>
          <Button onClick={() => router.push("/dashboard/upload")}>
            Upload Resume
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resumes uploaded yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Upload your first resume to get started with ATS analysis and improvements.
            </p>
            <Button onClick={() => router.push("/dashboard/upload")}>
              Upload Your First Resume
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <Button onClick={() => router.push("/dashboard/upload")}>
          Upload Resume
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => {
          const latestAnalysis = resume.analyses[0]
          const score = latestAnalysis?.totalScore || 0
          
          return (
            <Card key={resume.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg truncate">{resume.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {latestAnalysis && (
                    <Badge variant={getScoreBadgeVariant(score)}>
                      {score}%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {latestAnalysis && (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Latest Analysis:</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {latestAnalysis.atsScore !== null && (
                          <div>
                            <span className="text-muted-foreground">ATS:</span>
                            <span className={`ml-1 font-medium ${getScoreColor(latestAnalysis.atsScore || 0)}`}>
                              {latestAnalysis.atsScore}%
                            </span>
                          </div>
                        )}
                        {latestAnalysis.keywordScore !== null && (
                          <div>
                            <span className="text-muted-foreground">Keywords:</span>
                            <span className={`ml-1 font-medium ${getScoreColor(latestAnalysis.keywordScore || 0)}`}>
                              {latestAnalysis.keywordScore}%
                            </span>
                          </div>
                        )}
                        {latestAnalysis.formattingScore !== null && (
                          <div>
                            <span className="text-muted-foreground">Format:</span>
                            <span className={`ml-1 font-medium ${getScoreColor(latestAnalysis.formattingScore || 0)}`}>
                              {latestAnalysis.formattingScore}%
                            </span>
                          </div>
                        )}
                        {latestAnalysis.sectionScore !== null && (
                          <div>
                            <span className="text-muted-foreground">Sections:</span>
                            <span className={`ml-1 font-medium ${getScoreColor(latestAnalysis.sectionScore || 0)}`}>
                              {latestAnalysis.sectionScore}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/dashboard/resumes/${resume.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/api/resumes/${resume.id}/download`)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(resume.id)}
                      disabled={deletingId === resume.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}