import { useState } from 'react';
import { useRouteManager } from '@/hooks/useRouteManager';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import ChatMessage from "@/components/common/ChatMessage";
import NavigationButton from "@/components/common/NavigationButton";
import CustomHead from "@/components/common/CustomHead";
import { INITIAL_TEXT } from '@/constants/text';
import { HiArrowCircleRight } from 'react-icons/hi';
import { IoInformationCircle } from 'react-icons/io5';

export default function Text() {
  const { routeState, navigateTo, goBack, updateState, isLoading } = useRouteManager();
  const [paragraphs, setParagraphs] = useState([INITIAL_TEXT]);

  if (isLoading || !routeState) {
    return null;
  }

  const handleNext = () => {
    updateState({ paragraphCount: paragraphs.length });
    navigateTo('tts');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 화살표 키는 그대로 동작하도록
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      return;
    }

    // Enter와 Backspace가 아닌 다른 키는 막음 (모바일 예외)
    if (e.key !== 'Enter' && e.key !== 'Backspace') {
      if (!isMobile) {
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const currentText = paragraphs[index];
      const cursorPosition = (e.target as HTMLTextAreaElement).selectionStart;

      if (cursorPosition === 0 || cursorPosition === currentText.length) return;

      const firstHalf = currentText.slice(0, cursorPosition);
      const secondHalf = currentText.slice(cursorPosition);

      const newParagraphs = [...paragraphs];
      newParagraphs.splice(index, 1, firstHalf, secondHalf);
      setParagraphs(newParagraphs);
    } else if (e.key === 'Backspace' && index > 0) {
      const cursorPosition = (e.target as HTMLTextAreaElement).selectionStart;
      
      // 커서가 문단의 시작 부분에 있을 때만 실행
      if (cursorPosition === 0) {
        e.preventDefault();
        const newParagraphs = [...paragraphs];
        const mergedText = newParagraphs[index - 1] + newParagraphs[index];
        newParagraphs[index - 1] = mergedText;
        newParagraphs.splice(index, 1);
        setParagraphs(newParagraphs);
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = e.target.value;
    setParagraphs(newParagraphs);
  };

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - 영상 제작" />

      <div className="sticky top-0 bg-white z-50">
        <StepProgressBar
          currentStep={routeState.currentStep}
          platform={routeState.platform}
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

          <div className="space-y-4 overflow-hidden">
            {paragraphs.map((text, index) => (
              <div key={index} className="relative group">
                <div className="relative flex items-start gap-2">
                  <div className="pt-4">
                    <HiArrowCircleRight className="text-primary text-xl" />
                  </div>
                  <textarea
                    value={text}
                    onChange={(e) => handleTextChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-full min-h-[80px] p-2 resize-none focus:outline-none"
                    placeholder="텍스트를 입력하세요..."
                  />
                </div>
                {index < paragraphs.length - 1 && (
                  <div className="w-full h-[2px] bg-gray-default my-1" />
                )}
              </div>
            ))}
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