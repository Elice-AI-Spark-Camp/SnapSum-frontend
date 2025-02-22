// services/useSummaryMutation.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useToastStore } from '@/store/useToastStore';
import { createSummary } from '@/api/api';

export const useSummaryMutation = () => {
  const router = useRouter();
  const { showToast } = useToastStore();

  const createSummaryMutation = useMutation({
    mutationKey: ['createSummary'],
    mutationFn: createSummary,
    onSuccess: (data) => {
      router.push({
        pathname: '/text',
        query: {
          platform: data.platform,
          summaryId: data.summary_id,
          summaryText: data.summary_text
        }
      });
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