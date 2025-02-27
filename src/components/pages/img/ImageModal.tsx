import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ImageData } from '@/api/ImageApi';
import { HiX, HiRefresh, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface ImageModalProps {
  image: ImageData;
  onClose: () => void;
  onRegenerate: (imageId: string, paragraphText?: string) => void;
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
  // 상태 초기화 시 localStorage에서 직접 텍스트 가져오기
  const [displayText, setDisplayText] = useState(() => {
    const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');
    const paragraphs = summaryState.paragraphs || [];
    const imageIndex = summaryState.images?.findIndex((img: ImageData) => img.image_id === image.image_id);
    return imageIndex !== -1 && imageIndex !== undefined ? paragraphs[imageIndex] || paragraphText : paragraphText;
  });
  
  // 이전 이미지 ID를 추적하기 위한 ref
  const prevImageIdRef = useRef<string | null>(null);

  // 이미지나 텍스트가 변경될 때 텍스트 업데이트
  useEffect(() => {
    // 이미지 ID가 변경되었거나 재생성이 완료되었을 때
    if (prevImageIdRef.current !== image.image_id || !isRegenerating) {
      // localStorage에서 텍스트 다시 확인
      const summaryState = JSON.parse(localStorage.getItem('summaryState') || '{}');
      const paragraphs = summaryState.paragraphs || [];
      const imageIndex = summaryState.images?.findIndex((img: ImageData) => img.image_id === image.image_id);
      
      const newText = imageIndex !== -1 && imageIndex !== undefined 
        ? paragraphs[imageIndex] || paragraphText 
        : paragraphText;
      
      setDisplayText(newText);
      prevImageIdRef.current = image.image_id;
    }
  }, [image.image_id, paragraphText, isRegenerating]);

  const showPrev = currentIndex > 0;
  const showNext = currentIndex < totalImages - 1;

  const handleRegenerate = useCallback(() => {
    onRegenerate(image.image_id, displayText);
  }, [image.image_id, displayText, onRegenerate]);

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
                  key={image.image_url}
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
              
              {displayText && (
                <div className="mt-4 w-full h-[120px] overflow-y-auto">
                  <p className="text-gray-600 whitespace-pre-wrap break-words">
                    {displayText}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-auto">
            <button
              onClick={handleRegenerate}
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