import { useEffect, useRef } from "react";
import { HiArrowCircleRight } from "react-icons/hi";

interface TextEditorProps {
  paragraphs: string[];
  onChange: (newParagraphs: string[]) => void;
}

export function TextEditor({ paragraphs, onChange }: TextEditorProps) {
  const textAreaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    // 모바일 환경 체크
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // 모바일에서는 모든 키 입력 허용
    if (isMobile) return;
    
    // 데스크탑에서는 엔터와 백스페이스만 허용
    if (e.key !== 'Enter' && e.key !== 'Backspace') {
      e.preventDefault();
      return;
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const currentText = paragraphs[index];
      const cursorPosition = (e.target as HTMLTextAreaElement).selectionStart;
      
      if (cursorPosition === 0 || cursorPosition === currentText.length) return;
      
      const firstHalf = currentText.slice(0, cursorPosition);
      const secondHalf = currentText.slice(cursorPosition);
      
      const newParagraphs = [...paragraphs];
      newParagraphs.splice(index, 1, firstHalf, secondHalf);
      onChange(newParagraphs);
    } else if (e.key === 'Backspace' && index > 0) {
      const cursorPosition = (e.target as HTMLTextAreaElement).selectionStart;
      
      if (cursorPosition === 0) {
        e.preventDefault();
        const newParagraphs = [...paragraphs];
        const mergedText = newParagraphs[index - 1] + newParagraphs[index];
        newParagraphs[index - 1] = mergedText;
        newParagraphs.splice(index, 1);
        onChange(newParagraphs);
      }
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    // 모바일 환경 체크
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // 모바일에서는 텍스트 변경 허용
    if (isMobile) {
      const newParagraphs = [...paragraphs];
      newParagraphs[index] = e.target.value;
      onChange(newParagraphs);
    } else {
      // 데스크탑에서는 텍스트 변경 방지
      e.preventDefault();
    }
  };
  
  // Auto height adjustment function
  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };
  
  useEffect(() => {
    textAreaRefs.current.forEach((textarea) => {
      if (textarea) adjustHeight(textarea);
    });
  }, [paragraphs]);
  
  return (
    <div className="space-y-4">
      {paragraphs.map((text, index) => (
        <div key={index} className="relative group">
          <div className="relative flex items-start gap-2">
            <div className="pt-4">
              <HiArrowCircleRight className="text-primary text-xl" />
            </div>
            <textarea
              ref={(el) => {
                textAreaRefs.current[index] = el;
              }}
              value={text}
              onChange={(e) => handleTextChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-full p-2 resize-none focus:outline-none"
              placeholder="텍스트를 입력하세요..."
              // 모바일 키보드 최적화 속성들
              autoCapitalize="sentences"
              autoCorrect="on"
              spellCheck={true}
              style={{
                overflow: "hidden",
                minHeight: "80px",
                height: "auto",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            />
          </div>
          {index < paragraphs.length - 1 && <div className="w-full h-[2px] bg-gray-default my-1" />}
        </div>
      ))}
    </div>
  );
}