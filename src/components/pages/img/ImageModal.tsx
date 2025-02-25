// components/pages/img/ImageModal.tsx
import React from 'react';
import { ImageData } from '@/api/ImageApi';
import { HiX, HiRefresh, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface ImageModalProps {
  image: ImageData;
  onClose: () => void;
  onRegenerate: (imageId: string) => void;
  isRegenerating: boolean;
  paragraphText?: string;
  totalImages: number;
  currentIndex: number;
  onPrevImage: () => void;
  onNextImage: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  image,
  onClose,
  onRegenerate,
  isRegenerating,
  paragraphText,
  totalImages,
  currentIndex,
  onPrevImage,
  onNextImage
}) => {
  const showPrev = currentIndex > 0;
  const showNext = currentIndex < totalImages - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg w-full max-w-2xl p-4 mx-4">
        <div className="min-h-[600px] flex flex-col">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-50"
          >
            <HiX size={24} />
          </button>

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              {totalImages}개 중 {currentIndex + 1}번째 이미지
            </span>
          </div>

          {/* 이미지와 텍스트를 회색 배경 컨테이너로 감싸기 */}
          <div className="relative mb-4 flex-grow flex items-center justify-center">
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
              <div className="relative group">
                {showPrev && (
                  <button
                    onClick={onPrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HiChevronLeft size={24} />
                  </button>
                )}

                <img
                  src={image.image_url}
                  alt="Generated image"
                  className="w-[400px] h-[400px] object-cover rounded-lg"
                />

                {showNext && (
                  <button
                    onClick={onNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HiChevronRight size={24} />
                  </button>
                )}
              </div>


              {paragraphText && (
                <div className="mt-4 w-full h-[120px] overflow-y-auto">
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {paragraphText}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-auto">
            <button
              onClick={() => onRegenerate(image.image_id)}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
            >
              <HiRefresh size={20} className={isRegenerating ? 'animate-spin' : ''} />
              재생성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
