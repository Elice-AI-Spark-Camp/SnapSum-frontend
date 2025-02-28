// components/pages/img/StyleSelectorSection.tsx
import React from 'react';
import ChatMessage from '@/components/common/ChatMessage';
import StyleSelector from '@/components/pages/img/StyleSelector';

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
  return (
    <div className="mb-6">
      <div className="mb-6 w-fit">
        <ChatMessage
          message={`당신이 나눈 문단 기준으로 장면이 전환할될 때 마다 
바뀔 이미지를 ${paragraphCount} 개 생성하겟습니다.

어떤 스타일의 이미지를 생성할까요?`}
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