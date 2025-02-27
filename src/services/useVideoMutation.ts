// services/useVideoService.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { videoAPI, VideoData } from '@/api/VideoApi';
import { useToastStore } from '@/store/useToastStore';

// 비디오 mutation과 query를 한 파일에서 관리
export const useVideoService = () => {
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  // 비디오 생성 mutation
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
        // 생성된 비디오 정보를 로컬 스토리지에 저장
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

  // 비디오 조회 query hook
  const useVideoQuery = (videoId: number | undefined) => {
    return useQuery({
      queryKey: ['video', videoId],
      queryFn: () => videoId ? videoAPI.getVideo(videoId) : Promise.reject('비디오 ID가 없습니다.'),
      enabled: !!videoId, // videoId가 있을 때만 쿼리 활성화
      retry: 1,
    });
  };

  return {
    generateVideoMutation,
    useVideoQuery
  };
};

// 기존 코드와의 호환성을 위한 래퍼 함수들
export const useVideoMutation = () => {
  const { generateVideoMutation } = useVideoService();
  return { generateVideoMutation };
};

export const useVideoQuery = (videoId: number | undefined) => {
  const { useVideoQuery: videoQueryHook } = useVideoService();
  return videoQueryHook(videoId);
};