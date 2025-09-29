import React, { useEffect, useState } from 'react';
import './matrix.css';

// MatrixBackground: animated vertical streams of binary characters.
// Columns are generated with randomized position/speed/delay so the background
// feels organic. The component regenerates a few columns periodically to
// maintain motion across the viewport.

const CHARACTERS = '01';
const NUM_COLUMNS = 200; // Increased for better coverage

interface Column {
  id: number;
  x: number;
  startY: string;
  speed: string;
  delay: string;
  chars: string[];
}

function generateColumn(id: number): Column {
  return {
    id,
    x: Math.random() * 100,
    startY: `${Math.random() * -300}%`, // More varied starting positions
    speed: `${3 + Math.random() * 4}s`, // Same speed as before
    delay: `${Math.random() * -10}s`, // More varied delays for better distribution
    chars: Array.from({ length: 35 + Math.floor(Math.random() * 25) }, () => // Longer streams
      CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    )
  };
}


interface MatrixBackgroundProps {
  theme?: 'green' | 'amber' | 'mono' | 'blue' | 'red';
}

const THEME_COLORS: Record<string, { base: string; bright: string }> = {
  green: { base: 'text-green-700', bright: 'text-green-400' },
  amber: { base: 'text-amber-700', bright: 'text-amber-300' },
  mono: { base: 'text-neutral-700', bright: 'text-neutral-200' },
  blue: { base: 'text-blue-700', bright: 'text-blue-400' },
  red: { base: 'text-red-700', bright: 'text-red-400' },
};

export function MatrixBackground({ theme = 'green' }: MatrixBackgroundProps) {
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    // Initialize with staggered columns for better coverage
    const initialColumns = Array.from(
      { length: NUM_COLUMNS }, 
      (_, i) => ({
        ...generateColumn(i),
        startY: `${-300 + (Math.random() * 400)}%`, // Spread initial positions throughout
      })
    );
    setColumns(initialColumns);

    const interval = setInterval(() => {
      setColumns(prev => 
        prev.map(col => 
          Math.random() < 0.015 ? { // Slightly lower regeneration rate
            ...generateColumn(col.id),
            startY: '-300%', // Start higher up
          } : col
        )
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="matrix-bg">
      {columns.map(col => (
        <div
          key={`${col.id}-${col.x}`}
          className="matrix-column"
          style={{
            '--x': `${col.x}%`,
            '--start-y': col.startY,
            '--speed': col.speed,
            '--delay': col.delay
          } as React.CSSProperties}
        >
          {col.chars.map((char, i) => {
            const color = THEME_COLORS[theme] || THEME_COLORS.green;
            const baseColor = color.base;
            const brightColor = color.bright;
            return (
              <span
                key={i}
                className={`matrix-character ${i === 0 ? brightColor : baseColor}`}
                style={{
                  textShadow: i === 0
                    ? theme === 'green'
                      ? '0 0 8px rgba(74, 222, 128, 0.8), 0 0 12px rgba(74, 222, 128, 0.4)'
                      : theme === 'amber'
                        ? '0 0 8px rgba(253, 230, 138, 0.8), 0 0 12px rgba(253, 230, 138, 0.4)'
                        : theme === 'blue'
                          ? '0 0 8px rgba(96, 165, 250, 0.8), 0 0 12px rgba(96, 165, 250, 0.4)'
                          : theme === 'red'
                            ? '0 0 8px rgba(248, 113, 113, 0.8), 0 0 12px rgba(248, 113, 113, 0.4)'
                            : '0 0 8px rgba(229, 231, 235, 0.8), 0 0 12px rgba(229, 231, 235, 0.4)'
                    : theme === 'green'
                      ? '0 0 4px rgba(74, 222, 128, 0.3)'
                      : theme === 'amber'
                        ? '0 0 4px rgba(253, 230, 138, 0.3)'
                        : theme === 'blue'
                          ? '0 0 4px rgba(96, 165, 250, 0.3)'
                          : theme === 'red'
                            ? '0 0 4px rgba(248, 113, 113, 0.3)'
                            : '0 0 4px rgba(229, 231, 235, 0.3)'
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}