import { useState, useEffect } from "react";

/**
 * Custom hook to check if the component is mounted on the client.
 * Useful for avoiding hydration mismatches when using browser-only APIs like localStorage.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
