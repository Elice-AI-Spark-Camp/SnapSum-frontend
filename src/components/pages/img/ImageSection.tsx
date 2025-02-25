import { useEffect, useState } from 'react';
import ImageGrid from './ImageGrid';
import StyleSelector from './StyleSelector';
import ImageModal from './ImageModal';
import ChatMessage from '@/components/common/ChatMessage';
import { HiSparkles, HiArrowPath } from 'react-icons/hi2';
import { ImageData } from '@/api/ImageApi';

interface ImageSectionProps {
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  showStyleSelector: boolean;
  setShowStyleSelector: (show: boolean) => void;
  generateImagesMutation: any;
  regenerateImageMutation: any;
  showToast: (message: string) => void;
  goBack: () => void;
}

export default function ImageSection({
  selectedStyle,
  setSelectedStyle,
  showStyleSelector,
  setShowStyleSelector,
  generateImagesMutation,
  regenerateImageMutation,
  showToast,
  goBack
}: ImageSectionProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [paragraphTexts, setParagraphTexts] = useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');

    if (summaryState.images?.length > 0) {
      const paragraphMap = summaryState.images.reduce(
        (acc: Record<string, string>, img: ImageData, index: number) => {
          acc[img.image_id] = summaryState.paragraphs?.[index] || '';
          return acc;
        },
        {}
      );
      setParagraphTexts(paragraphMap);
      setImages(summaryState.images);

      if (summaryState.style) {
        setSelectedStyle(summaryState.style);
      }
    }
  }, []);

  const generateImages = async () => {
    try {
      const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');

      if (!summaryState.summaryId) throw new Error('요약 정보를 찾을 수 없습니다.');

      const data = await generateImagesMutation.mutateAsync({
        summary_id: Number(summaryState.summaryId),
        style: selectedStyle
      });

      localStorage.setItem('summaryState', JSON.stringify({
        ...summaryState,
        images: data.images,
        style: selectedStyle
      }));

      const newParagraphMap = data.images.reduce((acc: Record<string, string>, img: ImageData, index: number) => {
        acc[img.image_id] = summaryState.paragraphs?.[index] || '';
        return acc;
      }, {});

      setParagraphTexts(newParagraphMap);
      setImages(data.images);
      setShowStyleSelector(false);
    } catch (error: any) {
      console.error('Generate Images Error:', error);
      showToast(error.message);
    }
  };

  const handleRegenerate = (imageId: string) => {
    regenerateImageMutation.mutate(imageId, {
      onSuccess: (newImage: ImageData) => {
        const updatedImage: ImageData = {
          ...newImage,
          image_url: `${newImage.image_url}?t=${Date.now()}`
        };

        setImages(prevImages =>
          prevImages.map(img => (img.image_id === imageId ? updatedImage : img))
        );
        setSelectedImage(updatedImage);

        const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');
        if (summaryState.images) {
          const updatedImages = summaryState.images.map((img: ImageData) =>
            img.image_id === imageId ? updatedImage : img
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
      setCurrentImageIndex(currentImageIndex - 1);
      setSelectedImage(images[currentImageIndex - 1]);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setSelectedImage(images[currentImageIndex + 1]);
    }
  };

  return (
    <div className="relative max-w-[600px] mx-auto px-2">
      <div className="mt-8 mb-32">
        {showStyleSelector ? (
          <div className="mb-6">
            <ChatMessage
              message="이미지 스타일을 선택해주세요. 선택한 스타일로 모든 이미지가 생성됩니다."
              showNavigationButtons
              onPrevClick={goBack}
            />
            <StyleSelector onSelectStyle={setSelectedStyle} selectedStyle={selectedStyle} />
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
            <ChatMessage
              message={`당신이 남긴 글로 ${images.length}개의 이미지를 만들어 보았어요.`}
              showNavigationButtons
              onPrevClick={goBack}
            />
            <ImageGrid images={images} onImageClick={setSelectedImage} paragraphTexts={paragraphTexts} />
          </>
        )}
      </div>

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
    </div>
  );
}
