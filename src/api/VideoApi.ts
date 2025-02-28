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
  // VideoApi.ts의 generate 함수 수정
generate: async (summaryId: number, maxRetries = 3): Promise<VideoData> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      console.log(`Generating video with summaryId: ${summaryId} (attempt ${retries + 1}/${maxRetries})`);
      
      const response = await api.post('/videos/generate', null, {
        params: { summaryId },
      });
      
      console.log('Video generate response:', response.data);
      return response.data;
    } catch (error: any) {
      // 503 오류인 경우 재시도
      if (error.response?.status === 503 && retries < maxRetries - 1) {
        retries++;
        // 재시도 전 잠시 대기 (지수 백오프)
        const waitTime = 1000 * Math.pow(2, retries);
        console.log(`Server unavailable, retrying in ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        // 다른 오류이거나 최대 재시도 횟수에 도달한 경우
        console.error('Generate Video Error:', {
          error,
          response: error.response,
          data: error.response?.data,
        });

        const errorMessage = error.response?.status === 503 
          ? 'Service Unavailable' 
          : error.response?.data?.message || 
            error.response?.data?.error || 
            '비디오 생성 중 오류가 발생했습니다.';
            
        throw new Error(errorMessage);
      }
    }
  }
  
  // 모든 재시도 실패 시
  throw new Error('서버가 응답하지 않습니다. 나중에 다시 시도해 주세요.');
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