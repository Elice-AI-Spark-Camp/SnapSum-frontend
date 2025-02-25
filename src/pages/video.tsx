import React, { useEffect, useState } from 'react';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import ChatMessage from "@/components/common/ChatMessage";
import CustomHead from "@/components/common/CustomHead";
import VideoButton from "@/components/common/VideoButton";
import ProgressBar from "@/components/common/ProgressBar";
import { useRouteManager } from '@/hooks/useRouteManager';
import { useVideoMutation } from '@/services/useVideoMutation';

export default function Video() {
  const { routeState, navigateTo, isLoading } = useRouteManager();
  const { generateVideoMutation } = useVideoMutation();

  const platformName = routeState?.platform || '';
  const count = routeState?.paragraphCount || 0;

  // 플랫폼별 최대 영상 길이와 플랫폼 표시명 설정
  let videoLength = '90초';
  let platformDisplayName = platformName;
  if (platformName.toLowerCase() === 'tiktok') {
    videoLength = '60초';
    platformDisplayName = 'TikTok';
  } else if (platformName.toLowerCase() === 'instagram') {
    videoLength = '90초';
    platformDisplayName = 'Instagram';
  } else if (platformName.toLowerCase() === 'youtube') {
    videoLength = '3분';
    platformDisplayName = 'YouTube Shorts';
  }
  // 필요에 따라 다른 플랫폼도 추가

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (generateVideoMutation.isSuccess) {
      setProgress(100);
      navigateTo('complete');
    }
  }, [generateVideoMutation.isSuccess, navigateTo]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isGenerating && progress < 100) {
      timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + 1;
          if (next >= 100) {
            if (timer) clearInterval(timer);
            return 100;
          }
          return next;
        });
      }, 100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGenerating, progress]);

  const handleBack = () => {
    if (!isGenerating) {
      navigateTo('img');
    }
  };

  const handleCreateVideo = () => {
    const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');
    if (!summaryState?.summaryId) {
      console.error('요약 ID가 없습니다.');
      return;
    }
    setIsGenerating(true);
    generateVideoMutation.mutate({ summaryId: summaryState.summaryId });
  };

  if (isLoading || !routeState) {
    return (
      <Layout showInfo={false}>
        <CustomHead title="SNAPSUM - 영상 제작" />
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - 영상 제작" />
      
      <div className="sticky top-0 bg-white z-50">
        <StepProgressBar
          currentStep={routeState.currentStep}
          platform={platformName}
          paragraphCount={count}
          imageCount={count}
        />
      </div>

      <div className="relative max-w-[600px] mx-auto px-2">
        <div className="mt-8 mb-32">
          {!isGenerating && (
            <div className="mb-6 w-fit">
              <ChatMessage
                message={`선택한 TTS와\n${count}개의 이미지로 ${platformDisplayName}에 업로드 될\n${videoLength} 영상이 생성됩니다.`}
                showNavigationButtons
                onPrevClick={handleBack}
              />
            </div>
          )}

          {isGenerating ? (
            <div className="flex flex-col items-center gap-8 mt-8">
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
