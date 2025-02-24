// components/pages/img/ImageGrid.tsx
import React, { useState } from 'react';
import { ImageData } from '@/api/ImageApi';
import Image from '@/components/common/Image';

interface ImageGridProps {
  images: ImageData[];
  onImageClick: (image: ImageData) => void;
  paragraphTexts?: { [key: string]: string };
}

const ITEMS_PER_PAGE = 9;

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick, paragraphTexts }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedImages = showAll ? images : images.slice(0, ITEMS_PER_PAGE);
  const hasMoreImages = images.length > ITEMS_PER_PAGE;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {displayedImages.map((image, index) => (
          <div
            key={image.image_id}
            className="aspect-[3/4] bg-gray-200 cursor-pointer overflow-hidden rounded"
            onClick={() => onImageClick(image)}
          >
            <Image
              src={image.image_url}
              alt={`Generated image ${index + 1}`}
              className="w-full h-full"
            />
          </div>
        ))}
      </div>
      
      {hasMoreImages && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-3 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
        >
          더 보기 ({images.length - ITEMS_PER_PAGE}개)
        </button>
      )}
      
      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full py-3 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
        >
          접기
        </button>
      )}
    </div>
  );
};

export default ImageGrid;