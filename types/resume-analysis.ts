// Suggestion type for AI-powered suggestions
export interface Suggestion {
  category?: 'content' | 'structure' | 'keywords' | 'formatting' | 'ats' | 'optimization';
  priority?: 'critical' | 'high' | 'medium' | 'low';
  message?: string;
  impact?: string;
  implementation?: string;
  suggestion?: string;
  estimatedTime?: string;
  scoreImprovement?: number;
}

// Keyword optimization result type
export interface KeywordOptimization {
  missing_keywords: string[];
  placement_recommendations: Array<{
    keyword: string;
    section: string;
    reason: string;
  }>;
}

// ATS report type
export interface ATSReport {
  ats_score: number;
  compatibility_issues: Array<{
    issue: string;
    solution: string;
    impact: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>;
}
