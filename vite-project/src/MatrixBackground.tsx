import React, { useEffect, useState } from 'react';
import './matrix.css';

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

export function MatrixBackground() {
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
          {col.chars.map((char, i) => (
            <span
              key={i}
              className={`matrix-character ${i === 0 ? 'bright' : ''}`}
            >
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}