type PulseOptions = {
  id?: string;
  x: number | string; // px or percentage string like '50%'
  y: number | string;
  size?: number; // diameter in px
  color?: string; // css color
  duration?: number; // seconds
  repeat?: number | 'infinite';
};

// track existing halos by id so repeated calls don't create duplicates
// store container, a refCount and createdAt so multiple callers can request the same halo
const _HALO_REGISTRY = new Map<string, { container: HTMLElement; refCount: number; createdAt: number }>();

let _PULSE_HALO_DEBUG = false;
export function setPulseHaloDebug(enabled: boolean) {
  _PULSE_HALO_DEBUG = !!enabled;
}

export function createPulseHalo(options: PulseOptions) {
  const { id, x, y, size = 120, color = 'rgba(59,130,246,0.9)', duration = 1.6, repeat = 'infinite' } = options;

  const key = id ?? `${x}:${y}:${size}:${color}`;
  if (_HALO_REGISTRY.has(key)) {
    // increment refCount and return a destroy that decrements it
    const existing = _HALO_REGISTRY.get(key)!;
    // replace the inner ring element so animation restarts reliably
    try {
      const oldRing = existing.container.querySelector('.pulse-halo-ring') as HTMLElement | null;
      if (oldRing && oldRing.parentElement) oldRing.parentElement.removeChild(oldRing);
  const newRing = document.createElement('div');
  newRing.className = 'pulse-halo-ring';
  newRing.style.boxShadow = `0 0 0 2px ${color}`;
  newRing.style.animation = `pulse-halo-simple ${duration}s 0s ${repeat}`;
  // inner fill provides a subtle translucent background
  const newFill = document.createElement('div');
  newFill.className = 'pulse-halo-fill';
  // use a weak fallback fill if color isn't parseable
  newFill.style.background = `rgba(255,255,255,0.04)`;
  existing.container.appendChild(newRing);
  existing.container.appendChild(newFill);
    } catch { /* ignore */ }
    existing.refCount += 1;
    let destroyed = false;
    return {
      destroy() {
        if (destroyed) return;
        destroyed = true;
        existing.refCount -= 1;
        if (existing.refCount <= 0) {
          try {
            if (existing.container.parentElement) existing.container.parentElement.removeChild(existing.container);
          } catch { /* ignore */ }
          _HALO_REGISTRY.delete(key);
        }
      }
    };
  }

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = typeof x === 'number' ? `${x}px` : x;
  container.style.top = typeof y === 'number' ? `${y}px` : y;
  container.style.width = `${size}px`;
  container.style.height = `${size}px`;
  container.style.pointerEvents = 'none';
  container.style.transform = 'translate(-50%, -50%)';
  container.style.zIndex = '3000';

  const styleId = 'pulse-halo-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes pulse-halo-simple {
        0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.9; }
        60% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.38; }
        100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
      }
      .pulse-halo-ring {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 100%;
        height: 100%;
        border-radius: 9999px;
        transform-origin: center;
        background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06), rgba(0,0,0,0));
        pointer-events: none;
      }
      .pulse-halo-fill {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 70%;
        height: 70%;
        transform: translate(-50%, -50%);
        border-radius: 9999px;
        pointer-events: none;
        mix-blend-mode: screen;
        filter: blur(6px);
        background: rgba(255,255,255,0.04);
      }
    `;
    document.head.appendChild(style);
  }

  // single ring element (simpler, less DOM churn)
  const ring = document.createElement('div');
  ring.className = 'pulse-halo-ring';
  ring.style.boxShadow = `0 0 0 2px ${color}`;
  ring.style.animation = `pulse-halo-simple ${duration}s 0s ${repeat}`;
  // inner translucent fill
  const fill = document.createElement('div');
  fill.className = 'pulse-halo-fill';
  fill.style.background = `rgba(255,255,255,0.04)`;
  container.appendChild(ring);
  container.appendChild(fill);

  document.body.appendChild(container);
  const now = Date.now();
  // register with refCount 1
  _HALO_REGISTRY.set(key, { container, refCount: 1, createdAt: now });
  if (_PULSE_HALO_DEBUG) {
    console.debug('[pulseHalo] create', { key, x, y, size, color, duration, now, stack: (new Error()).stack });
  }

  let destroyed = false;
  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      const entry = _HALO_REGISTRY.get(key);
      if (entry) {
        entry.refCount -= 1;
        if (_PULSE_HALO_DEBUG) console.debug('[pulseHalo] destroy called', { key, refCount: entry.refCount });
        if (entry.refCount <= 0) {
          try {
            if (container.parentElement) container.parentElement.removeChild(container);
          } catch { /* ignore */ }
          _HALO_REGISTRY.delete(key);
          if (_PULSE_HALO_DEBUG) console.debug('[pulseHalo] removed', { key });
        }
      } else {
        try {
          if (container.parentElement) container.parentElement.removeChild(container);
        } catch { /* ignore */ }
        if (_PULSE_HALO_DEBUG) console.debug('[pulseHalo] removed (no registry entry)', { key });
      }
    }
  };
}

// destroy all active halos (defensive cleanup)
export function clearAllPulseHalos() {
  try {
    for (const [key, entry] of Array.from(_HALO_REGISTRY.entries())) {
      try {
        if (entry.container.parentElement) entry.container.parentElement.removeChild(entry.container);
      } catch { /* ignore */ }
      _HALO_REGISTRY.delete(key);
      if (_PULSE_HALO_DEBUG) console.debug('[pulseHalo] clearAll removed', { key });
    }
  } catch (e) {
    if (_PULSE_HALO_DEBUG) console.debug('[pulseHalo] clearAll error', e);
  }
}
