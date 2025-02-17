import { create } from 'zustand'

interface FormState {
  // 페이지별 상태
  link: string
  platform: string | null
  paragraphs: string[]
  selectedTTS: string

  // 액션
  setLink: (link: string) => void
  setPlatform: (platform: string) => void
  setParagraphs: (paragraphs: string[]) => void
  setSelectedTTS: (voice: string) => void
  reset: () => void
}

const initialState = {
  link: '',
  platform: null,
  paragraphs: [],
  selectedTTS: '',
}

export const useFormStore = create<FormState>((set) => ({
  ...initialState,

  setLink: (link) => set({ link }),
  setPlatform: (platform) => set({ platform }),
  setParagraphs: (paragraphs) => set({ paragraphs }),
  setSelectedTTS: (voice) => set({ selectedTTS: voice }),
  reset: () => set(initialState),
}))