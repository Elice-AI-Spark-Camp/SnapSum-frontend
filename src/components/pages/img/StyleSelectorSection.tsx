// components/pages/img/StyleSelectorSection.tsx
import React, { useState, useEffect } from 'react';
import ChatMessage from '@/components/common/ChatMessage';
import StyleSelector from '@/components/pages/img/StyleSelector';
import { IoInformationCircle } from 'react-icons/io5';

interface StyleSelectorSectionProps {
  selectedStyle: string;
  onStyleSelect: (style: string) => void;
  onPrevClick: () => void;
  paragraphCount: number; // 문단 개수(이미지 개수)를 받는 prop 추가
}

const StyleSelectorSection: React.FC<StyleSelectorSectionProps> = ({
  selectedStyle,
  onStyleSelect,
  onPrevClick,
  paragraphCount
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Photo');

  // 선택된 스타일에 따라 카테고리 업데이트
  useEffect(() => {
    if (['polaroid', 'tilt_shift', 'product_shot', 'portrait', 'color_splash', 'monochrome'].includes(selectedStyle)) {
      setActiveCategory('Photo');
    } else if (['chalk', 'graffiti', 'watercolor', 'oil_painting'].includes(selectedStyle)) {
      setActiveCategory('Painting');
    } else {
      setActiveCategory('Illustration');
    }
  }, [selectedStyle]);

  // 카테고리에 따른 설명 반환
  const getCategoryDescription = () => {
    switch (activeCategory) {
      case 'Photo':
        return '사진 스타일은 실제 사진처럼 보이는 이미지를 생성합니다. 폴라로이드, 틸트 시프트 등 다양한 촬영 기법의 느낌을 선택할 수 있습니다.';
      case 'Painting':
        return '페인팅 스타일은 손으로 그린 듯한 아트워크를 생성합니다. 수채화, 유화 등 다양한 그림 기법의 느낌을 표현할 수 있습니다.';
      case 'Illustration':
        return '일러스트레이션 스타일은 그래픽 디자인 요소가 강한 이미지를 생성합니다. 3D, 벡터, 만화 등 다양한 일러스트 기법을 적용할 수 있습니다.';
      default:
        return '원하는 스타일을 선택하여 이미지를 생성해보세요.';
    }
  };

  // StyleSelector 컴포넌트에서 탭 변경 이벤트를 받기 위한 핸들러
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };


  return (
    <div className="mb-6">
      <div className="mb-6 w-fit">
        <ChatMessage
          message={`당신이 나눈 문단 기준으로 장면이 전환될 때 마다
바뀔 이미지를 ${paragraphCount} 개 생성하겠습니다.

어떤 스타일의 이미지를 생성할까요?`}
          showNavigationButtons
          onPrevClick={onPrevClick}
        />
      </div>
      <div className="bg-gray-light rounded-full p-4 mb-6 flex items-center justify-center gap-5">
        <IoInformationCircle className="text-primary text-lg" />
        <span className="text-sm text-start">
          {getCategoryDescription()}
        </span>
      </div>

      <StyleSelector
        onSelectStyle={onStyleSelect}
        selectedStyle={selectedStyle}
        onCategoryChange={handleCategoryChange} // 카테고리 변경 이벤트 핸들러 전달
      />
    </div>
  );
};

export default StyleSelectorSection;