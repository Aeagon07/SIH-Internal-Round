import { useEffect, useRef, useState } from 'react';

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useAnimatedCounter(target: number, duration = 1500, shouldStart = true) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!shouldStart) return;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, shouldStart]);

  return value;
}
