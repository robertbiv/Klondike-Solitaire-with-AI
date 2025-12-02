import { useEffect, useState } from 'react';

/**
 * Custom hook to scale content to fit the viewport.
 * 
 * How it works:
 * 1. Measures the element's natural size (offsetWidth/Height)
 * 2. Compares to available viewport space (minus padding and reserved areas)
 * 3. Returns a scale factor (<= maxScale) to shrink content if needed
 * 4. Recalculates on window resize for responsive behavior
 * 
 * Options:
 * - padding: space to leave around edges (default 32px)
 * - maxScale: never scale larger than this (default 1 = no enlargement)
 * - reservedRight: subtract this width (for sidebars, etc.)
 * - reservedBottom: subtract this height (for footers, etc.)
 */
export default function useScaleToFit(ref, { padding = 32, maxScale = 1, reservedRight = 0, reservedBottom = 0 } = {}) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function recalc() {
      if (!ref.current) return;
      const el = ref.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const targetW = el.offsetWidth;
      const targetH = el.offsetHeight;
      if (!targetW || !targetH) return;
      const availW = Math.max(0, vw - padding * 2 - reservedRight);
      const availH = Math.max(0, vh - padding * 2 - reservedBottom);
      const s = Math.min(maxScale, Math.min(availW / targetW, availH / targetH));
      setScale(s <= 0 ? 1 : s);
    }
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [ref, padding, maxScale, reservedRight, reservedBottom]);

  return scale;
}
