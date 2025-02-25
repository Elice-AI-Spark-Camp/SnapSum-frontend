// components/common/Image.tsx
import React, { useState } from 'react';

interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackSrc = '/images/placeholder.png'  // 기본 플레이스홀더 이미지
}) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.error(`Image load failed for: ${src}`);
    setError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // 이미지 URL이 상대 경로인 경우 API URL 추가
  const getImageUrl = (url: string) => {
    if (!url) return fallbackSrc;
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      <img
        src={error ? fallbackSrc : getImageUrl(src)}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'invisible' : 'visible'}`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default Image;