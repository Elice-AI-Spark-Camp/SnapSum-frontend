// api/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ccqapyxttsnqmhxx.tunnel-pt.elice.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface CreateSummaryRequest {
  url: string;
  platform: string;
}

interface CreateSummaryResponse {
  paragraphs: string[];
  platform: string;
  summary_id: number;
  summary_text: string;
}

interface UpdateSummaryRequest {
  summary_id: number;
  summary_text: string;
}

interface UpdateSummaryResponse {
  summaryId: number;
  summaryText: string;
  paragraphs: string[];
  paragraphImageMap: Record<string, string>;
  platform: string;
  voice: string;
}

export const createSummary = async (data: CreateSummaryRequest): Promise<CreateSummaryResponse> => {
  try {
    const response = await api.post('/summary', data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to create summary');
  }
};

export const updateSummary = async (data: UpdateSummaryRequest): Promise<UpdateSummaryResponse> => {
  try {
    const response = await api.put('/summary', data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to update summary');
  }
};