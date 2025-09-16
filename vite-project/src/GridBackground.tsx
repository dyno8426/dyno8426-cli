import React, { useEffect, useState, useCallback } from 'react';
import './matrix.css';

interface GridPoint {
  id: string;
  value: string;
  bright: boolean;
}

interface GridBackgroundProps {
  columns?: number;
  rows?: number;
}

export function GridBackground({ columns = 40, rows = 25 }: GridBackgroundProps) {
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

    // Update random cells periodically
    const interval = window.setInterval(() => {
      setGrid(prev => {
        const newGrid = [...prev.map(row => [...row])];
        const updates = Math.floor(calculatedRows * calculatedCols * 0.02); // Update 2% of cells

        for (let i = 0; i < updates; i++) {
          const row = Math.floor(Math.random() * calculatedRows);
          const col = Math.floor(Math.random() * calculatedCols);
          newGrid[row][col] = {
            ...newGrid[row][col],
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
          {grid.map((row, i) => 
            row.map(({ id, value, bright }) => (
              <div 
                key={id}
                className="w-5 h-6 flex items-center justify-center"
              >
                <span 
                  className={`transition-all duration-200
                    ${bright ? 'text-green-400' : 'text-green-700'}`}
                  style={{
                    textShadow: bright 
                      ? '0 0 8px rgba(74, 222, 128, 0.8), 0 0 12px rgba(74, 222, 128, 0.4)' 
                      : '0 0 4px rgba(74, 222, 128, 0.3)',
                  }}
                >
                  {value}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}