/** Brief skeleton delay so first paint feels intentional, not flashy. */
import { useEffect, useState } from 'react';

export function usePageReady(ms = 400) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    const t = window.setTimeout(() => setReady(true), ms);
    return () => window.clearTimeout(t);
  }, [ms]);
  return ready;
}
