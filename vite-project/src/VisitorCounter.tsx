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

  useEffect(() => {
    const updateVisitorCount = () => {
      try {
        setLoading(true);
        
        // Single source of truth: localStorage with session tracking
        const storageKey = 'dyno8426-portfolio-visits';
        const sessionKey = 'dyno8426-session-id';
        
        // Get or create session ID
        let sessionId = sessionStorage.getItem(sessionKey);
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem(sessionKey, sessionId);
        }
        
        // Get stored visit data
        const storedData = localStorage.getItem(storageKey);
        let data;
        
        if (storedData) {
          try {
            data = JSON.parse(storedData);
            // Ensure data structure is correct
            if (!data.count || !Array.isArray(data.sessions)) {
              throw new Error('Invalid data structure');
            }
          } catch (parseError) {
            console.warn('Corrupted visit data, resetting:', parseError);
            data = { count: 0, sessions: [] };
          }
        } else {
          // First time visitor
          data = { count: 0, sessions: [] };
        }
        
        // Check if this session has already been counted
        const sessionExists = data.sessions.some((session: any) => session.id === sessionId);
        
        if (!sessionExists) {
          // New session - increment counter
          data.count += 1;
          data.sessions.push({
            id: sessionId,
            timestamp: Date.now(),
            userAgent: navigator.userAgent.substring(0, 100) // Store partial UA for uniqueness
          });
          
          // Keep only last 200 sessions to prevent storage bloat
          if (data.sessions.length > 200) {
            data.sessions = data.sessions.slice(-200);
          }
          
          // Save updated data
          localStorage.setItem(storageKey, JSON.stringify(data));
          console.info(`New visit recorded. Total visits: ${data.count}`);
        }
        
        // Always show current count
        setVisitCount(data.count);
        
      } catch (err) {
        console.error('Visitor counter error:', err);
        // Emergency fallback - use a simple incrementing counter
        const fallbackKey = 'dyno8426-simple-counter';
        const current = parseInt(localStorage.getItem(fallbackKey) || '0', 10);
        const newCount = current + 1;
        localStorage.setItem(fallbackKey, newCount.toString());
        setVisitCount(newCount);
      } finally {
        setLoading(false);
      }
    };

    updateVisitorCount();
  }, []);

  const themeClass = THEMES[theme] || THEMES.green;

  if (loading) {
    return (
      <div className={`text-xs opacity-60 ${themeClass} ${className}`}>
        Loading visits...
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