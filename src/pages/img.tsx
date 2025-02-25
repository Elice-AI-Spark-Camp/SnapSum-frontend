/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/img.tsx
import { useEffect, useState } from 'react';
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
import StyleSelector from "@/components/pages/img/StyleSelector";
import { HiSparkles, HiArrowPath } from 'react-icons/hi2';
import { ImageData } from '@/api/ImageApi';

export default function Img() {
  const { routeState, navigateTo, goBack, isLoading } = useRouteManager();
  const { generateImagesMutation, regenerateImageMutation } = useImageMutation();
  const { showToast } = useToastStore();
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [paragraphTexts, setParagraphTexts] = useState<{ [key: string]: string }>({});
  const [selectedStyle, setSelectedStyle] = useState('polaroid');
  const [showStyleSelector, setShowStyleSelector] = useState(false);

  useEffect(() => {
    const loadAndGenerateImages = async () => {
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
          return;
        }

        if (!summaryState.summaryId) {
          throw new Error('요약 정보를 찾을 수 없습니다.');
        }

        // 스타일 선택 여부 체크를 위해 상태 업데이트 딜레이
        setShowStyleSelector(true);
      } catch (error: any) {
        console.error('Load Images Error:', error);
        showToast(error.message);
      }
    };

    loadAndGenerateImages();
  }, []); // 한 번만 실행

  const generateImages = async () => {
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

      // onSuccess에서 localStorage 업데이트 외에 상태도 직접 갱신
      localStorage.setItem('summaryState', JSON.stringify({
        ...summaryState,
        images: data.images,
        style: selectedStyle
      }));
      const newParagraphMap = data.images.reduce(
        (acc: Record<string, string>, img: ImageData, index: number) => {
          acc[img.image_id] = summaryState.paragraphs?.[index] || '';
          return acc;
        },
        {}
      );
      setParagraphTexts(newParagraphMap);
      setImages(data.images);
      setShowStyleSelector(false);
    } catch (error: any) {
      console.error('Generate Images Error:', error);
      showToast(error.message);
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

  const handleRegenerate = (imageId: string) => {
    regenerateImageMutation.mutate(imageId, {
      onSuccess: (newImage) => {
        // 캐싱 방지 쿼리 파라미터 추가
        const noCacheImage: ImageData = {
          ...newImage,
          image_url: `${newImage.image_url}?t=${Date.now()}`
        };
  
        setImages(prev =>
          prev.map(img => img.image_id === imageId ? noCacheImage : img)
        );
        setSelectedImage(noCacheImage);
  
        // localStorage도 업데이트
        const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');
        if (summaryState.images) {
          const updatedImages = summaryState.images.map((img: ImageData) =>
            img.image_id === imageId ? noCacheImage : img
          );
          localStorage.setItem('summaryState', JSON.stringify({
            ...summaryState,
            images: updatedImages
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
    setImages([]);
  };

  if (isLoading || !routeState) {
    return null;
  }

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - 이미지 선택" />

      {(generateImagesMutation.isPending || regenerateImageMutation.isPending) && (
        <LoadingSpinner message="이미지를 생성하고 있습니다..." />
      )}

      {selectedImage && (
        <ImageModal
          key={selectedImage.image_url} // 이미지 URL이 변경될 때마다 컴포넌트를 강제로 다시 렌더링
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
          imageCount={images.length}
        />
      </div>

      <div className="relative max-w-[600px] mx-auto px-2">
        <div className="mt-8 mb-32">
          {showStyleSelector ? (
            <div className="mb-6">
              <div className="mb-6 w-fit">
                <ChatMessage
                  message="이미지 스타일을 선택해주세요. 선택한 스타일로 모든 이미지가 생성됩니다."
                  showNavigationButtons
                  onPrevClick={goBack}
                />
              </div>
              <StyleSelector
                onSelectStyle={handleStyleSelect}
                selectedStyle={selectedStyle}
              />
              <div className="mt-6 flex justify-center">
                <button
                  onClick={generateImages}
                  disabled={generateImagesMutation.isPending}
                  className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-md"
                >
                  {generateImagesMutation.isPending ? (
                    <>
                      <HiArrowPath className="w-5 h-5 animate-spin" />
                      <span>생성 중...</span>
                    </>
                  ) : (
                    <>
                      <HiSparkles className="w-5 h-5" />
                      <span>이 스타일로 이미지 생성하기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 w-fit">
                <ChatMessage
                  message={`당신이 남긴 글로 ${images.length}개의 이미지를 만들어 보았어요.\n필요없는 이미지를 지우거나 리텍스트를 통해 새로운 이미지를 찾아볼 수 있어요.`}
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
            onClick={() => navigateTo('video')}
            textType="long"
          />
        </div>
      </div>
    </Layout>
  );
}