/* eslint-disable @typescript-eslint/no-explicit-any */
// api/ImageApi.ts
import { api } from '@/lib/api';

export interface GenerateImagesRequest {
  summary_id: number;
  style?: string;
}

export interface ImageData {
  image_id: string;
  image_url: string;
}

export interface GenerateImagesResponse {
  images: ImageData[];
  total_images: number;
}

const API_BASE_URL = 'https://ccqapyxttsnqmhxx.tunnel-pt.elice.io';

export const imageAPI = {
  generateAll: async (data: GenerateImagesRequest): Promise<GenerateImagesResponse> => {
    try {
      console.log('Generating images with data:', data);

      const response = await api.post('/images/generate-all', {
        summary_id: Number(data.summary_id),
        style: data.style || 'polaroid',
      });

      console.log('Server response:', response.data);

      // 이미지 URL을 Elice 도메인으로 변환
      const modifiedImages = response.data.images.map((image: ImageData) => ({
        ...image,
        image_url: image.image_url.startsWith('http') 
          ? image.image_url 
          : `${API_BASE_URL}/images/${image.image_url}`
      }));

      return {
        ...response.data,
        images: modifiedImages
      };
    } catch (error: any) {
      console.error('Generate Images Error:', {
        error,
        response: error.response,
        data: error.response?.data
      });
      
      if (error.response?.status === 400) {
        throw new Error('유효하지 않은 요약 ID입니다.');
      }
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || '이미지 생성 중 오류가 발생했습니다.';
      
      throw new Error(errorMessage);
    }
  },

  regenerateOne: async (imageId: string): Promise<ImageData> => {
    try {
      console.log('Regenerating image:', imageId);
      
      // PUT 방식으로 변경
      const response = await api.put(`/images/${imageId}/regenerate`);
      
      console.log('Regenerate response:', response.data);

      // 이미지 URL 변환
      const imageUrl = response.data.image_url.startsWith('http')
        ? response.data.image_url
        : `${API_BASE_URL}/images/${response.data.image_url}`;

      return {
        ...response.data,
        image_url: imageUrl
      };
    } catch (error: any) {
      console.error('Regenerate Image Error:', {
        error,
        response: error.response,
        data: error.response?.data
      });
      
      if (error.response?.status === 400) {
        throw new Error('유효하지 않은 이미지 ID입니다.');
      }
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || '이미지 재생성 중 오류가 발생했습니다.';
      
      throw new Error(errorMessage);
    }
  }
};