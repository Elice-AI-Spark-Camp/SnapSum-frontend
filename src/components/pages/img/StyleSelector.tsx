// components/pages/img/StyleSelector.tsx
import React, { useState, useEffect } from 'react';
import { 
  HiOutlineCamera, HiOutlinePhotograph, HiOutlineCube, 
  HiOutlineColorSwatch, HiOutlineUser, HiAdjustments,
  HiPencil, HiPencilAlt, HiOutlineLightBulb, HiOutlineEmojiHappy,
  HiOutlineCubeTransparent, HiOutlinePuzzle, HiOutlineDocumentText, 
  HiOutlineDesktopComputer, HiOutlineChip, HiOutlineBookOpen,
  HiOutlineSwitchVertical, HiOutlineAcademicCap, HiOutlineTicket,
  HiOutlineFilm, HiOutlineTag
} from 'react-icons/hi';

interface StyleOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface StyleGroupOption {
  category: string;
  styles: StyleOption[];
}

interface StyleSelectorProps {
  onSelectStyle: (style: string) => void;
  selectedStyle: string;
  onCategoryChange?: (category: string) => void; // 카테고리 변경 콜백 추가
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ onSelectStyle, selectedStyle, onCategoryChange }) => {
  const [activeTab, setActiveTab] = useState(0);

  const styleGroups: StyleGroupOption[] = [
    {
      category: 'Photo',
      styles: [
        { id: 'polaroid', name: '폴라로이드', icon: <HiOutlineCamera size={32} /> },
        { id: 'tilt_shift', name: '틸트 시프트', icon: <HiOutlinePhotograph size={32} /> },
        { id: 'product_shot', name: '제품 사진', icon: <HiOutlineCube size={32} /> },
        { id: 'portrait', name: '인물 사진', icon: <HiOutlineUser size={32} /> },
        { id: 'color_splash', name: '컬러 스플래시', icon: <HiOutlineColorSwatch size={32} /> },
        { id: 'monochrome', name: '모노크롬', icon: <HiAdjustments size={32} /> },
      ],
    },
    {
      category: 'Painting',
      styles: [
        { id: 'chalk', name: '초크', icon: <HiPencil size={32} /> },
        { id: 'graffiti', name: '그라피티', icon: <HiPencilAlt size={32} /> },
        { id: 'watercolor', name: '수채화', icon: <HiOutlineLightBulb size={32} /> },
        { id: 'oil_painting', name: '유화', icon: <HiOutlineEmojiHappy size={32} /> },
      ],
    },
    {
      category: 'Illustration',
      styles: [
        { id: 'isometric', name: '아이소메트릭', icon: <HiOutlineCubeTransparent size={32} /> },
        { id: 'low_polygon', name: '저폴리곤', icon: <HiOutlinePuzzle size={32} /> },
        { id: 'origami', name: '종이접기', icon: <HiOutlineDocumentText size={32} /> },
        { id: '3d_animation', name: '3D 애니메이션', icon: <HiOutlineDesktopComputer size={32} /> },
        { id: '3d_item', name: '3D 렌더링', icon: <HiOutlineChip size={32} /> },
        { id: 'childrens_book', name: '어린이 책', icon: <HiOutlineBookOpen size={32} /> },
        { id: 'vector', name: '벡터화', icon: <HiOutlineSwitchVertical size={32} /> },
        { id: 'scientific_illustration', name: '과학 책 일러스트', icon: <HiOutlineAcademicCap size={32} /> },
        { id: 'comic', name: '만화', icon: <HiOutlineTicket size={32} /> },
        { id: 'movie_poster', name: '영화 포스터', icon: <HiOutlineFilm size={32} /> },
        { id: 'stickers', name: '스티커', icon: <HiOutlineTag size={32} /> },
      ],
    },
  ];
// 탭 변경 시 카테고리 변경 이벤트 발생
useEffect(() => {
  if (onCategoryChange) {
    onCategoryChange(styleGroups[activeTab].category);
  }
}, [activeTab, onCategoryChange, styleGroups]);

// 선택된 스타일이 변경될 때 해당 탭으로 이동하는 useEffect도 동일

const getTabName = (category: string) => {
  // 이 함수는 동일
  switch(category) {
    case 'Photo': return '사진';
    case 'Painting': return '페인팅';
    case 'Illustration': return '일러스트레이션';
    default: return category;
  }
};

// 탭 버튼 클릭 처리 함수
const handleTabChange = (index: number) => {
  setActiveTab(index);
  if (onCategoryChange) {
    onCategoryChange(styleGroups[index].category);
  }
};

// 스타일 버튼 클릭 처리 함수
const handleStyleSelect = (styleId: string) => {
  onSelectStyle(styleId);
  
  const categoryIndex = styleGroups.findIndex(group => 
    group.styles.some(style => style.id === styleId)
  );
  
  if (categoryIndex !== -1 && categoryIndex !== activeTab) {
    setActiveTab(categoryIndex);
    if (onCategoryChange) {
      onCategoryChange(styleGroups[categoryIndex].category);
    }
  }
};

return (
  <div className="w-full max-w-md mx-auto">
    {/* Custom Tab List */}
    <div className="flex space-x-1 rounded-xl bg-gray-100 p-1">
      {styleGroups.map((group, idx) => (
        <button
          key={group.category}
          className={`w-full py-2.5 text-sm font-medium leading-5 rounded-lg focus:outline-none 
            ${activeTab === idx 
              ? 'bg-white shadow text-primary' 
              : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'}`
          }
          onClick={() => handleTabChange(idx)} 
        >
          {getTabName(group.category)}
        </button>
      ))}
    </div>

    {/* Tab Panels */}
    <div className="mt-2">
      {styleGroups.map((group, idx) => (
        <div
          key={idx}
          className={`bg-white rounded-xl p-3 ${activeTab === idx ? 'block' : 'hidden'}`}
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {group.styles.map((style) => (
              <button
                key={style.id}
                className={`relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all
                  ${selectedStyle === style.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'}`
                }
                onClick={() => handleStyleSelect(style.id)}
              >
                <div className="w-16 h-16 mb-2 bg-gray-100 rounded-md flex items-center justify-center text-gray-600">
                  {style.icon}
                </div>
                <span className="text-sm font-medium">{style.name}</span>
                {selectedStyle === style.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="w-3 h-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default StyleSelector;