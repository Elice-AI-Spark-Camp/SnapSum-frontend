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
  onNextClick
}: ChatMessageProps) {
  return (
    <div className="w-full max-w-[335px] mx-auto">
      {/* SNAPSUM 헤더 */}
      <div className="text-black font-bold mb-2 text-sm">
        SNAPSUM
      </div>

      {/* 메시지 박스 */}
      <div className="bg-[#2F2F2F] text-white rounded-xl p-4 shadow-lg">
        <p className="text-sm leading-relaxed">{message}</p>
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