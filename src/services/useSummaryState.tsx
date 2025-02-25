import { useState, useEffect } from 'react';
import { useRouteManager } from '@/hooks/useRouteManager';

export const useSummaryState = () => {
  const [summaryState, setSummaryState] = useState<SummaryState | null>(null);
  const { updateState } = useRouteManager();

  // 로컬 스토리지에서 summaryState 로드
  useEffect(() => {
    const savedState = localStorage.getItem('summaryState');
    if (savedState) {
      setSummaryState(JSON.parse(savedState));
    }
  }, []);

  // summaryState가 변경될 때 routeState 업데이트
  useEffect(() => {
    if (summaryState?.platform) {
      updateState({ 
        platform: summaryState.platform,
        paragraphCount: summaryState.paragraphs?.length || 0
      });
    }
  }, [summaryState, updateState]);

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