import { useMutation } from '@tanstack/react-query';
import { useRouteManager } from '@/hooks/useRouteManager';
import { useToastStore } from '@/store/useToastStore';
import { summaryAPI } from '@/api/SummaryApi';
import { useSummaryState } from './useSummaryState';

export const useSummaryMutation = () => {
  const { navigateTo, updateState } = useRouteManager();
  const { showToast } = useToastStore();
  const { updateSummaryState } = useSummaryState();

  const createSummaryMutation = useMutation({
    mutationKey: ['createSummary'],
    mutationFn: summaryAPI.create,
    onSuccess: (data) => {
      const summaryState: SummaryState = {
        platform: data.platform,
        summaryId: data.summary_id,
        summaryText: data.summary_text,
        paragraphs: data.paragraphs
      };
      localStorage.setItem('summaryState', JSON.stringify(summaryState));

      updateState({
        platform: data.platform,
        paragraphCount: data.paragraphs.length
      });

      navigateTo('text');
    },
    onError: (error: Error) => {
      console.error('Error creating summary:', error);
      showToast(error.message || "요약 생성 중 오류가 발생했습니다.");
    }
  });

  const updateSummaryMutation = useMutation({
    mutationKey: ['updateSummary'],
    mutationFn: summaryAPI.update,
    onSuccess: (data) => {
      updateSummaryState({
        paragraphs: data.paragraphs,
        summaryText: data.summaryText,
        style: data.style
      });
    },
    onError: (error: Error) => {
      console.error('Error updating summary:', error);
      showToast(error.message || "변경사항 저장 중 오류가 발생했습니다.");
    }
  });

  return {
    createSummaryMutation,
    updateSummaryMutation
  };
};