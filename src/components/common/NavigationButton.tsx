// components/common/NavigationButton.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  textType?: 'short' | 'long';
}

export default function NavigationButton({ 
  direction, 
  onClick, 
  textType = 'long'
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
      className="flex items-center gap-1 px-2 py-1 text-sm text-primary font-bold transition-colors"
    >
      {direction === 'prev' && <ChevronLeft className="w-4 h-4" />}
      {getText()}
      {direction === 'next' && <ChevronRight className="w-4 h-4" />}
    </button>
  );
}