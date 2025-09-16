import React from 'react';

type BackgroundType = 'matrix' | 'grid';

interface BackgroundSwitcherProps {
  current: BackgroundType;
  onChange: (type: BackgroundType) => void;
}

// Small floating control that toggles between the two dynamic backgrounds.
// Kept intentionally lightweight and visual-only — it simply invokes `onChange`.
export function BackgroundSwitcher({ current, onChange }: BackgroundSwitcherProps) {
  return (
    <button
      className="fixed bottom-4 right-4 px-3 py-1.5 bg-black/80 border border-green-500/30 
                 rounded-lg text-green-400 text-sm hover:bg-black/90 hover:border-green-500/50 
                 transition-colors duration-200 font-mono z-50"
      onClick={() => onChange(current === 'matrix' ? 'grid' : 'matrix')}
      aria-label="Toggle background style"
    >
      {current === 'matrix' ? 'Grid' : 'Matrix'} Background
    </button>
  );
}