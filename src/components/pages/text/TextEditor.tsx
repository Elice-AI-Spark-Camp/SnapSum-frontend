import { HiArrowCircleRight } from "react-icons/hi";

interface TextEditorProps {
  paragraphs: string[];
  onChange: (newParagraphs: string[]) => void;
}

export function TextEditor({ paragraphs, onChange }: TextEditorProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      return;
    }
    
    if (e.key !== 'Enter' && e.key !== 'Backspace') {
      if (!isMobile) {
        e.preventDefault();
      }
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
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = e.target.value;
    onChange(newParagraphs);
  };
  
  // Auto height adjustment function
  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };
  
  // Handle input event to adjust height
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    adjustHeight(e.currentTarget);
  };
  
  return (
    <div className="space-y-4">
      {paragraphs.map((text, index) => (
        <div key={index} className="relative group">
          <div className="relative flex items-start gap-2">
            <div className="pt-4">
              <HiArrowCircleRight className="text-primary text-xl" />
            </div>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onInput={handleInput}
              className="w-full p-2 resize-none focus:outline-none"
              placeholder="텍스트를 입력하세요..."
              style={{
                overflow: 'visible', // 스크롤바 없애고 전체 텍스트 보이기
                minHeight: '80px',
                height: 'auto',
                wordBreak: 'break-word', // 단어 중간에서 줄바꿈
                overflowWrap: 'break-word', // 긴 단어도 줄바꿈
                whiteSpace: 'pre-wrap' // 공백과 줄바꿈 보존
              }}
            />
          </div>
          {index < paragraphs.length - 1 && (
            <div className="w-full h-[2px] bg-gray-default my-1" />
          )}
        </div>
      ))}
    </div>
  );
}