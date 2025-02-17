// hooks/useNavigation.ts
import { useRouter } from 'next/router';
import { useToastStore } from '@/store/useToastStore';

interface UseNavigationProps {
  currentStep: number;
  validationFn?: () => boolean;
  validationMessage?: string;
  nextPath: string;
  queryParams?: Record<string, string | number>;
}

export const useNavigation = () => {
  const router = useRouter();
  const { showToast } = useToastStore();

  const handleNext = ({
    validationFn,
    validationMessage = '',
    nextPath,
    queryParams = {}
  }: UseNavigationProps) => {
    // 유효성 검사가 있고, 실패한 경우
    if (validationFn && !validationFn()) {
      showToast(validationMessage);
      return;
    }

    // 다음 페이지로 이동
    router.push({
      pathname: nextPath,
      query: {
        ...router.query,  // 기존 쿼리 파라미터 유지
        ...queryParams    // 새로운 쿼리 파라미터 추가
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return {
    handleNext,
    handleBack
  };
};