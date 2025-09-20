import React from 'react';

type ThemeClasses = { text: string; accent: string; caret: string };

interface RetroMonitorProps {
  children?: React.ReactNode;
  onClick?: () => void;
  themeClasses: ThemeClasses;
}

// RetroMonitor encapsulates the visual monitor bezel, side controls and stand.
// The actual screen content should be passed as `children` so the parent
// component keeps all logic (input handling, history) while this file
// focuses purely on presentation.
export default function RetroMonitor({ children, onClick, themeClasses }: RetroMonitorProps) {
  return (
    <div className="w-[95vw] h-[85vh] max-w-[1400px] bg-neutral-800 rounded-[2.5rem] p-6 md:p-8 lg:p-12 relative shadow-monitor
                  before:content-[''] before:absolute before:inset-0 before:rounded-[2.5rem] before:border-t-4 before:border-neutral-600/30
                  after:content-[''] after:absolute after:inset-0 after:rounded-[2.5rem] after:shadow-inner-strong">
      {/* Monitor Brand Label */}
      <div className="absolute -top-3 left-12 px-4 py-1 bg-neutral-700 rounded-b-lg text-neutral-400 text-xs font-mono tracking-wider">
        DYNØ·TRON 2025
      </div>

      {/* Control Panel (right) - fixed vertical alignment and container height */}
      <div className="absolute -right-3 top-8 flex flex-col items-center justify-center h-[220px] w-12 bg-neutral-700 rounded-r-lg p-2 gap-4">
        {/* Status Lights - labels below, horizontal */}
        <div className="w-8 flex flex-col gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse shadow-glow-red" />
            <span className="text-[8px] text-neutral-400 mt-1">PWR</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-glow-green" />
            <span className="text-[8px] text-neutral-400 mt-1">HDD</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-glow-amber" />
            <span className="text-[8px] text-neutral-400 mt-1">NET</span>
          </div>
        </div>
        {/* Knobs */}
        <div className="w-8 flex flex-col gap-2 items-center">
          <div className="w-4 h-4 rounded-full bg-neutral-900 ring-1 ring-neutral-600 shadow-inner" />
          <div className="w-4 h-4 rounded-full bg-neutral-900 ring-1 ring-neutral-600 shadow-inner" />
        </div>
      </div>

  {/* Left Side Controls - moved to bottom left */}
  <div className="absolute -left-4 bottom-8 flex flex-col items-center justify-center h-[220px] w-12 bg-neutral-700 rounded-l-lg p-2 gap-4">
        {/* Power Button */}
        <div className="w-8 h-8 rounded-full bg-neutral-900 ring-2 ring-neutral-600 flex items-center justify-center shadow-inner-strong">
          <div className="w-5 h-5 rounded-full bg-green-500/30 animate-pulse shadow-glow-green" />
        </div>
        {/* USB and COM Ports */}
        <div className="w-8 flex flex-col gap-2">
          <div className="h-6 bg-neutral-900/80 rounded-sm flex items-center justify-center text-[8px] text-neutral-500">USB</div>
          <div className="h-6 bg-neutral-900/80 rounded-sm flex items-center justify-center text-[8px] text-neutral-500">COM</div>
        </div>
        {/* Floppy A and B */}
        <div className="w-8 flex flex-col gap-2">
          <div className="relative h-8 bg-neutral-900/80 rounded-sm px-1 flex items-center justify-center">
            <div className="absolute right-1 w-1 h-1 rounded-full bg-green-500/50" />
            <span className="text-[8px] text-neutral-500 rotate-90 translate-y-3">A:</span>
          </div>
          <div className="relative h-8 bg-neutral-900/80 rounded-sm px-1 flex items-center justify-center">
            <div className="absolute right-1 w-1 h-1 rounded-full bg-amber-500/50" />
            <span className="text-[8px] text-neutral-500 rotate-90 translate-y-3">B:</span>
          </div>
        </div>
      </div>

      {/* Screen Inner (click focuses input via onClick) */}
      <div 
        className={`crt-monitor w-full h-full bg-black rounded-xl ${themeClasses.text} font-mono 
                  selection:bg-white/10 selection:text-white border-b-8 border-neutral-900/50
                  shadow-inner-screen overflow-hidden`}
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  );
}
