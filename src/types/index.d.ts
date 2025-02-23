// src/types/index.d.ts
interface CreateState {
  platform: string;
  paragraphCount: number;
  tts?: string;
  text: string[];
  selectedImages: string[];
}

interface SummaryState {
  platform: string;
  summaryId: number;
  summaryText: string;
  paragraphs?: string[];
  style?: string;
}

interface RouteState {
  platform: string;
  paragraphCount: number;
  tts?: string;
  currentStep: number;
}

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
  style: string;
}