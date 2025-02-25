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

  // ✅ 상태 로드: 기존 상태와 다를 때만 업데이트
  useEffect(() => {
    const savedState = localStorage.getItem('routeState');
    const parsedState = savedState ? JSON.parse(savedState) : DEFAULT_STATE;

    // 상태가 다를 경우에만 업데이트
    if (JSON.stringify(parsedState) !== JSON.stringify(routeState)) {
      setRouteState(parsedState);
    }
  }, []); // ✅ 처음 한 번만 실행 (의존성 배열 없음)

  // ✅ 현재 경로에 따른 단계 업데이트 (기존 상태와 다를 때만 업데이트)
  useEffect(() => {
    if (!router.isReady || !routeState) return;

    const currentPath = router.pathname.split('/')[1];
    const newStep = ROUTE_STEPS[currentPath as keyof typeof ROUTE_STEPS] || 0;

    if (routeState.currentStep !== newStep) {
      setRouteState(prev => ({ ...prev!, currentStep: newStep }));
    }
  }, [router.isReady, router.pathname]); // ✅ 기존 상태와 다를 때만 변경됨

  // ✅ 상태 변경 시 기존과 비교 후 업데이트
  const updateState = (updates: Partial<RouteState>) => {
    if (!routeState) return;

    const newState = { ...routeState, ...updates };
    if (JSON.stringify(newState) !== JSON.stringify(routeState)) {
      setRouteState(newState);
      localStorage.setItem('routeState', JSON.stringify(newState));
    }
  };

  const navigateTo = (path: keyof typeof ROUTE_STEPS) => {
    const newStep = ROUTE_STEPS[path];

    setRouteState(prev => {
      if (!prev || prev.currentStep === newStep) return prev;
      
      const newState = { ...prev, currentStep: newStep };
      localStorage.setItem('routeState', JSON.stringify(newState));
      return newState;
    });

    router.push(`/${path}`);
  };

  const goBack = () => {
    if (!routeState) return;

    const currentStep = routeState.currentStep;
    const paths = Object.entries(ROUTE_STEPS);
    const previousPath = paths.find(([, step]) => step === currentStep - 1)?.[0];

    if (previousPath) {
      navigateTo(previousPath as keyof typeof ROUTE_STEPS);
    }
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
