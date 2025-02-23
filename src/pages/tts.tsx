// pages/tts.tsx
import { useState, useEffect } from 'react';
import { useRouteManager } from '@/hooks/useRouteManager';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import ChatMessage from "@/components/common/ChatMessage";
import NavigationButton from "@/components/common/NavigationButton";
import CustomHead from "@/components/common/CustomHead";
import TTSButton from "@/components/common/TTSButton";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useToastStore } from '@/store/useToastStore';
import { useTTSMutation } from '@/services/useTTSMutation';

export default function TTS() {
  const { routeState, goBack, isLoading } = useRouteManager();
  const { showToast } = useToastStore();
  const [selectedTTS, setSelectedTTS] = useState<string>('');
  const { updateTTSMutation } = useTTSMutation();

  // 이전에 선택한 TTS가 있다면 로드
  useEffect(() => {
    if (routeState?.tts) {
      setSelectedTTS(routeState.tts);
    }
  }, [routeState?.tts]);

  const ttsOptions = [
    { id: 'female_1', label: '여성 1', sublabel: '목소리에 대한\n간단한 설명' },
    { id: 'female_2', label: '여성 2', sublabel: '목소리에 대한\n간단한 설명' },
    { id: 'male_1', label: '남성 1', sublabel: '목소리에 대한\n간단한 설명' },
    { id: 'male_2', label: '남성 2', sublabel: '목소리에 대한\n간단한 설명' }
  ];

  if (isLoading || !routeState) {
    return null;
  }

  const handleNext = () => {
    if (!selectedTTS) {
      showToast("목소리를 선택해주세요.");
      return;
    }

    const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');
    if (!summaryState.summaryId) {
      showToast("요약 정보를 찾을 수 없습니다.");
      return;
    }

    updateTTSMutation.mutate({
      summaryId: summaryState.summaryId,
      voice: selectedTTS
    });
  };

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - TTS 선택" />

      {updateTTSMutation.isPending && (
        <LoadingSpinner message="음성을 적용하고 있습니다..." />
      )}

      <div className="sticky top-0 bg-white z-50">
        <StepProgressBar
          currentStep={routeState.currentStep}
          platform={routeState.platform}
          paragraphCount={routeState.paragraphCount}
        />
      </div>

      <div className="relative max-w-[600px] mx-auto px-2">
        <div className="mt-8 mb-32">
          <div className="mb-6 w-fit">
            <ChatMessage
              message="영상에서 재생할 목소리를 선택해주세요."
              showNavigationButtons
              onPrevClick={goBack}
            />
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-2 max-w-[410px] gap-[10px]">
              {ttsOptions.map((tts) => (
                <TTSButton
                  key={tts.id}
                  onClick={() => setSelectedTTS(tts.id)}
                  isSelected={selectedTTS === tts.id}
                  label={tts.label}
                  sublabel={tts.sublabel}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white py-6">
        <div className="max-w-[600px] mx-auto px-6 flex justify-between">
          <NavigationButton
            direction="prev"
            onClick={goBack}
            textType="long"
          />
          <NavigationButton
            direction="next"
            onClick={handleNext}
            textType="long"
          />
        </div>
      </div>
    </Layout>
  );
}