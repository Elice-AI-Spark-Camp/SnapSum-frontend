// components/common/ChatMessage.tsx
import NavigationButton from "./NavigationButton";

interface ChatMessageProps {
  message: string;
  showNavigationButtons?: boolean;
  onPrevClick?: () => void;
  onNextClick?: () => void;
}

export default function ChatMessage({
  message,
  showNavigationButtons = false,
  onPrevClick,
}: ChatMessageProps) {
  return (
    <div className="w-full max-w-[280px] mx-auto">
      {/* SNAPSUM 헤더 */}
      <div className="font-bold mb-1 ml-1 text-xs">
        SNAPSUM
      </div>

      {/* 메시지 박스 */}
      <div className="bg-primary text-white rounded-xl p-4 shadow-lg">
        <p className="text-xs leading-relaxed whitespace-pre-line">
          {message}
        </p>
      </div>

      {/* 네비게이션 버튼 (박스 밖) */}
      {showNavigationButtons && (
        <div className="flex justify-end mt-2">
          <NavigationButton
            direction="prev"
            onClick={onPrevClick || (() => {})}
            textType="short"
          />
        </div>
      )}
    </div>
  );
}