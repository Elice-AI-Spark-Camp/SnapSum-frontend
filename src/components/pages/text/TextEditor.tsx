// components/pages/text/TextEditor.tsx
import { HiArrowCircleRight } from "react-icons/hi";

interface TextEditorProps {
  paragraphs: string[];
  onChange: (newParagraphs: string[]) => void;
}
//키로거
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

  return (
    <div className="space-y-4 overflow-hidden">
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
              className="w-full min-h-[80px] p-2 resize-none focus:outline-none"
              placeholder="텍스트를 입력하세요..."
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