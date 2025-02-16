import { useRouter } from 'next/router';
import { IoInformationCircle } from 'react-icons/io5';
import { HiArrowCircleRight } from 'react-icons/hi';
import { useState } from 'react';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import ChatMessage from "@/components/common/ChatMessage";
import NavigationButton from "@/components/common/NavigationButton";
import CustomHead from "@/components/common/CustomHead";
import { INITIAL_TEXT } from '@/constants/text';

export default function Text() {
  const router = useRouter();
  const { platform } = router.query;
  const platformName = typeof platform === 'string' ? platform : '';

  const [paragraphs, setParagraphs] = useState([INITIAL_TEXT]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      return;
    }

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

      // 콘솔에만 BR 태그 포함하여 로깅
      console.log('Split text:', {
        original: currentText,
        firstPart: `${firstHalf}<br/>`,
        secondPart: secondHalf,
        position: cursorPosition
      });

      const newParagraphs = [...paragraphs];
      newParagraphs.splice(index, 1, firstHalf, secondHalf);
      setParagraphs(newParagraphs);
    } else if (e.key === 'Backspace' && index > 0) {
      e.preventDefault();
      const newParagraphs = [...paragraphs];
      const mergedText = newParagraphs[index - 1] + newParagraphs[index];
      
      // 콘솔에만 BR 태그 포함하여 로깅
      console.log('Merged text:', {
        previous: `${newParagraphs[index - 1]}<br/>`,
        current: newParagraphs[index],
        result: mergedText
      });

      newParagraphs[index - 1] = mergedText;
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