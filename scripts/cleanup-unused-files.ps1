# PowerShell script to delete unused/empty files from the codebase
$unusedFiles = @(
  "b:\project\resume-ats\components\ai-suggestions.tsx",
  "b:\project\resume-ats\components\portfolio-analytics.tsx",
  "b:\project\resume-ats\components\resume-improvement-hub.tsx",
  "b:\project\resume-ats\components\personalized-suggestions.tsx",
  "b:\project\resume-ats\components\resume-loading.tsx",
  "b:\project\resume-ats\components\real-time-ai-suggestions-new.tsx",
  "b:\project\resume-ats\test-keyword-fix.js"
)
foreach ($file in $unusedFiles) {
  if (Test-Path $file) {
    Remove-Item $file -Force
    Write-Host "Deleted: $file"
  }
}
