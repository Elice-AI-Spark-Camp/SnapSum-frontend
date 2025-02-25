// pages/text.tsx
import { useState, useEffect } from 'react';
import { useRouteManager } from '@/hooks/useRouteManager';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import ChatMessage from "@/components/common/ChatMessage";
import NavigationButton from "@/components/common/NavigationButton";
import CustomHead from "@/components/common/CustomHead";
import { IoInformationCircle } from 'react-icons/io5';
import { useSummaryState } from '@/services/useSummaryState';
import { useSummaryMutation } from '@/services/useSummaryMutation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { TextEditor } from '@/components/pages/text/TextEditor';
import { useToastStore } from '@/store/useToastStore';

export default function Text() {
  const { routeState, navigateTo, goBack, updateState, isLoading } = useRouteManager();
  const { summaryState } = useSummaryState();
  const { showToast } = useToastStore();
  const { updateSummaryMutation } = useSummaryMutation();
  const [paragraphs, setParagraphs] = useState<string[]>([]);

  useEffect(() => {
    if (summaryState?.paragraphs) {
      setParagraphs(summaryState.paragraphs);
    }
  }, [summaryState]);

  if (isLoading || !routeState || !summaryState?.paragraphs) {
    return (
      <Layout showInfo={false}>
        <CustomHead title="SNAPSUM - 영상 제작" />
        <LoadingSpinner message="텍스트를 요약중입니다" />
      </Layout>
    );
  }

  const handleTextChange = (newParagraphs: string[]) => {
    // 문단 수를 30개 이하로 제한
    if (newParagraphs.length > 30) {
      newParagraphs = newParagraphs.slice(0, 30);
      // 예시: 사용자에게 알림 (토스트 메시지)
      showToast("문단은 최대 30개까지만 입력할 수 있습니다.");
    }
    
    setParagraphs(newParagraphs);
    
    // 디바운스 처리를 위한 타이머
    const timeoutId = setTimeout(() => {
      if (!summaryState?.summaryId) return;
      
      updateSummaryMutation.mutate({
        summary_id: summaryState.summaryId,
        summary_text: newParagraphs.join('<br>')
      });
    }, 1000);
  
    return () => clearTimeout(timeoutId);
  };

  const handleNext = () => {
    updateState({ paragraphCount: paragraphs.length });
    navigateTo('tts');
  };

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - 영상 제작" />

      <div className="sticky top-0 bg-white z-50">
        <StepProgressBar
          currentStep={routeState.currentStep}
          platform={summaryState.platform}
          paragraphCount={paragraphs.length}
        />
      </div>

      <div className="relative max-w-[600px] mx-auto px-2">
        <div className="mt-8 mb-32">
          <div className="mb-6 w-fit">
            <ChatMessage
              message="안녕하세요, 저는 당신의 소중한 영상 제작을 AI로 도울 SNAPSUM 입니다. 블로그는 링크에 있는 글을 자동 정리 부탁드려요."
              showNavigationButtons
              onPrevClick={goBack}
            />
          </div>

          <div className="bg-gray-light rounded-full p-4 mb-6 flex items-center justify-center gap-5">
            <IoInformationCircle className="text-primary text-lg" />
            <span className="text-sm text-start">
              Enter키를 누르면 문단이 분리됩니다.
              <br />
              Backspace를 누르면 문단이 하나로 합쳐지고, 이전 문단으로 이동합니다.
            </span>
          </div>

          <TextEditor
            paragraphs={paragraphs}
            onChange={handleTextChange}
          />
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