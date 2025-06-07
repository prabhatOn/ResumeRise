import { ModernHeader } from "@/components/modern-header"
import ModernFooter from "@/components/modern-footer"
import type { Metadata } from "next"
import AboutPageContent from "./about-content"

export const metadata: Metadata = {
  title: "About Us - ResumeRise",
  description:
    "Learn about ResumeRise, our mission to help job seekers optimize their resumes for ATS systems, and the team behind our platform.",
  alternates: {
    canonical: "https://name-of-the-site.techxavvy.in/about",
  },
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Header */}
      <ModernHeader />

      {/* Main Content */}
      <AboutPageContent />

      {/* Footer */}
      <ModernFooter />
    </div>
  )
}
