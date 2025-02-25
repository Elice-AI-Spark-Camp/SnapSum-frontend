/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from '@/lib/api';

export interface VideoData {
  id: number;
  summaryId: number;
  videoUrl: string;
  status: string;
  createdAt: string;
}

export const videoAPI = {
  generate: async (summaryId: number): Promise<VideoData> => {
    try {
      console.log('Generating video with summaryId:', summaryId);
      // summaryId를 쿼리 파라미터로 전달
      const response = await api.post('/videos/generate', null, {
        params: { summaryId },
      });

      console.log('Video generate response:', response.data);

      return response.data;
    } catch (error: any) {
      console.error('Generate Video Error:', {
        error,
        response: error.response,
        data: error.response?.data,
      });

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        '비디오 생성 중 오류가 발생했습니다.';
      throw new Error(errorMessage);
    }
  }
};
