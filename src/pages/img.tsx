/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/img.tsx
import { useEffect, useState, useRef } from 'react';
import ImageGrid from '@/components/pages/img/ImageGrid';
import { useRouteManager } from '@/hooks/useRouteManager';
import { useImageMutation } from '@/services/useImageMutation';
import { useToastStore } from '@/store/useToastStore';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import ChatMessage from "@/components/common/ChatMessage";
import NavigationButton from "@/components/common/NavigationButton";
import CustomHead from "@/components/common/CustomHead";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ImageModal from "@/components/pages/img/ImageModal";
import { HiArrowPath } from 'react-icons/hi2';
import { ImageData } from '@/api/ImageApi';
import StyleSelectorSection from '@/components/pages/img/StyleSelectorSection';

export default function Img() {
  const { routeState, navigateTo, goBack } = useRouteManager();
  const { generateImagesMutation, regenerateImageMutation } = useImageMutation();
  const { showToast } = useToastStore();
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [paragraphTexts, setParagraphTexts] = useState<{ [key: string]: string }>({});
  const [selectedStyle, setSelectedStyle] = useState('polaroid');
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const isGeneratingRef = useRef(false);

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');

        // 로컬에 이미 이미지가 있다면 바로 사용
        if (summaryState.images?.length > 0) {
          const paragraphMap = summaryState.images.reduce(
            (acc: Record<string, string>, img: ImageData, index: number) => {
              acc[img.image_id] = summaryState.paragraphs[index] || '';
              return acc;
            },
            {}
          );
          setParagraphTexts(paragraphMap);
          setImages(summaryState.images);

          // 저장된 스타일이 있다면 로드
          if (summaryState.style) {
            setSelectedStyle(summaryState.style);
          }
          setShowStyleSelector(false);
        } else {
          if (!summaryState.summaryId) {
            throw new Error('요약 정보를 찾을 수 없습니다.');
          }
          setShowStyleSelector(true);
        }
        setIsInitialized(true);
      } catch (error: any) {
        console.error('초기 데이터 로드 오류:', error);
        showToast(error.message);
        setIsInitialized(true);
      }
    };

    loadInitialData();
  }, [showToast]);

  // 이미지 생성 함수
  const generateImages = async () => {
    if (isGeneratingRef.current) return; // 이미 진행 중이면 중복 요청 방지

    isGeneratingRef.current = true;
    try {
      const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');

      if (!summaryState.summaryId) {
        throw new Error('요약 정보를 찾을 수 없습니다.');
      }

      // 이미지 생성 API 호출
      const data = await generateImagesMutation.mutateAsync({
        summary_id: Number(summaryState.summaryId),
        style: selectedStyle
      });

      // 로컬 상태 및 localStorage 업데이트
      const newParagraphMap = data.images.reduce(
        (acc: Record<string, string>, img: ImageData, index: number) => {
          acc[img.image_id] = summaryState.paragraphs?.[index] || '';
          return acc;
        },
        {}
      );

      localStorage.setItem('summaryState', JSON.stringify({
        ...summaryState,
        images: data.images,
        style: selectedStyle
      }));

      setParagraphTexts(newParagraphMap);
      setImages(data.images);
      setShowStyleSelector(false);
    } catch (error: any) {
      console.error('이미지 생성 오류:', error);
      showToast(error.message);
    } finally {
      isGeneratingRef.current = false;
    }
  };

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
  };

  const handleImageClick = (image: ImageData) => {
    const index = images.findIndex(img => img.image_id === image.image_id);
    setCurrentImageIndex(index);
    setSelectedImage(image);
  };

  const handleRegenerate = (imageId: string, paragraphText?: string) => {
    regenerateImageMutation.mutate(imageId, {
      onSuccess: (newImage) => {
        // 캐싱 방지 쿼리 파라미터 추가
        const noCacheImage: ImageData = {
          ...newImage,
          image_url: `${newImage.image_url}?t=${Date.now()}`
        };

        // 상태 및 localStorage 업데이트
        const updatedParagraphTexts = {
          ...paragraphTexts,
          [imageId]: paragraphText || paragraphTexts[imageId] || ''
        };
        setParagraphTexts(updatedParagraphTexts);

        const updatedImages = images.map(img =>
          img.image_id === imageId ? noCacheImage : img
        );
        setImages(updatedImages);

        // 선택된 이미지도 업데이트
        if (selectedImage?.image_id === imageId) {
          setSelectedImage(noCacheImage);
        }

        // localStorage 업데이트
        const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');
        if (summaryState.images) {
          const newImages = summaryState.images.map((img: ImageData) =>
            img.image_id === imageId ? noCacheImage : img
          );
          localStorage.setItem('summaryState', JSON.stringify({
            ...summaryState,
            images: newImages
          }));
        }
      }
    });
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      const prevImage = images[currentImageIndex - 1];
      setCurrentImageIndex(currentImageIndex - 1);
      setSelectedImage(prevImage);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      const nextImage = images[currentImageIndex + 1];
      setCurrentImageIndex(currentImageIndex + 1);
      setSelectedImage(nextImage);
    }
  };

  const handleStartOver = () => {
    setShowStyleSelector(true);
  };

  // "다음" 버튼 핸들러
  const handleNext = async () => {
    if (showStyleSelector) {
      // 스타일 선택 중이면 이미지 생성 후 이미지 보기 화면으로
      if (generateImagesMutation.isPending || isGeneratingRef.current) return;
      await generateImages();
    } else {
      // 이미지 보기 중이면 다음 페이지로
      navigateTo('video');
    }
  };

  // 로딩 중인 경우
  if (!isInitialized || !routeState) {
    return (
      <Layout showInfo={false}>
        <CustomHead title="SNAPSUM - 이미지 선택" />
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner message="데이터를 불러오는 중입니다..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - 이미지 선택" />

      {(generateImagesMutation.isPending || regenerateImageMutation.isPending) && (
        <LoadingSpinner message="이미지를 생성하고 있습니다..." />
      )}

      {selectedImage && (
        <ImageModal
          key={selectedImage.image_url}
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onRegenerate={handleRegenerate}
          isRegenerating={regenerateImageMutation.isPending}
          paragraphText={paragraphTexts[selectedImage.image_id]}
          totalImages={images.length}
          currentIndex={currentImageIndex}
          onPrevImage={handlePrevImage}
          onNextImage={handleNextImage}
        />
      )}

      <div className="sticky top-0 bg-white z-50">
        <StepProgressBar
          currentStep={routeState.currentStep}
          platform={routeState.platform}
          paragraphCount={routeState.paragraphCount}
          imageCount={images.length || routeState.paragraphCount}
        />
      </div>

      <div className="relative max-w-[600px] mx-auto px-2">
        <div className="mt-8 mb-32">
          {showStyleSelector ? (
            <StyleSelectorSection
              selectedStyle={selectedStyle}
              onStyleSelect={handleStyleSelect}
              onPrevClick={goBack}
              paragraphCount={routeState.paragraphCount || 0}
            />
          ) : (
            <>
              <div className="mb-6 w-fit">
                <ChatMessage
                  message={`당신이 남긴 문단 기준으로 정확히 전달할 때 다
양한 이미지를 ${images.length} 개 생성했어요.

클릭하면 어느 문단에 들어가는지 확대된 이미지로
확인할 수 있어요.

생성된 이미지가 마음에 들지 않는다면
'재생성' 버튼을 눌러 새로 만들 수 있어요.`}
                  showNavigationButtons
                  onPrevClick={goBack}
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{routeState.platform}</span>
                  <div className="flex items-center gap-2">
                    <span>{images.length}개의 이미지</span>
                    <button
                      onClick={handleStartOver}
                      className="text-primary text-sm hover:underline flex items-center gap-1"
                    >
                      <HiArrowPath className="w-4 h-4" />
                      스타일 변경
                    </button>
                  </div>
                </div>
                {images.length > 0 ? (
                  <ImageGrid
                    images={images}
                    onImageClick={handleImageClick}
                    paragraphTexts={paragraphTexts}
                  />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    이미지를 생성하는 중입니다...
                  </div>
                )}
              </div>
            </>
          )}
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
            disabled={showStyleSelector && generateImagesMutation.isPending}
          />
        </div>
      </div>
    </Layout>
  );
}