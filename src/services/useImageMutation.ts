// services/useImageMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { imageAPI, GenerateImagesResponse, ImageData } from '@/api/ImageApi';
import { useToastStore } from '@/store/useToastStore';

export const useImageMutation = () => {
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  const generateImagesMutation = useMutation<
    GenerateImagesResponse,
    Error,
    { summary_id: number; style?: string }
  >({
    mutationFn: async (data) => {
      // 데이터 유효성 검사
      if (!data.summary_id || typeof data.summary_id !== 'number') {
        throw new Error('유효하지 않은 요약 ID입니다.');
      }
      return imageAPI.generateAll(data);
    },
    onSuccess: (data) => {
      try {
        const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');
        localStorage.setItem('summaryState', JSON.stringify({
          ...summaryState,
          images: data.images
        }));
      } catch (error) {
        console.error('LocalStorage Error:', error);
        showToast('상태 저장 중 오류가 발생했습니다.');
      }
    },
    onError: (error: Error) => {
      console.error('Generate Images Error:', error);
      showToast(error.message || "이미지 생성 중 오류가 발생했습니다.");
    },
    retry: 1 // 실패 시 1번 재시도
  });

  const regenerateImageMutation = useMutation<
    ImageData,
    Error,
    string
  >({
    mutationFn: async (imageId) => {
      if (!imageId) {
        throw new Error('이미지 ID가 필요합니다.');
      }
      return imageAPI.regenerateOne(imageId);
    },
    onSuccess: (newImage) => {
      try {
        const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');
        const updatedImages = summaryState.images.map((img: ImageData) => 
          img.image_id === newImage.image_id ? newImage : img
        );
        
        localStorage.setItem('summaryState', JSON.stringify({
          ...summaryState,
          images: updatedImages
        }));
        
        queryClient.invalidateQueries({ queryKey: ['images'] });
      } catch (error) {
        console.error('LocalStorage Error:', error);
        showToast('상태 저장 중 오류가 발생했습니다.');
      }
    },
    onError: (error: Error) => {
      console.error('Regenerate Image Error:', error);
      showToast(error.message || "이미지 재생성 중 오류가 발생했습니다.");
    },
    retry: 1
  });

  return {
    generateImagesMutation,
    regenerateImageMutation
  };
};