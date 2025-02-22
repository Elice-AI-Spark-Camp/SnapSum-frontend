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

export const useRouteManager = () => {
  const router = useRouter();
  const [routeState, setRouteState] = useState<RouteState | null>(null);

  // 로컬 스토리지에서 상태 로드
  useEffect(() => {
    const savedState = localStorage.getItem('routeState');
    if (savedState) {
      setRouteState(JSON.parse(savedState));
    }
  }, []);

  // 라우터 쿼리로부터 상태 업데이트
  useEffect(() => {
    if (router.isReady) {
      const { platform, paragraphCount, tts } = router.query;
      const currentPath = router.pathname.split('/')[1];
      
      const newState: RouteState = {
        platform: platform as string || '',
        paragraphCount: parseInt(paragraphCount as string, 10) || 0,
        tts: tts as string,
        currentStep: ROUTE_STEPS[currentPath as keyof typeof ROUTE_STEPS] || 0
      };

      setRouteState(newState);
      localStorage.setItem('routeState', JSON.stringify(newState));
    }
  }, [router.isReady, router.query, router.pathname]);

  const navigateTo = (path: keyof typeof ROUTE_STEPS) => {
    if (!routeState) return;

    const query: Record<string, string> = {
      platform: routeState.platform,
      paragraphCount: routeState.paragraphCount.toString()
    };

    if (routeState.tts) {
      query.tts = routeState.tts;
    }

    router.push({
      pathname: `/${path}`,
      query
    });
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
    setRouteState(null);
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