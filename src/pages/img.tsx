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
import { ImageData } from '@/api/ImageApi';

export default function Img() {
  const { routeState, navigateTo, goBack, isLoading } = useRouteManager();
  const { generateImagesMutation, regenerateImageMutation } = useImageMutation();
  const { showToast } = useToastStore();
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [paragraphTexts, setParagraphTexts] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadAndGenerateImages = async () => {
      try {
        const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');
        
        if (summaryState.paragraphs && Array.isArray(summaryState.paragraphs)) {
          if (summaryState.images?.length > 0) {
            const paragraphMap = summaryState.images.reduce(
              (acc: Record<string, string>, img: ImageData, index: number) => {
                acc[img.image_id] = summaryState.paragraphs[index] || '';
                return acc;
              },
              {}
            );
            
            setParagraphTexts(paragraphMap);
          }
        }

        if (summaryState.images?.length > 0) {
          setImages(summaryState.images);
          return;
        }

        if (!summaryState.summaryId) {
          throw new Error('요약 정보를 찾을 수 없습니다.');
        }

        await generateImagesMutation.mutateAsync({
          summary_id: Number(summaryState.summaryId),
          style: 'polaroid'
        });
      } catch (error: any) {
        console.error('Load Images Error:', error);
        showToast(error.message);
      }
    };

    loadAndGenerateImages();
  }, []);

  const handleImageClick = (image: ImageData) => {
    const index = images.findIndex(img => img.image_id === image.image_id);
    setCurrentImageIndex(index);
    setSelectedImage(image);
  };

  const handleRegenerate = (imageId: string) => {
    regenerateImageMutation.mutate(imageId, {
      onSuccess: (newImage) => {
        setImages(prev =>
          prev.map(img => img.image_id === imageId ? newImage : img)
        );
        setSelectedImage(newImage);
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
          <div className="mb-6 w-fit">
            <ChatMessage
              message={`당신이 남긴 글로 ${routeState.paragraphCount}개의 이미지를 만들어 보았어요.\n필요없는 이미지를 지우거나 리텍스트를 통해 새로운 이미지를 찾아볼 수 있어요.`}
              showNavigationButtons
              onPrevClick={goBack}
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{routeState.platform}</span>
              <span>{images.length}개의 이미지</span>
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