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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use your GitHub username as the namespace and 'portfolio' as the key
        const response = await fetch('https://api.countapi.xyz/hit/dyno8426.github.io/portfolio');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.value !== undefined) {
          setVisitCount(data.value);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Failed to fetch visitor count:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
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
        Loading visitor count...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-xs opacity-60 text-red-400 ${className}`}>
        Visitor counter unavailable
      </div>
    );
  }

  return (
    <div className={`text-xs opacity-80 ${themeClass} ${className}`}>
      Visitors: {visitCount?.toLocaleString() || '---'}
    </div>
  );
};

export default VisitorCounter;