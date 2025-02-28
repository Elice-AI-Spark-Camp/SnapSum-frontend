// pages/complete.tsx
import { useEffect, useState } from 'react';
import { useRouteManager } from '@/hooks/useRouteManager';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import CustomHead from "@/components/common/CustomHead";
import VideoButton from "@/components/common/VideoButton";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useToastStore } from '@/store/useToastStore';
import { useVideoQuery } from '@/services/useVideoMutation';

export default function Complete() {
  const { routeState, navigateTo, clearState, isLoading } = useRouteManager();
  const { showToast } = useToastStore();
  const [videoId, setVideoId] = useState<number | undefined>(undefined);
  
  // 로컬 스토리지에서 비디오 ID 가져오기
  useEffect(() => {
    try {
      const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');
      if (summaryState.video?.id) {
        setVideoId(summaryState.video.id);
      }
    } catch (error) {
      console.error('로컬 스토리지 읽기 오류:', error);
    }
  }, []);
  
  // 비디오 조회 쿼리 사용
  const { data: video, isLoading: isVideoLoading, error } = useVideoQuery(videoId);
  
  useEffect(() => {
    if (error) {
      showToast('비디오 정보를 불러오는데 실패했습니다.');
      console.error('비디오 조회 오류:', error);
    }
  }, [error, showToast]);

  if (isLoading || !routeState) {
    return null;
  }

  const handleDownload = () => {
    if (!video?.videoUrl) {
      showToast('다운로드할 비디오가 없습니다.');
      return;
    }
  
    // 모바일 기기 확인
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // 모바일에서는 새 창에서 열기 (사용자가 길게 눌러 다운로드 가능)
      window.open(video.videoUrl, '_blank');
      showToast('영상이 새 창에서 열렸습니다. 길게 눌러 저장하세요.');
    } else {
      // 데스크톱에서는 기존 방식대로 다운로드
      const link = document.createElement('a');
      link.href = video.videoUrl;
      link.download = `snapsum-video-${new Date().getTime()}.mp4`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // 약간의 지연 후 제거
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    }
  };

  // 새 비디오 시작
  const handleNewVideo = () => {
    // 로컬 스토리지 초기화
    localStorage.removeItem('summaryState');
    localStorage.removeItem('routeState');
    clearState();
    navigateTo('info');
  };

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - 영상 제작 완료" />
      
      <div className="sticky top-0 bg-white z-50">
        <StepProgressBar
          currentStep={routeState.currentStep}
          platform={routeState.platform}
          paragraphCount={routeState.paragraphCount}
          imageCount={routeState.paragraphCount}
        />
      </div>

      <div className="relative max-w-[600px] mx-auto px-2">
        <div className="mt-8 mb-32">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold">SNAPSUM과 함께</h2>
            <h2 className="text-xl font-bold mb-4">영상 제작 완료!</h2>
            <p className="text-gray-600 text-sm mb-6">
              이제 다운로드 버튼을 눌러 영상을 다운받으세요.
            </p>
          </div>

          {isVideoLoading ? (
            <div className="flex justify-center my-12">
              <LoadingSpinner message="비디오 정보를 불러오고 있습니다..." />
            </div>
          ) : (
            <>
              {/* 비디오 상태 및 미리보기 */}
              {video?.status === 'COMPLETED' && video.videoUrl ? (
                <div className="mb-10">
                  <div className="relative rounded-lg overflow-hidden aspect-video shadow-lg">
                    <video 
                      controls 
                      className="w-full h-full"
                      poster="/assets/images/video-poster.jpg"
                    >
                      <source src={video.videoUrl} type="video/mp4" />
                      브라우저가 비디오 재생을 지원하지 않습니다.
                    </video>
                  </div>
                </div>
              ) : video?.status === 'PENDING' ? (
                <div className="text-center mb-10 p-5 bg-yellow-50 rounded-lg">
                  <LoadingSpinner />
                  <p className="text-yellow-600 mt-3">
                    비디오가 아직 처리 중입니다. 잠시만 기다려주세요.
                  </p>
                </div>
              ) : video?.status === 'FAILED' ? (
                <div className="text-center mb-10 p-5 bg-red-50 rounded-lg">
                  <p className="text-red-600">
                    비디오 생성에 실패했습니다. 다시 시도해주세요.
                  </p>
                </div>
              ) : (
                <div className="text-center mb-10 p-5 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    비디오 정보를 찾을 수 없습니다.
                  </p>
                </div>
              )}

              <div className="flex flex-col items-center gap-4">
                <VideoButton
                  variant="download"
                  onClick={handleDownload}
                  disabled={!video?.videoUrl || video.status !== 'COMPLETED'}
                />
                <VideoButton
                  variant="new"
                  onClick={handleNewVideo}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}