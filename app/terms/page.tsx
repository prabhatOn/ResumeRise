import Link from "next/link"
import { FileCheck } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - ResumeRise",
  description: "Read our terms of service to understand the rules and guidelines for using the ResumeRise platform.",
  alternates: {
    canonical: "https://name-of-the-site.techxavvy.in/terms",
  },
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <FileCheck className="h-6 w-6" aria-hidden="true" />
            <span className="text-xl font-bold">ResumeRise</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12">
          <div className="mx-auto max-w-[800px]">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <p className="text-gray-500 mb-8">Last updated: April 25, 2024</p>

            <div className="prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Welcome to ResumeRise. These Terms of Service govern your use of our website located at
                https://name-of-the-site.techxavvy.in and form a binding legal agreement between you and ResumeRise.
              </p>

              <h2>2. Acceptance of Terms</h2>
              <p>
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part
                of the terms, you may not access the Service.
              </p>

              <h2>3. Description of Service</h2>
              <p>
                ResumeRise provides tools for analyzing resumes for ATS compatibility and providing feedback for
                improvement.
              </p>

              <h2>4. User Accounts</h2>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current
                at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate
                termination of your account on our Service.
              </p>

              <h2>5. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive
                property of ResumeRise. The Service is protected by copyright, trademark, and other laws.
              </p>

              <h2>6. User Content</h2>
              <p>
                You retain all rights to any content you submit, post or display on or through the Service. By uploading
                content, you grant us a worldwide, non-exclusive license to use, reproduce, and modify such content
                solely for the purpose of providing the Service.
              </p>

              <h2>7. Privacy Policy</h2>
              <p>
                Please review our Privacy Policy, which also governs your use of the Service and explains how we
                collect, safeguard and disclose information that results from your use of our web pages.
              </p>

              <h2>8. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms.
              </p>

              <h2>9. Limitation of Liability</h2>
              <p>
                In no event shall ResumeRise, nor its directors, employees, partners, agents, suppliers, or affiliates,
                be liable for any indirect, incidental, special, consequential or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
                to or use of or inability to access or use the Service.
              </p>

              <h2>10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material we will try to provide at least 30 days' notice prior to any new terms taking
                effect.
              </p>

              <h2>11. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@name-of-the-site.techxavvy.in.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2024 ResumeRise. All rights reserved.
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
