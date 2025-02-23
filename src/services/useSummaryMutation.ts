import { useMutation } from '@tanstack/react-query';
import { useRouteManager } from '@/hooks/useRouteManager';
import { useToastStore } from '@/store/useToastStore';
import { createSummary } from '@/api/api';

export const useSummaryMutation = () => {
  const { navigateTo, updateState } = useRouteManager();
  const { showToast } = useToastStore();

  const createSummaryMutation = useMutation({
    mutationKey: ['createSummary'],
    mutationFn: createSummary,
    onSuccess: (data) => {
      // 응답 데이터를 localStorage에 저장
      const summaryState: SummaryState = {
        platform: data.platform,
        summaryId: data.summary_id,
        summaryText: data.summary_text,
        paragraphs: data.paragraphs
      };
      localStorage.setItem('summaryState', JSON.stringify(summaryState));

      // RouteState 업데이트
      updateState({
        platform: data.platform,
        paragraphCount: data.paragraphs.length
      });

      // 다음 페이지로 이동
      navigateTo('text');
    },
    onError: (error: Error) => {
      console.error('Error creating summary:', error);
      showToast(error.message || "요약 생성 중 오류가 발생했습니다.");
    }
  });

  return {
    createSummaryMutation
  };
};
