import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  textType?: 'short' | 'long';
  disabled?: boolean; // disabled 속성 추가
}

export default function NavigationButton({ 
  direction, 
  onClick, 
  textType = 'long',
  disabled = false // 기본값 추가
}: NavigationButtonProps) {
  const getText = () => {
    if (textType === 'short') {
      return direction === 'prev' ? '이전' : '다음';
    }
    return direction === 'prev' ? '이전으로' : '다음으로';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1 px-1 py-1 ${
        textType === 'short' ? 'text-xs' : 'text-sm'
      } text-primary font-bold transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {direction === 'prev' && <ChevronLeft className="w-5 h-5" />}
      {getText()}
      {direction === 'next' && <ChevronRight className="w-5 h-5" />}
    </button>
  );
}