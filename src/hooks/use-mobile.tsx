import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Check if window is defined (runs only on client)
    if (typeof window === 'undefined') {
      return;
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial check
    onChange();

    // Listener for changes
    mql.addEventListener("change", onChange)

    // Cleanup listener on unmount
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array ensures this runs once on mount (client-side)

  return isMobile // Return the state directly (could be undefined initially)
}
