import { create } from 'zustand';


interface ToastStore {
  message: string | null;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  message: null,
  showToast: (message: string) => {
    set(() => ({ message })); // 상태를 명확히 업데이트
    setTimeout(() => {
      set(() => ({ message: null })); // 3초 후 자동 삭제
    }, 3000);
  },
  hideToast: () => set(() => ({ message: null })),
}));
