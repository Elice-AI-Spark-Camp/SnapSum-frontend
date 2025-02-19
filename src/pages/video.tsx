import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import ChatMessage from "@/components/common/ChatMessage";
import CustomHead from "@/components/common/CustomHead";
import VideoButton from "@/components/common/VideoButton";
import ProgressBar from "@/components/common/ProgressBar";

export default function Video() {
  const router = useRouter();
  const { platform, paragraphCount, tts } = router.query;
  const platformName = typeof platform === 'string' ? platform : '';
  const count = typeof paragraphCount === 'string' ? parseInt(paragraphCount, 10) : 0;
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isGenerating && progress < 100) {
      const timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + 1;
          if (next >= 100) {
            clearInterval(timer);
            // 100%가 되면 완료 페이지로 전환
            router.push({
              pathname: '/complete',
              query: { 
                platform: platformName,
                paragraphCount: count,
                tts: tts
              }
            });
            return 100;
          }
          return next;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isGenerating, progress, router, platformName, count, tts]);

  const handleBack = () => {
    if (!isGenerating) {
      router.push({
        pathname: '/img',
        query: { 
          platform: platformName,
          paragraphCount: count,
          tts: tts
        }
      });
    }
  };

  const handleCreateVideo = () => {
    setIsGenerating(true);
  };

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - 영상 제작" />
      
      <div className="sticky top-0 bg-white z-50">
        <StepProgressBar
          currentStep={4}
          platform={platformName}
          paragraphCount={count}
        />
      </div>

      <div className="relative max-w-[600px] mx-auto px-2">
        <div className="mt-8 mb-32">
          {!isGenerating && (
            <div className="mb-6 w-fit">
              <ChatMessage
                message={`선택한 ○○○ TTS와\n${count}개의 이미지로 instagram에 업로드 될\n90초 영상이 생성됩니다.`}
                showNavigationButtons
                onPrevClick={handleBack}
              />
            </div>
          )}

          {isGenerating ? (
            <div className="flex flex-col items-center gap-8 mt-8">
              {/* 로딩 스피너 */}
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div 
                  className="absolute inset-0 border-4 border-primary rounded-full animate-spin"
                  style={{ 
                    borderTopColor: 'transparent',
                    animationDuration: '1s'
                  }}
                ></div>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-bold mb-2">영상 제작 중</p>
                <p className="text-sm text-gray-600">잠시만 기다려주세요.</p>
              </div>
              
              <div className="w-full max-w-[400px]">
                <ProgressBar progress={progress} variant="secondary" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-8">
              <VideoButton
                variant="create"
                onClick={handleCreateVideo}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}