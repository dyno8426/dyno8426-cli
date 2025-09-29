import React, { useEffect, useState, useCallback } from 'react';
import './matrix.css';

// GridBackground: renders a full-viewport grid of binary characters (0/1)
// The grid size is responsive to the viewport and updates a small percentage
// of cells at an interval to create a lively background effect.

interface GridPoint {
  id: string;
  value: string;
  bright: boolean;
}

interface GridBackgroundProps {
  columns?: number;
  rows?: number;
  theme?: 'green' | 'amber' | 'mono' | 'blue' | 'red';
}

const THEME_COLORS: Record<string, { base: string; bright: string }> = {
  green: { base: 'text-green-700', bright: 'text-green-400' },
  amber: { base: 'text-amber-700', bright: 'text-amber-300' },
  mono: { base: 'text-neutral-700', bright: 'text-neutral-200' },
  blue: { base: 'text-blue-700', bright: 'text-blue-400' },
  red: { base: 'text-red-700', bright: 'text-red-400' },
};

export function GridBackground({ columns = 40, rows = 25, theme = 'green' }: GridBackgroundProps) {
  const [grid, setGrid] = useState<GridPoint[][]>([]);

  // Calculate the number of rows and columns based on viewport and character size
  useEffect(() => {
    const calculateGrid = () => {
      const charWidth = 20; // Width of each character in pixels
      const charHeight = 24; // Height of each character in pixels
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const cols = Math.floor(viewportWidth / charWidth);
      const rows = Math.floor(viewportHeight / charHeight);
      
      return { rows, cols };
    };

    const { rows: calculatedRows, cols: calculatedCols } = calculateGrid();
    
    // Initialize grid
    const newGrid = Array.from({ length: calculatedRows }, () => 
      Array.from({ length: calculatedCols }, () => ({
        id: Math.random().toString(36),
        value: Math.random() < 0.5 ? '0' : '1',
        bright: Math.random() < 0.1,
      }))
    );
    setGrid(newGrid);

    // Update random cells periodically. Use current grid dimensions from the
    // previous state (avoid stale calculatedRows/calculatedCols closure values)
    const interval = window.setInterval(() => {
      setGrid(prev => {
        if (!prev || prev.length === 0) return prev;
        const rows = prev.length;
        const cols = prev[0]?.length || 0;
        if (cols === 0) return prev;

        const newGrid = prev.map(row => row.slice());
        const updates = Math.max(1, Math.floor(rows * cols * 0.02)); // Update at least 1 cell

        for (let i = 0; i < updates; i++) {
          const r = Math.floor(Math.random() * rows);
          const c = Math.floor(Math.random() * cols);
          if (!newGrid[r] || !newGrid[r][c]) continue;
          newGrid[r][c] = {
            ...newGrid[r][c],
            value: Math.random() < 0.5 ? '0' : '1',
            bright: Math.random() < 0.1,
          };
        }
        return newGrid;
      });
    }, 50);

    const resizeHandler = () => {
      const { rows: newRows, cols: newCols } = calculateGrid();
      const newGrid = Array.from({ length: newRows }, () => 
        Array.from({ length: newCols }, () => ({
          id: Math.random().toString(36),
          value: Math.random() < 0.5 ? '0' : '1',
          bright: Math.random() < 0.1,
        }))
      );
      setGrid(newGrid);
    };

    window.addEventListener('resize', resizeHandler);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  // If grid is not initialized yet, render an empty backdrop to avoid
  // attempting to map undefined rows/elements during resize operations.
  if (!grid || grid.length === 0) {
    return <div className="fixed inset-0 bg-black pointer-events-none select-none font-mono" />;
  }

  return (
    <div className="fixed inset-0 bg-black pointer-events-none select-none font-mono overflow-hidden">
      <div className="absolute inset-0 grid place-items-center">
        <div 
          className="grid"
          style={{ 
            gridTemplateColumns: `repeat(${grid[0]?.length || 1}, 1fr)`,
            fontSize: '1rem',
            lineHeight: '1.2',
            gap: '0',
            padding: '0.5rem',
          }}
        >
          {grid.map((row) => 
            (row || []).map(cell => {
              if (!cell) return null;
              const { id, value, bright } = cell;
              const color = THEME_COLORS[theme] || THEME_COLORS.green;
              const baseColor = color.base;
              const brightColor = color.bright;
              // Adjust textShadow color for blue/amber/mono
              let textShadow = '';
              if (theme === 'green') {
                textShadow = bright
                  ? '0 0 8px rgba(74, 222, 128, 0.8), 0 0 12px rgba(74, 222, 128, 0.4)'
                  : '0 0 4px rgba(74, 222, 128, 0.3)';
              } else if (theme === 'amber') {
                textShadow = bright
                  ? '0 0 8px rgba(253, 230, 138, 0.8), 0 0 12px rgba(253, 230, 138, 0.4)'
                  : '0 0 4px rgba(253, 230, 138, 0.3)';
              } else if (theme === 'blue') {
                textShadow = bright
                  ? '0 0 8px rgba(96, 165, 250, 0.8), 0 0 12px rgba(96, 165, 250, 0.4)'
                  : '0 0 4px rgba(96, 165, 250, 0.3)';
              } else if (theme === 'red') {
                textShadow = bright
                  ? '0 0 8px rgba(248, 113, 113, 0.8), 0 0 12px rgba(248, 113, 113, 0.4)'
                  : '0 0 4px rgba(248, 113, 113, 0.3)';
              } else {
                textShadow = bright
                  ? '0 0 8px rgba(229, 231, 235, 0.8), 0 0 12px rgba(229, 231, 235, 0.4)'
                  : '0 0 4px rgba(229, 231, 235, 0.3)';
              }
              return (
                <div 
                  key={id}
                  className="w-5 h-6 flex items-center justify-center"
                >
                  <span 
                    className={`transition-all duration-200 ${bright ? brightColor : baseColor}`}
                    style={{ textShadow }}
                  >
                    {value}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}