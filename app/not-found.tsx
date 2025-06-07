import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground" />
      <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">Sorry, we couldn't find the page you're looking for.</p>
      <Link href="/" className="mt-6">
        <Button>Return to Home</Button>
      </Link>
    </div>
  )
}
