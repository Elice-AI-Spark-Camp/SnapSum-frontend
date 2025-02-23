import { useState, useEffect } from 'react';

export const useSummaryState = () => {
  const [summaryState, setSummaryState] = useState<SummaryState | null>(null);

  useEffect(() => {
    const savedState = localStorage.getItem('summaryState');
    if (savedState) {
      setSummaryState(JSON.parse(savedState));
    }
  }, []);

  const updateSummaryState = (updates: Partial<SummaryState>) => {
    setSummaryState(prev => {
      if (!prev) return null;
      const newState = { ...prev, ...updates };
      localStorage.setItem('summaryState', JSON.stringify(newState));
      return newState;
    });
  };

  const clearSummaryState = () => {
    localStorage.removeItem('summaryState');
    setSummaryState(null);
  };

  return {
    summaryState,
    updateSummaryState,
    clearSummaryState
  };
};