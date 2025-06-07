import { NextResponse } from "next/server"

type ErrorWithMessage = {
  message: string
  status?: number
  code?: string
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  )
}

export function toErrorWithMessage(error: unknown): ErrorWithMessage {
  if (isErrorWithMessage(error)) return error

  try {
    return new Error(JSON.stringify(error))
  } catch {
    // fallback in case there's an error stringifying the error
    return new Error(String(error))
  }
}

export function getErrorStatus(error: unknown): number {
  if (isErrorWithMessage(error) && error.status) {
    return error.status
  }

  // Check for Prisma errors
  if (isErrorWithMessage(error) && error.code) {
    // Handle common Prisma error codes
    switch (error.code) {
      case "P2002":
        return 409 // Unique constraint violation
      case "P2025":
        return 404 // Record not found
      case "P2003":
        return 409 // Foreign key constraint violation
      case "P2014":
        return 400 // Invalid value for field
      case "P1008":
        return 500 // Database timeout
      case "P1001":
        return 503 // Can't reach database server
      default:
        return 500
    }
  }

  return 500
}

export function getErrorMessage(error: unknown): string {
  const errorObj = toErrorWithMessage(error)
  
  // Provide user-friendly messages for common Prisma errors
  if (errorObj.code) {
    switch (errorObj.code) {
      case "P2002":
        return "A record with this information already exists."
      case "P2025":
        return "The requested record was not found."
      case "P2003":
        return "This operation violates a data relationship constraint."
      case "P1001":
        return "Unable to connect to the database. Please try again later."
      case "P1008":
        return "Database operation timed out. Please try again."
      default:
        return errorObj.message
    }
  }
  
  return errorObj.message
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error)

  const message = getErrorMessage(error)
  const status = getErrorStatus(error)

  return NextResponse.json({ message: message || "Something went wrong" }, { status })
}
