// components/pages/img/StyleSelectorSection.tsx
import React from 'react';
import ChatMessage from '@/components/common/ChatMessage';
import StyleSelector from '@/components/pages/img/StyleSelector';

interface StyleSelectorSectionProps {
  selectedStyle: string;
  onStyleSelect: (style: string) => void;
  onPrevClick: () => void;
}

const StyleSelectorSection: React.FC<StyleSelectorSectionProps> = ({
  selectedStyle,
  onStyleSelect,
  onPrevClick
}) => {
  return (
    <div className="mb-6">
      <div className="mb-6 w-fit">
        <ChatMessage
          message={`이미지 스타일을 선택해주세요.
선택한 스타일로 모든 이미지가 생성됩니다.`}
          showNavigationButtons
          onPrevClick={onPrevClick}
        />
      </div>
      
      <StyleSelector
        onSelectStyle={onStyleSelect}
        selectedStyle={selectedStyle}
      />
      
      {/* 생성하기 버튼 제거됨 - 하단 네비게이션 버튼으로 대체 */}
    </div>
  );
};

export default StyleSelectorSection;