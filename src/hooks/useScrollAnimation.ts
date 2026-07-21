import { useEffect, useRef } from 'react'

export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    )

    const el = ref.current
    if (el) {
      const animated = el.querySelectorAll('.fade-up, .fade-left, .fade-right')
      animated.forEach((el) => observer.observe(el))
    }

    return () => observer.disconnect()
  }, [])

  return ref
}

export function useNavScroll() {
  useEffect(() => {
    const navbar = document.querySelector('.navbar') as HTMLElement
    const handler = () => {
      if (window.scrollY > 60) {
        navbar?.classList.add('scrolled')
      } else {
        navbar?.classList.remove('scrolled')
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
