"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ATSIssue {
  type: string
  description: string
  impact: number
  solution: string
}

interface ATSCheckResult {
  score: number
  issues: ATSIssue[]
  passedChecks: string[]
}

interface ATSCompatibilityDetailsProps {
  atsDetails: ATSCheckResult
}

export function ATSCompatibilityDetails({ atsDetails }: ATSCompatibilityDetailsProps) {
  // Sort issues by impact (highest first)
  const sortedIssues = [...atsDetails.issues].sort((a, b) => b.impact - a.impact)

  return (
    <Card>
      <CardHeader>
        <CardTitle>ATS Compatibility Analysis</CardTitle>
        <CardDescription>Detailed analysis of your resume's compatibility with ATS systems</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">Overall ATS Score</div>
              <Badge variant={atsDetails.score >= 80 ? "default" : "destructive"}>{atsDetails.score}/100</Badge>
            </div>
            <Progress value={atsDetails.score} />
            <p className="text-sm text-muted-foreground">
              {atsDetails.score >= 90
                ? "Excellent! Your resume is highly ATS-compatible."
                : atsDetails.score >= 80
                  ? "Good. Your resume should pass most ATS systems, but there's room for improvement."
                  : atsDetails.score >= 60
                    ? "Fair. Your resume may pass some ATS systems, but needs improvements."
                    : "Poor. Your resume is likely to be rejected by ATS systems. Significant improvements needed."}
            </p>
          </div>

          {sortedIssues.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Issues Found</h3>
              <div className="space-y-3">
                {sortedIssues.map((issue, index) => (
                  <div key={index} className="rounded-md border p-3">
                    <div className="flex items-start gap-2">
                      {issue.impact > 15 ? (
                        <XCircle className="mt-0.5 h-4 w-4 text-red-500" />
                      ) : issue.impact > 8 ? (
                        <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium">{issue.description}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Solution:</span> {issue.solution}
                        </p>
                        <div className="mt-2">
                          <Badge variant="outline">Impact: -{issue.impact} points</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {atsDetails.passedChecks.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Passed Checks</h3>
              <div className="space-y-2">
                {atsDetails.passedChecks.map((check, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <p>{check}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-md bg-muted p-4">
            <h3 className="font-medium mb-2">What is ATS?</h3>
            <p className="text-sm text-muted-foreground">
              Applicant Tracking Systems (ATS) are software applications that employers use to manage job applications.
              They scan and filter resumes before a human ever sees them. Up to 75% of resumes are rejected by ATS
              before reaching a hiring manager. Ensuring your resume is ATS-compatible is crucial for job search
              success.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
