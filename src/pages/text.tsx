import { useRouter } from 'next/router';
import { IoInformationCircle } from 'react-icons/io5';
import { HiArrowCircleRight } from 'react-icons/hi';
import { useState } from 'react';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import ChatMessage from "@/components/common/ChatMessage";
import NavigationButton from "@/components/common/NavigationButton";
import CustomHead from "@/components/common/CustomHead";

export default function Text() {
  const router = useRouter();
  const { platform } = router.query;
  const platformName = typeof platform === 'string' ? platform : '';

  const [paragraphs, setParagraphs] = useState(['샘플 텍스트입니다. SNAPSUM은 AI를 활용한 숏폼 영상 제작 서비스로 누구나 쉽게 영상 크리에이터로의 전환을 돕습니다. 먼저 링크를 불여넣고, 업로드하고자 하는 플랫폼을 선택 선택합니다. 링크에서 그를 원하는 텍스트를 AI가 분석하고, 요약한 텍스트를 사용자가 자유롭게 문단으로 분리할 수 있습니다. 분리한 문단 기준으로 이미지를 생성하고, 선택한 TTS를 합쳐 영상을 제작하게 됩니다.']);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    // 방향키 허용
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      return;
    }

    // Enter와 Backspace 처리
    if (e.key !== 'Enter' && e.key !== 'Backspace') {
      e.preventDefault();
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
      e.preventDefault();
      const newParagraphs = [...paragraphs];
      newParagraphs[index - 1] = newParagraphs[index - 1] + newParagraphs[index];
      newParagraphs.splice(index, 1);
      setParagraphs(newParagraphs);
    }
  };

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - 영상 제작" />

      {/* Header와 Progress Bar 영역 */}
      <div className="sticky top-0 bg-white z-50">
        <StepProgressBar
          currentStep={1}
          platform={platformName}
          paragraphCount={paragraphs.length}
        />
      </div>

      {/* 컨텐츠 영역 */}
      <div className="relative w-[600px] mx-auto px-2 ">
        <div className="mt-8 mb-32">
          <div className="mb-6 w-fit">
            <ChatMessage
              message="안녕하세요, 저는 당신의 소중한 영상 제작을 AI로 도울 SNAPSUM 입니다. 블로그는 링크에 있는 글을 자동 정리 부탁드려요."
              showNavigationButtons
              onPrevClick={() => console.log('prev')}
            />
          </div>

          <div className="bg-gray-light rounded-full p-4 mb-6 flex items-center justify-center gap-5">
            <IoInformationCircle className="text-primary text-lg" />
            <span className="text-sm text-start">
              Enter키를 누르면 문단이 분리됩니다.
              <br />
              Backspace를 누르면 문단이 하나로 합쳐집니다.
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
                    readOnly
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-full min-h-[80px] p-2 resize-none focus:outline-none"
                    placeholder="텍스트를 입력하세요..."
                  />
                </div>
                {index < paragraphs.length - 1 && (
                  <div className="w-full h-px bg-gray-light my-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white py-6">
        <div className="max-w-[600px] mx-auto px-6 flex justify-between">
          <NavigationButton
            direction="prev"
            onClick={() => console.log('prev')}
            textType="long"
          />
          <NavigationButton
            direction="next"
            onClick={() => console.log('next')}
            textType="long"
          />
        </div>
      </div>
    </Layout>
  );
}