/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/lib/api';
export type VideoStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface VideoData {
  id: number;
  summaryId: number;
  videoUrl: string;
  status: VideoStatus; // 문자열 대신 명확한 타입으로 변경
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
  },

  // 비디오 조회 API 추가
  getVideo: async (videoId: number): Promise<VideoData> => {
    try {
      console.log('Fetching video with ID:', videoId);
      const response = await api.get(`/videos/${videoId}`);
      console.log('Video fetch response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get Video Error:', {
        error,
        response: error.response,
        data: error.response?.data,
      });

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        '비디오 조회 중 오류가 발생했습니다.';
      throw new Error(errorMessage);
    }
  }
};