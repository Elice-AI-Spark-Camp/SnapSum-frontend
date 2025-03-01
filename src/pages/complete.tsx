// pages/complete.tsx
import { useEffect, useState, useRef } from 'react';
import { useRouteManager } from '@/hooks/useRouteManager';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import CustomHead from "@/components/common/CustomHead";
import VideoButton from "@/components/common/VideoButton";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useToastStore } from '@/store/useToastStore';
import { useVideoQuery } from '@/services/useVideoMutation';
import { IoCloseOutline, IoVolumeHighOutline, IoVolumeMuteOutline } from 'react-icons/io5';

export default function Complete() {
  const { routeState, navigateTo, clearState, isLoading } = useRouteManager();
  const { showToast } = useToastStore();
  const [videoId, setVideoId] = useState<number | undefined>(undefined);
  const [fullscreen, setFullscreen] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
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

  useEffect(() => {
    // 자동 재생 시도 (모바일에서는 정책상 제한될 수 있음)
    if (videoRef.current && !isVideoLoading && video?.status === 'COMPLETED') {
      try {
        videoRef.current.play().catch(err => {
          console.log('자동 재생 실패:', err);
        });
      } catch (error) {
        console.error('비디오 재생 오류:', error);
      }
    }
  }, [isVideoLoading, video]);

  // 전체 화면 모드 토글
  const toggleFullscreen = () => {
    setFullscreen(prev => !prev);
  };

  // 음소거 토글
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(!muted);
    }
  };

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
      
      {!fullscreen && (
        <div className="sticky top-0 bg-white z-50">
          <StepProgressBar
            currentStep={routeState.currentStep}
            platform={routeState.platform}
            paragraphCount={routeState.paragraphCount}
            imageCount={routeState.paragraphCount}
          />
        </div>
      )}

      <div className={`relative ${fullscreen ? 'fixed inset-0 z-[9999] bg-black' : 'max-w-[600px] mx-auto px-2'}`}>
        {!fullscreen && (
          <div className="mt-8 mb-4">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">SNAPSUM과 함께</h2>
              <h2 className="text-xl font-bold mb-4">영상 제작 완료!</h2>
              <p className="text-gray-600 text-sm mb-6">
                이제 다운로드 버튼을 눌러 영상을 다운받으세요.
              </p>
            </div>
          </div>
        )}

        {isVideoLoading ? (
          <div className="flex justify-center my-12">
            <LoadingSpinner message="비디오 정보를 불러오고 있습니다..." />
          </div>
        ) : (
          <>
            {/* 비디오 상태 및 미리보기 */}
            {video?.status === 'COMPLETED' && video.videoUrl ? (
              <div className={`${fullscreen ? 'h-full w-full flex items-center justify-center' : 'mb-10 flex justify-center'}`}>
                {/* 데스크톱에서 숏폼 느낌을 위한 센터링된 컨테이너 - 크기 조절 */}
                <div className={`${fullscreen ? 'w-full h-full' : 'max-w-[280px] mx-auto'}`}>
                  <div 
                    className={`relative overflow-hidden ${
                      fullscreen 
                        ? 'w-full h-full max-w-[400px] mx-auto' 
                        : 'rounded-lg shadow-lg aspect-[9/16] bg-black'
                    }`}
                    onClick={toggleFullscreen}
                  >
                    <video 
                      ref={videoRef}
                      controls={!fullscreen}
                      muted={muted}
                      loop
                      playsInline
                      className={`object-contain ${fullscreen ? 'h-full w-full' : 'w-full h-full'}`}
                      poster="/assets/images/video-poster.jpg"
                    >
                      <source src={video.videoUrl} type="video/mp4" />
                      브라우저가 비디오 재생을 지원하지 않습니다.
                    </video>
                    
                    {fullscreen && (
                      <div className="absolute inset-0 flex flex-col">
                        {/* 상단 컨트롤 */}
                        <div className="absolute top-4 right-4 z-10">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setFullscreen(false);
                            }}
                            className="bg-black/40 p-2 rounded-full text-white"
                          >
                            <IoCloseOutline size={24} />
                          </button>
                        </div>
                        
                        {/* 오른쪽 컨트롤 */}
                        <div className="absolute bottom-20 right-4 flex flex-col gap-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMute();
                            }}
                            className="bg-black/40 p-2 rounded-full text-white"
                          >
                            {muted ? (
                              <IoVolumeMuteOutline size={24} />
                            ) : (
                              <IoVolumeHighOutline size={24} />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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

            {!fullscreen && (
              <div className="flex flex-col items-center gap-4 mb-32">
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
            )}
          </>
        )}
      </div>
    </Layout>
  );
}