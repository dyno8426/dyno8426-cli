import React, { useEffect, useState } from 'react';

interface VisitorCounterProps {
  theme?: 'green' | 'amber' | 'mono' | 'blue' | 'red';
  className?: string;
}

const THEMES = {
  green: "text-green-400",
  amber: "text-amber-300", 
  mono: "text-neutral-200",
  blue: "text-blue-400",
  red: "text-red-400",
};

export const VisitorCounter: React.FC<VisitorCounterProps> = ({ 
  theme = 'green', 
  className = '' 
}) => {
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        setLoading(true);
        
        // Track actual website visits using countapi.xyz
        // Increment counter on each page load and fetch the current count
        const namespace = 'dyno8426-portfolio';
        const key = 'visits';
        
        const response = await fetch(
          `https://api.countapi.xyz/hit/${namespace}/${key}`,
          {
            method: 'GET',
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setVisitCount(data.value || 0);
          setError(false);
        } else {
          throw new Error(`Counter API error: ${response.status}`);
        }
        
      } catch (err) {
        console.error('Visitor counter error:', err);
        
        // If the API fails, display error state
        setError(true);
        setVisitCount(null);
        
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorCount();
  }, []);

  const themeClass = THEMES[theme] || THEMES.green;

  if (loading) {
    return (
      <div className={`text-xs opacity-60 ${themeClass} ${className}`}>
        Loading visits...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-xs opacity-80 ${themeClass} ${className}`}>
        Visits: error
      </div>
    );
  }

  return (
    <div className={`text-xs opacity-80 ${themeClass} ${className}`}>
      Visits: {visitCount?.toLocaleString() || '0'}
    </div>
  );
};

export default VisitorCounter;