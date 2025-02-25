import { useMutation, useQueryClient } from '@tanstack/react-query';
import { videoAPI, VideoData } from '@/api/VideoApi';
import { useToastStore } from '@/store/useToastStore';

export const useVideoMutation = () => {
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  const generateVideoMutation = useMutation<
    VideoData,
    Error,
    { summaryId: number }
  >({
    mutationFn: async (data) => {
      if (!data.summaryId || typeof data.summaryId !== 'number') {
        throw new Error('유효하지 않은 요약 ID입니다.');
      }
      return videoAPI.generate(data.summaryId);
    },
    onSuccess: (data) => {
      try {
        // 생성된 비디오 정보를 로컬 스토리지에 저장 (필요 시)
        const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');
        localStorage.setItem('summaryState', JSON.stringify({
          ...summaryState,
          video: data,
        }));
        queryClient.invalidateQueries({ queryKey: ['video'] });
      } catch (error) {
        console.error('LocalStorage Error:', error);
        showToast('비디오 상태 저장 중 오류가 발생했습니다.');
      }
    },
    onError: (error: Error) => {
      console.error('Generate Video Error:', error);
      showToast(error.message || '비디오 생성 중 오류가 발생했습니다.');
    },
    retry: 1,
  });

  return {
    generateVideoMutation,
  };
};
