/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/img.tsx
import { useEffect, useState } from 'react';
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
import Image from '@/components/common/Image';

export default function Img() {
  const { routeState, navigateTo, goBack, isLoading } = useRouteManager();
  const { generateImagesMutation, regenerateImageMutation } = useImageMutation();
  const { showToast } = useToastStore();
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);

  // pages/img.tsx
  useEffect(() => {
    const loadAndGenerateImages = async () => {
      try {
        const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');

        if (summaryState.images?.length > 0) {
          setImages(summaryState.images);
          return;
        }

        if (!summaryState.summaryId) {
          throw new Error('요약 정보를 찾을 수 없습니다.');
        }

        // style을 'polaroid'로 설정하여 API 요청
        await generateImagesMutation.mutateAsync({
          summary_id: Number(summaryState.summaryId),
          style: 'polaroid'  // 기본 스타일 설정
        });

      } catch (error: any) {
        console.error('Load Images Error:', error);
        showToast(error.message);
      }
    };

    loadAndGenerateImages();
  }, []);

  useEffect(() => {
    if (generateImagesMutation.data?.images) {
      setImages(generateImagesMutation.data.images);
    }
  }, [generateImagesMutation.data]);

  const handleImageClick = (image: ImageData) => {
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
        />
      )}

      <div className="sticky top-0 bg-white z-50">
        <StepProgressBar
          currentStep={routeState.currentStep}
          platform={routeState.platform}
          paragraphCount={routeState.paragraphCount}
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
              <div className="grid grid-cols-3 gap-2">
                {images.map((image) => (
                  <div
                    key={image.image_id}
                    className="aspect-[3/4] bg-gray-200 cursor-pointer overflow-hidden rounded"
                    onClick={() => handleImageClick(image)}
                  >
                    <Image
                      src={image.image_url}
                      alt="Generated image"
                      className="w-full h-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                이미지를 생성하는 중입니다...
              </div>
            )}
          </div>

          <button className="w-full py-3 bg-gray-200 text-gray-600 rounded">
            스크롤
          </button>
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