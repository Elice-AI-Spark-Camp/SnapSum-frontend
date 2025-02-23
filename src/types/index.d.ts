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
}