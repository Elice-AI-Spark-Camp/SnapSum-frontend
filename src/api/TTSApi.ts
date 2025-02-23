// api/TTSApi.ts
import { api } from '@/lib/api';

export const ttsAPI = {
  updateTTS: async (summaryId: number, voice: string): Promise<{ message: string }> => {
    try {
      const response = await api.patch(`/summary/${summaryId}/tts`, { voice });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to update TTS');
    }
  }
};