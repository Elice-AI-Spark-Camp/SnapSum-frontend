import React from 'react';
import { ImageData } from '@/api/ImageApi';
import { HiX, HiRefresh } from 'react-icons/hi';

interface ImageModalProps {
  image: ImageData;
  onClose: () => void;
  onRegenerate: (imageId: string) => void;
  isRegenerating: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({
  image,
  onClose,
  onRegenerate,
  isRegenerating
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-lg w-full max-w-2xl p-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <HiX size={24} />
        </button>
        
        <div className="mb-4">
          <img
            src={image.image_url}
            alt="Generated image"
            className="w-full rounded-lg"
          />
        </div>
        
        <div className="flex justify-end gap-2">
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
  );
};

export default ImageModal;