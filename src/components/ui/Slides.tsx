import { useState, useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { setPulseHaloDebug, clearAllPulseHalos } from './pulseHalo';
import { SidebarContext } from '../Sidebar/Sidebar';

export type Slide = {
  title: string;
  text: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center' | 'center-left' | 'center-right';
  // optionally request a sidebar tab to open while this slide is active
  sidebarTab?: 'knowledgehub' | 'sharkmap' | 'predict' | 'meet' | null;
  action?: () => void;
  actionLabel?: string;
};

type SlidesProps = {
  slides: Slide[];
  onClose?: () => void;
};

const positionToClass: Record<NonNullable<Slide['position']>, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'center': 'inset-0 flex items-center justify-center',
  'center-left': 'inset-y-0 left-4 flex items-center',
  'center-right': 'inset-y-0 right-4 flex items-center',
};

export function Slides({ slides, onClose }: SlidesProps) {
  const [index, setIndex] = useState(0);
  const cur = slides[index];
  const sidebar = useContext(SidebarContext);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const actionCleanup = useRef<null | (() => void)>(null);
  const lastRunRef = useRef<Record<number, number>>({});

  if (!cur) return null;

  const pos = cur.position || 'center';
  // always use fixed so inset-0 and top/bottom positioning reference the viewport
  const containerClass = `fixed ${positionToClass[pos]}`;

  useEffect(() => {
    // create a portal container attached to body so the dialog isn't clipped by sidebar
    const el = document.createElement('div');
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      try {
        document.body.removeChild(el);
      } catch (e) {
        // ignore
      }
      setPortalEl(null);
    };
  }, []);

  const content = (
    <AnimatePresence>
      <>
        {/* backdrop: visually dims but is click-through so the user can interact with the map */}
        <motion.div
          key="backdrop"
          className="fixed inset-0 bg-black/50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

  <div className={`${containerClass} pointer-events-none`} style={{ zIndex: 2000 }}>
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 8, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.995 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className={`max-w-md w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 text-white shadow-xl`}
            // ensure the panel still receives pointer events
            style={{ maxHeight: '70vh', overflow: 'hidden', pointerEvents: 'auto' } as React.CSSProperties}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold">{cur.title}</h3>
                <div className="mt-2 text-md opacity-90 max-h-[55vh] overflow-auto">
                  <div style={{ whiteSpace: 'pre-wrap' }}>{cur.text}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  aria-label="close slides"
                  onClick={() => {
                    onClose?.();
                  }}
                  className="text-sm text-white/80 hover:text-white border border-white rounded-full"
                >
                  <X className='w-5 h-5 ' />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  disabled={index === 0}
                  className="px-3 py-1 rounded bg-white/6 disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  onClick={() => setIndex((i) => Math.min(slides.length - 1, i + 1))}
                  disabled={index === slides.length - 1}
                  className="px-3 py-1 rounded bg-white/6 disabled:opacity-40"
                >
                  Next
                </button>
              </div>

              <div>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    </AnimatePresence>
  );

  // run the slide action automatically when the index changes
  useEffect(() => {
    // cleanup previous
    if (actionCleanup.current) {
      try { actionCleanup.current(); } catch { /* ignore */ }
      actionCleanup.current = null;
    }

    // defensive: ensure any stray halos are removed when switching slides
    try { clearAllPulseHalos(); } catch { /* ignore */ }

    if (!cur) return;
    // If the slide explicitly includes a `sidebarTab` property, respect it.
    // (This lets slides request `sidebarTab: 'sharkmap'` to open the tab,
    // or `sidebarTab: null` to explicitly close. If the property is absent,
    // do nothing so we don't accidentally close tabs between slides.)
    if (sidebar && typeof sidebar.openTab === 'function' && Object.prototype.hasOwnProperty.call(cur, 'sidebarTab')) {
      try {
        console.debug('[Slides] requesting openTab', cur.sidebarTab);
        sidebar.openTab(cur.sidebarTab as any);
      } catch { /* ignore */ }
    }
    if (cur.action) {

      // avoid immediate duplicate runs (e.g., StrictMode double-invoke) by ignoring runs within 500ms
      const now = Date.now();
      const last = lastRunRef.current[index] ?? 0;
      if (now - last < 500) return;
      lastRunRef.current[index] = now;

      try {
        // enable debug around the action so pulseHalo can log create/reuse/destroy
        setPulseHaloDebug(true);
        const res = cur.action();
        // if the action returns a cleanup function or an object with destroy(), use it
        if (typeof res === 'function') actionCleanup.current = res as () => void;
        else if (res !== undefined && res !== null && typeof (res as any).destroy === 'function') {
          const obj = res as any;
          actionCleanup.current = () => obj.destroy();
        }
      } catch (e) {
        console.debug('slide action error', e);
      } finally {
        // keep debug on slightly longer to capture any immediate logs; disable after a short tick
        setTimeout(() => setPulseHaloDebug(false), 1200);
      }
    }

    return () => {
      if (actionCleanup.current) {
        try { actionCleanup.current(); } catch { /* ignore */ }
        actionCleanup.current = null;
      }
      // Do not automatically close sidebar tabs on slide change.
      // Sidebar stays as last requested by a slide until a later slide explicitly requests a different value.
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, slides]);

  if (!portalEl) return null;
  return createPortal(content, portalEl);
}
