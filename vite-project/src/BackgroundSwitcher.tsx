import React from 'react';

type BackgroundType = 'matrix' | 'grid';


interface BackgroundSwitcherProps {
  current: BackgroundType;
  onChange: (type: BackgroundType) => void;
  theme?: 'green' | 'amber' | 'mono' | 'blue' | 'red';
}

// Small floating control that toggles between the two dynamic backgrounds.
// Kept intentionally lightweight and visual-only — it simply invokes `onChange`.
export function BackgroundSwitcher({ current, onChange, theme = 'green' }: BackgroundSwitcherProps) {
  const themeStyles: Record<string, { text: string; border: string }> = {
    green: { text: 'text-green-400', border: 'border-green-500/30 hover:border-green-500/50' },
    amber: { text: 'text-amber-300', border: 'border-amber-400/30 hover:border-amber-400/50' },
    mono: { text: 'text-neutral-200', border: 'border-neutral-400/30 hover:border-neutral-400/50' },
    blue: { text: 'text-blue-400', border: 'border-blue-500/30 hover:border-blue-500/50' },
    red: { text: 'text-red-400', border: 'border-red-500/30 hover:border-red-500/50' },
  };
  const { text, border } = themeStyles[theme] || themeStyles.green;
  return (
    <button
      className={`fixed bottom-4 right-4 px-3 py-1.5 bg-black/80 border rounded-lg text-sm font-mono z-50 transition-colors duration-200 ${text} ${border}`}
      onClick={() => onChange(current === 'matrix' ? 'grid' : 'matrix')}
      aria-label="Toggle background style"
    >
      {current === 'matrix' ? 'Grid' : 'Matrix'} Background
    </button>
  );
}