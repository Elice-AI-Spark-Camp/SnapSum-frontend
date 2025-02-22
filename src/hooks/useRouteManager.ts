// hooks/useRouteManager.ts
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface RouteState {
  platform: string;
  paragraphCount: number;
  tts?: string;
  currentStep: number;
}

export const ROUTE_STEPS = {
  info: 0,
  text: 1,
  tts: 2,
  img: 3,
  video: 4,
  complete: 5,
} as const;

const DEFAULT_STATE: RouteState = {
  platform: '',
  paragraphCount: 0,
  currentStep: 0
};

export const useRouteManager = () => {
  const router = useRouter();
  const [routeState, setRouteState] = useState<RouteState | null>(null);

  // 로컬 스토리지에서 상태 로드
  useEffect(() => {
    const savedState = localStorage.getItem('routeState');
    if (savedState) {
      setRouteState(JSON.parse(savedState));
    } else {
      setRouteState(DEFAULT_STATE);
    }
  }, []);

  // 현재 경로에 따른 단계 업데이트
  useEffect(() => {
    if (!router.isReady) return;

    const currentPath = router.pathname.split('/')[1];
    
    if (!currentPath || currentPath === '') {
      return;
    }

    setRouteState(prev => {
      if (!prev) return DEFAULT_STATE;
      
      return {
        ...prev,
        currentStep: ROUTE_STEPS[currentPath as keyof typeof ROUTE_STEPS] || 0
      };
    });
  }, [router.isReady, router.pathname]);

  const navigateTo = (path: keyof typeof ROUTE_STEPS) => {
    router.push(`/${path}`);
  };

  const goBack = () => {
    if (!routeState) return;
    
    const currentStep = routeState.currentStep;
    const paths = Object.entries(ROUTE_STEPS);
    const previousPath = paths.find(([_, step]) => step === currentStep - 1)?.[0];
    
    if (previousPath) {
      navigateTo(previousPath as keyof typeof ROUTE_STEPS);
    }
  };

  const updateState = (updates: Partial<RouteState>) => {
    if (!routeState) return;
    
    const newState = { ...routeState, ...updates };
    setRouteState(newState);
    localStorage.setItem('routeState', JSON.stringify(newState));
  };

  const clearState = () => {
    localStorage.removeItem('routeState');
    setRouteState(DEFAULT_STATE);
  };

  return {
    routeState,
    navigateTo,
    goBack,
    updateState,
    clearState,
    isLoading: !router.isReady
  };
};