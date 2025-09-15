import React, { useEffect, useState } from 'react';
import './matrix.css';

const CHARACTERS = '01';
const NUM_COLUMNS = 50;

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
    startY: `${Math.random() * -100}%`,
    speed: `${3 + Math.random() * 4}s`,
    delay: `${Math.random() * -5}s`,
    chars: Array.from({ length: 15 + Math.floor(Math.random() * 15) }, () => 
      CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    )
  };
}

export function MatrixBackground() {
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    const initialColumns = Array.from(
      { length: NUM_COLUMNS }, 
      (_, i) => generateColumn(i)
    );
    setColumns(initialColumns);

    const interval = setInterval(() => {
      setColumns(prev => 
        prev.map(col => 
          Math.random() < 0.02 ? generateColumn(col.id) : col
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