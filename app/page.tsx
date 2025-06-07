import Script from "next/script"
import type { Metadata } from "next"
import { ModernHeader } from "@/components/modern-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import TestimonialsSection from "@/components/testimonials-section"
import PricingSection from "@/components/pricing-section"
import ModernFooter from "@/components/modern-footer"

export const metadata: Metadata = {
  title: "ResumeATS - AI-Powered Resume Optimization for Job Success",
  description:
    "Transform your resume with AI-powered ATS analysis. Get detailed insights, keyword optimization, and industry-specific recommendations to land your dream job.",
  alternates: {
    canonical: "https://resumeats.com",
  },
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Script id="schema-org" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ResumeATS",
            "url": "https://resumeats.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://resumeats.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        `}
      </Script>
      <Script id="organization-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ResumeATS",
            "url": "https://resumeats.com",
            "logo": "https://resumeats.com/logo.png",
            "sameAs": [
              "https://twitter.com/resumeats",
              "https://facebook.com/resumeats",
              "https://linkedin.com/company/resumeats"
            ]
          }
        `}
      </Script>
      <Script id="software-application-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ResumeATS Analyzer",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "2048"
            }
          }
        `}
      </Script>
      
      {/* Modern Header */}
      <ModernHeader />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />
          {/* Features Section */}
        <FeaturesSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* Pricing Section */}
        <PricingSection />
      </main>
      
      {/* Modern Footer */}
      <ModernFooter />
    </div>
  )
}