import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://resumeRise.techxavvy.in"),
  title: {
    default: "ResumeRise - Professional Resume ATS Analyzer",
    template: "%s | ResumeRise",
  },
  description:
    "Optimize your resume for ATS systems with ResumeRise. Get detailed analysis and feedback to improve your chances of landing interviews.",
  keywords: [
    "resume analysis",
    "ATS optimization",
    "resume checker",
    "job application",
    "resume scanner",
    "ATS compatibility",
    "resume feedback",
    "career tools",
    "ResumeRise",
    "job search",
    "interview success",
    "resume score",
  ],
  authors: [{ name: "TechXavvy" }],
  creator: "TechXavvy",
  publisher: "TechXavvy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resumeRise.techxavvy.in",
    title: "ResumeRise - Professional Resume ATS Analyzer",
    description:
      "Optimize your resume for ATS systems with ResumeRise. Get detailed analysis and feedback to improve your chances of landing interviews.",
    siteName: "ResumeRise",
    images: [
      {
        url: "https://resumeRise.techxavvy.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ResumeRise - Professional Resume ATS Analyzer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeRise - Professional Resume ATS Analyzer",
    description:
      "Optimize your resume for ATS systems with ResumeRise. Get detailed analysis and feedback to improve your chances of landing interviews.",
    images: ["https://resumeRise.techxavvy.in/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://resumeRise.techxavvy.in",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
