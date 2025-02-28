import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';

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
  const [isLoadingState, setIsLoadingState] = useState(true);

  // 초기 상태 로딩 - 컴포넌트가 마운트될 때 한 번만 실행
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('routeState');
      const parsedState = savedState ? JSON.parse(savedState) : DEFAULT_STATE;
      
      // 현재 경로에 맞는 단계 설정
      const currentPath = router.pathname.split('/')[1];
      const currentStep = ROUTE_STEPS[currentPath as keyof typeof ROUTE_STEPS] || 0;
      
      // 단계 정보가 다를 경우 현재 경로에 맞게 업데이트
      const stateWithCorrectStep = {
        ...parsedState,
        currentStep
      };
      
      setRouteState(stateWithCorrectStep);
      
      // 로컬 스토리지에도 업데이트된 정보 저장
      localStorage.setItem('routeState', JSON.stringify(stateWithCorrectStep));
    } catch (error) {
      console.error('Error loading route state:', error);
      setRouteState(DEFAULT_STATE);
    } finally {
      // 상태 로딩 완료
      setIsLoadingState(false);
    }
  }, [router.isReady, router.pathname]);

  // 상태 업데이트 함수
  const updateState = useCallback((updates: Partial<RouteState>) => {
    setRouteState(prev => {
      if (!prev) return prev;
      
      const newState = { ...prev, ...updates };
      localStorage.setItem('routeState', JSON.stringify(newState));
      return newState;
    });
  }, []);

  // 네비게이션 함수
  const navigateTo = useCallback((path: keyof typeof ROUTE_STEPS) => {
    const newStep = ROUTE_STEPS[path];
    
    setRouteState(prev => {
      if (!prev) return prev;
      
      const newState = { ...prev, currentStep: newStep };
      localStorage.setItem('routeState', JSON.stringify(newState));
      return newState;
    });
    
    router.push(`/${path}`);
  }, [router]);

  // 뒤로가기 함수
  const goBack = useCallback(() => {
    if (!routeState) return;
    
    const currentStep = routeState.currentStep;
    const paths = Object.entries(ROUTE_STEPS);
    const previousPath = paths.find(([, step]) => step === currentStep - 1)?.[0];
    
    if (previousPath) {
      navigateTo(previousPath as keyof typeof ROUTE_STEPS);
    }
  }, [routeState, navigateTo]);

  // 상태 초기화 함수
  const clearState = useCallback(() => {
    localStorage.removeItem('routeState');
    setRouteState(DEFAULT_STATE);
  }, []);

  return {
    routeState,
    navigateTo,
    goBack,
    updateState,
    clearState,
    isLoading: !router.isReady || isLoadingState
  };
};