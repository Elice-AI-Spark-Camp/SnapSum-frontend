// components/common/VideoButton.tsx
import { IoVideocam } from "react-icons/io5";
import { HiDownload, HiPlus } from "react-icons/hi";

interface VideoButtonProps {
  onClick: () => void;
  variant: 'create' | 'download' | 'new';
  disabled?: boolean; // disabled 속성 추가
}

export default function VideoButton({ onClick, variant, disabled = false }: VideoButtonProps) {
  const getContent = () => {
    switch (variant) {
      case 'create':
        return {
          icon: <IoVideocam size={25} className="text-primary" />,
          text: '영상 제작하기',
          styles: 'bg-gray-default hover:bg-secondary text-primary',
          textSize: 'text-[0.938rem]'
        };
      case 'download':
        return {
          icon: <HiDownload size={25} className="text-primary" />,
          text: '영상 다운로드',
          styles: 'bg-gray-light hover:bg-gray-default text-primary',
          textSize: 'text-[0.813rem]'
        };
      case 'new':
        return {
          icon: <HiPlus size={25} className="text-white" />,
          text: '새로운 영상 제작하기',
          styles: 'bg-primary hover:bg-primary/90 text-white',
          textSize: 'text-[0.813rem]'
        };
    }
  };

  const content = getContent();

  // disabled 상태일 때 추가할 스타일
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  // disabled 상태일 때 hover 효과 제거
  const hoverStyles = disabled 
    ? content.styles.replace('hover:bg-secondary', '').replace('hover:bg-gray-default', '').replace('hover:bg-primary/90', '')
    : content.styles;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 
        w-[185px] h-[40px] 
        rounded-[5px]
        ${hoverStyles}
        ${disabledStyles}
      `}
    >
      {content.icon}
      <span className={`font-bold ${content.textSize}`}>
        {content.text}
      </span>
    </button>
  );
}