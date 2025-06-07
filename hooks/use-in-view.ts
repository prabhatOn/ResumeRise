import { useEffect, useState, RefObject } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
  amount?: number
}

export function useInView(
  ref: RefObject<HTMLElement | null>,
  options: UseInViewOptions = {}
): boolean {
  const [isInView, setIsInView] = useState(false)
  const { threshold = 0, rootMargin = '0px', once = false, amount = 0 } = options
  const finalThreshold = amount || threshold

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold: finalThreshold, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, finalThreshold, rootMargin, once])

  return isInView
}
