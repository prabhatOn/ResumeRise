import Link from "next/link"
import { FileCheck } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Resume ATS",
  description:
    "Read our privacy policy to understand how we collect, use, and protect your personal information on the Resume ATS platform.",
  alternates: {
    canonical: "https://name-of-the-site.techxavvy.in/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <FileCheck className="h-6 w-6" aria-hidden="true" />
            <span className="text-xl font-bold">Resume ATS</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12">
          <div className="mx-auto max-w-[800px]">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-gray-500 mb-8">Last updated: April 25, 2024</p>

            <div className="prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                At Resume ATS, we respect your privacy and are committed to protecting your personal data. This Privacy
                Policy explains how we collect, use, and safeguard your information when you use our website and
                services.
              </p>

              <h2>2. Information We Collect</h2>
              <p>We collect several types of information from and about users of our website, including:</p>
              <ul>
                <li>Personal identifiers such as name and email address</li>
                <li>Account credentials</li>
                <li>Resume content and job descriptions you upload</li>
                <li>Usage data and analytics</li>
                <li>Device and browser information</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect about you for various purposes, including:</p>
              <ul>
                <li>Providing and maintaining our service</li>
                <li>Analyzing and improving your resume</li>
                <li>Communicating with you about your account or our services</li>
                <li>Improving our website and services</li>
                <li>Protecting against unauthorized access and legal liability</li>
              </ul>

              <h2>4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information from unauthorized
                access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or
                electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2>5. Data Retention</h2>
              <p>
                We will retain your personal information only for as long as necessary to fulfill the purposes outlined
                in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>

              <h2>6. Your Data Protection Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul>
                <li>The right to access your personal data</li>
                <li>The right to rectification of inaccurate data</li>
                <li>The right to erasure of your data</li>
                <li>The right to restrict processing of your data</li>
                <li>The right to data portability</li>
                <li>The right to object to processing of your data</li>
              </ul>

              <h2>7. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and store certain
                information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being
                sent.
              </p>

              <h2>8. Third-Party Services</h2>
              <p>
                Our service may contain links to third-party websites or services that are not owned or controlled by
                Resume ATS. We have no control over and assume no responsibility for the content, privacy policies, or
                practices of any third-party sites or services.
              </p>

              <h2>9. Children's Privacy</h2>
              <p>
                Our service is not intended for use by children under the age of 16. We do not knowingly collect
                personally identifiable information from children under 16.
              </p>

              <h2>10. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2>11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at
                privacy@name-of-the-site.techxavvy.in.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2024 Resume ATS. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-gray-500 underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
