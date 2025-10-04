import { useState, useCallback } from 'react';

export type TooltipData = {
  x: number;
  y: number;
  // extra fields (weight, index, lon, lat, etc.)
  [k: string]: unknown;
} | null;

/**
 * Hook to manage map hover tooltip state and create hover handlers.
 * Usage: const { tooltip, makeHoverHandler, cursor } = useMapTooltip();
 * const onHover = makeHoverHandler((obj, info) => ({ weight: obj[2], lon: info.coordinate?.[0] }))
 */
export function useMapTooltip() {
  const [tooltip, setTooltip] = useState<TooltipData>(null);
  const [pointerActive, setPointerActive] = useState(false);

  const clear = useCallback(() => {
    setTooltip(null);
    setPointerActive(false);
  }, []);

  const makeHoverHandler = useCallback((mapObjectToData: (obj: unknown, info: unknown) => Record<string, unknown>) => {
    return (info: unknown) => {
      // info is the DeckGL picking info; we only inspect object/x/y if present
      type PickInfo = { object?: unknown; x?: number; y?: number; coordinate?: number[] };
      const pick = info as PickInfo;
      if (pick && pick.object) {
        const obj = pick.object as unknown;
        const mapped = mapObjectToData(obj, info) || {};
        const x = pick.x ?? 0;
        const y = pick.y ?? 0;
        setTooltip({ x, y, ...mapped });
        setPointerActive(true);
      } else {
        setTooltip(null);
        setPointerActive(false);
      }
      // return false to match DeckGL pick handlers
      return false;
    };
  }, []);

  // Hover handler that only toggles cursor/pointer active state without creating tooltip content
  const makeHoverHandlerSilent = useCallback(() => {
    return (info: unknown) => {
      type PickInfo = { object?: unknown };
      const pick = info as PickInfo;
      if (pick && pick.object) {
        setPointerActive(true);
      } else {
        setPointerActive(false);
      }
      return false;
    };
  }, []);

  const cursor = pointerActive || tooltip ? 'pointer' : 'default';

  return { tooltip, makeHoverHandler, makeHoverHandlerSilent, clear, cursor } as const;
}

export default useMapTooltip;
