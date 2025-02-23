import { useMutation } from '@tanstack/react-query';
import { ttsAPI } from '@/api/TTSApi';
import { useRouteManager } from '@/hooks/useRouteManager';
import { useToastStore } from '@/store/useToastStore';

export const useTTSMutation = () => {
  const { navigateTo, updateState } = useRouteManager();
  const { showToast } = useToastStore();

  const updateTTSMutation = useMutation<
    { message: string },
    Error,
    { summaryId: number; voice: string }
  >({
    mutationFn: ({ summaryId, voice }) => ttsAPI.updateTTS(summaryId, voice),
    onSuccess: (_, variables) => {
      // routeState에 TTS 정보 저장
      updateState({ tts: variables.voice });
      
      // localStorage에 summaryState도 업데이트
      const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');
      localStorage.setItem('summaryState', JSON.stringify({
        ...summaryState,
        tts: variables.voice
      }));

      navigateTo('img');
    },
    onError: (error) => {
      showToast(error.message || "TTS 업데이트 중 오류가 발생했습니다.");
    }
  });

  return { updateTTSMutation };
};