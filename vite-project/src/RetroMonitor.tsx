import React, { useEffect, useState, useRef } from 'react';

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
  // State for NET LED blinking
  const [netOn, setNetOn] = useState(true);

  // Easter egg: falling SVG logo
  const [falling, setFalling] = useState(false);
  const [fallX, setFallX] = useState(0);
  const fallRef = useRef<HTMLDivElement>(null);

  // Random rapid blinking effect for NET LED
  useEffect(() => {
    let timeout: number;
    function blink() {
      setNetOn((on) => !on);
      // Random interval between 60ms and 220ms
      timeout = window.setTimeout(blink, 60 + Math.random() * 160);
    }
    blink();
    return () => clearTimeout(timeout);
  }, []);

  // Handle falling SVG animation
  useEffect(() => {
    if (falling) {
      const timer = setTimeout(() => setFalling(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [falling]);

  function triggerFallingLogo() {
    // Pick a random X position within the viewport width
    const vw = window.innerWidth;
    const iconWidth = 32;
    const min = 0;
    const max = vw - iconWidth;
    setFallX(Math.floor(Math.random() * (max - min + 1)) + min);
    setFalling(false); // reset if already falling
    setTimeout(() => setFalling(true), 10);
  }

  return (
    <div className="w-[95vw] h-[85vh] max-w-[1400px] bg-neutral-800 rounded-[2.5rem] p-6 md:p-8 lg:p-12 relative shadow-monitor
                  before:content-[''] before:absolute before:inset-0 before:rounded-[2.5rem] before:border-t-4 before:border-neutral-600/30
                  after:content-[''] after:absolute after:inset-0 after:rounded-[2.5rem] after:shadow-inner-strong">
      {/* Monitor Brand Label - pill at bottom center, always above screen, now clickable */}
      <div className="pointer-events-auto">
        <div
          className="absolute left-1/2 bottom-3 -translate-x-1/2 flex items-center justify-center h-6 z-50 cursor-pointer group"
          style={{ transform: 'translate(-50%, 0)' }}
          onClick={triggerFallingLogo}
          tabIndex={0}
          aria-label="Trigger Dynotron Easter Egg"
        >
          <div className="px-4 py-1 bg-neutral-600/90 rounded-full shadow border border-neutral-700 text-neutral-400 text-xs font-mono tracking-wide flex items-center justify-center select-none h-6 opacity-90 group-hover:opacity-100 transition-opacity">
            DYNØ·TRON 2025
          </div>
        </div>
        {/* Falling SVG logo animation */}
        {falling && (
          <div
            ref={fallRef}
            style={{
              position: 'fixed',
              left: fallX,
              top: 0,
              width: 32,
              height: 32,
              zIndex: 1000,
              pointerEvents: 'none',
              animation: 'fall-logo 1.1s cubic-bezier(0.4,0.8,0.6,1) forwards',
            }}
          >
            <img src="/zero-one-icon.svg" alt="A0/1C logo" width={32} height={32} draggable={false} />
          </div>
        )}
        {/* Keyframes for falling animation */}
        <style>{`
          @keyframes fall-logo {
            0% { transform: translateY(-40px) scale(1) rotate(-10deg); opacity: 0.7; }
            10% { opacity: 1; }
            80% { transform: translateY(${typeof window !== 'undefined' ? '80vh' : '80vh'}) scale(1.1) rotate(8deg); opacity: 1; }
            100% { transform: translateY(100vh) scale(0.95) rotate(0deg); opacity: 0; }
          }
        `}</style>
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
            <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-glow-amber" />
            <span className="text-[8px] text-neutral-400 mt-1">HDD</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-3 h-3 rounded-full shadow-glow-green transition-opacity duration-75 ${netOn ? 'bg-green-500/80 opacity-100' : 'bg-green-900/30 opacity-20'}`} />
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
  <div className="absolute -left-4 bottom-8 flex flex-col items-center h-[220px] w-12 bg-neutral-700 rounded-l-lg p-2">
    {/* Power Button (deep blue) */}
    <div className="w-8 h-8 rounded-full bg-neutral-900 ring-2 ring-neutral-600 flex items-center justify-center shadow-inner-strong aspect-square" style={{ marginBottom: '0.5rem' }}>
      <div className="w-5 h-5 rounded-full" style={{ background: 'linear-gradient(135deg, #0077b6 60%, #00b4d8 100%)', boxShadow: '0 0 12px 2px #00b4d8cc' }} />
    </div>
    {/* USB and COM Ports */}
    <div className="w-8 flex flex-col gap-2" style={{ marginBottom: '0.5rem' }}>
      <div className="h-6 bg-neutral-900/80 rounded-sm flex items-center justify-center text-[8px] text-neutral-500">USB</div>
      <div className="h-6 bg-neutral-900/80 rounded-sm flex items-center justify-center text-[8px] text-neutral-500">COM</div>
    </div>
    {/* Vertically center the ports as a group */}
    <div className="flex flex-col items-center justify-center flex-grow w-full" style={{ minHeight: 0 }}>
      <div className="w-full flex flex-col items-center gap-2">
        {/* PS/2 Keyboard Port (purple) */}
  <div className="flex flex-col items-center justify-center h-10 w-10 rounded-full aspect-square">
          <div className="relative w-7 h-7 rounded-full bg-purple-900 border-2 border-neutral-800 shadow-inner flex items-center justify-center aspect-square">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-purple-800/80 flex items-center justify-center">
                {/* Pin holes, all inside the colored circle */}
                <div className="absolute w-full h-full flex flex-col items-center justify-center">
                  <div className="flex justify-between w-4 absolute top-1 left-1 right-1">
                    <div className="w-1 h-1 rounded-full bg-black" />
                    <div className="w-1 h-1 rounded-full bg-black" />
                  </div>
                  <div className="flex justify-between w-4 absolute bottom-1 left-1 right-1">
                    <div className="w-1 h-1 rounded-full bg-black" />
                    <div className="w-1 h-1 rounded-full bg-black" />
                  </div>
                  <div className="flex items-center justify-center absolute inset-0">
                    <div className="w-1 h-1 rounded-full bg-black" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span className="mt-1 text-[8px] text-purple-400 font-bold">KB</span>
        </div>
        {/* PS/2 Mouse Port (green) */}
  <div className="flex flex-col items-center justify-center h-10 w-10 rounded-full aspect-square">
          <div className="relative w-7 h-7 rounded-full bg-green-900 border-2 border-neutral-800 shadow-inner flex items-center justify-center aspect-square">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-green-800/80 flex items-center justify-center">
                {/* Pin holes, all inside the colored circle */}
                <div className="absolute w-full h-full flex flex-col items-center justify-center">
                  <div className="flex justify-between w-4 absolute top-1 left-1 right-1">
                    <div className="w-1 h-1 rounded-full bg-black" />
                    <div className="w-1 h-1 rounded-full bg-black" />
                  </div>
                  <div className="flex justify-between w-4 absolute bottom-1 left-1 right-1">
                    <div className="w-1 h-1 rounded-full bg-black" />
                    <div className="w-1 h-1 rounded-full bg-black" />
                  </div>
                  <div className="flex items-center justify-center absolute inset-0">
                    <div className="w-1 h-1 rounded-full bg-black" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span className="mt-1 text-[8px] text-green-400 font-bold">MS</span>
        </div>
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
