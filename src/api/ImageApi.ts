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

// 이미지 URL을 프록시 경로로 변환하는 헬퍼 함수
const convertImageUrl = (url: string) => {
  // URL에서 파일명만 추출 (/uploads/image.png -> image.png)
  const filename = url.split('/').pop();
  return `/uploads/${filename}`;
};

export const imageAPI = {
  generateAll: async (data: GenerateImagesRequest): Promise<GenerateImagesResponse> => {
    try {
      const response = await api.post('/images/generate-all', {
        summary_id: Number(data.summary_id),
        style: data.style || 'polaroid'  // 기본값 설정
      });

      // 응답의 이미지 URL들을 프록시 경로로 변환
      const modifiedImages = response.data.images.map((image: ImageData) => ({
        ...image,
        image_url: convertImageUrl(image.image_url)
      }));

      return {
        ...response.data,
        images: modifiedImages
      };

    } catch (error: any) {
      console.error('API Error:', error.response || error);

      if (error.response) {
        const errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          '이미지 생성 중 오류가 발생했습니다.';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('서버와의 통신 중 오류가 발생했습니다.');
      } else {
        throw new Error('이미지 생성 요청을 보내는 중 오류가 발생했습니다.');
      }
    }
  },

  regenerateOne: async (imageId: string): Promise<ImageData> => {
    try {
      const response = await api.post(`/images/${imageId}/regenerate`);

      // 재생성된 이미지의 URL도 프록시 경로로 변환
      return {
        ...response.data,
        image_url: convertImageUrl(response.data.image_url)
      };

    } catch (error: any) {
      console.error('API Error:', error.response || error);

      if (error.response) {
        const errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          '이미지 재생성 중 오류가 발생했습니다.';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('서버와의 통신 중 오류가 발생했습니다.');
      } else {
        throw new Error('이미지 재생성 요청을 보내는 중 오류가 발생했습니다.');
      }
    }
  }
};