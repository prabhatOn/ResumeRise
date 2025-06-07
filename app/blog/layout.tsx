import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - ResumeRise",
  description:
    "Read our latest articles about resume optimization, ATS compatibility, job search tips, and career advice.",
  alternates: {
    canonical: "https://resumerise.techxavvy.in/blog",
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
