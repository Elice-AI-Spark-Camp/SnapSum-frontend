import { api } from '@/lib/api';

export const summaryAPI = {
  create: async (data: CreateSummaryRequest): Promise<CreateSummaryResponse> => {
    try {
      const response = await api.post('/summary', data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to create summary');
    }
  },

  update: async (data: UpdateSummaryRequest): Promise<UpdateSummaryResponse> => {
    try {
      const response = await api.put('/summary', data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to update summary');
    }
  }
};
