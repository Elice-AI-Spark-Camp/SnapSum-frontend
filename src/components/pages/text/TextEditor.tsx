/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { HiArrowCircleRight } from "react-icons/hi";
import { useToastStore } from '@/store/useToastStore'; // 토스트 스토어 가져오기

interface TextEditorProps {
  paragraphs: string[];
  onChange: (newParagraphs: string[]) => void;
}

export function TextEditor({ paragraphs, onChange }: TextEditorProps) {
  const textAreaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const { showToast } = useToastStore(); // 토스트 메시지 함수 가져오기

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    setIsMobile(checkMobile());
  }, []);

  // TextEditor 컴포넌트 내의 handleKeyDown 함수 수정
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    // 오직 Enter와 Backspace만 특별 처리, 나머지는 모두 막음 (방향키, 복사/붙여넣기 제외)
    if (e.key !== 'Enter' && e.key !== 'Backspace' &&
      e.key !== 'ArrowUp' && e.key !== 'ArrowDown' &&
      e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' &&
      !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      return;
    }

    // Enter 키 처리 부분 수정
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      const textarea = e.target as HTMLTextAreaElement;
      const cursorPosition = textarea.selectionStart || 0;
      const currentText = paragraphs[index];

      // 빈 문단인 경우 분할 방지
      if (currentText.trim() === '') {
        showToast("빈 문단은 생성할 수 없습니다.");
        return;
      }

      // 커서 위치가 문단의 시작이나 끝인 경우 분할 방지
      if (cursorPosition === 0 || cursorPosition === currentText.length) {
        showToast("문단의 중간 부분에서만 분리할 수 있습니다.");
        return;
      }
      // 줄바꿈 기준으로 나누기 위해 수정
      const firstHalf = currentText.slice(0, cursorPosition).trimEnd();
      const secondHalf = currentText.slice(cursorPosition).trimStart();

      // 분할 후 어느 한쪽이 비어있다면 분할 방지
      if (firstHalf.trim() === '' || secondHalf.trim() === '') {
        showToast("분리된 문단은 내용이 있어야 합니다.");
        return;
      }

      const newParagraphs = [...paragraphs];
      newParagraphs.splice(index, 1, firstHalf, secondHalf);
      onChange(newParagraphs);

      // 다음 문단으로 포커스 이동
      setTimeout(() => {
        if (textAreaRefs.current[index + 1]) {
          textAreaRefs.current[index + 1]?.focus();
        }
      }, 10);
    }
    // Backspace 키 처리 부분 수정
    else if (e.key === 'Backspace') {
      const textarea = e.target as HTMLTextAreaElement;
      const cursorPosition = textarea.selectionStart || 0;

      // 문단 시작점에서만 병합 허용
      if (cursorPosition === 0) {
        if (index > 0) {
          e.preventDefault();

          const prevText = paragraphs[index - 1].trimEnd(); // 앞 문단의 끝부분 공백 제거
          const currentText = paragraphs[index]; // 현재 문단

          const newParagraphs = [...paragraphs];
          newParagraphs[index - 1] = prevText + currentText; // 공백 없이 문단 합치기
          newParagraphs.splice(index, 1);
          onChange(newParagraphs);

          // 이전 문단으로 포커스 이동, 커서는 병합 지점 (공백 제거 후)
          setTimeout(() => {
            if (textAreaRefs.current[index - 1]) {
              const textarea = textAreaRefs.current[index - 1];
              textarea?.focus();
              textarea?.setSelectionRange(prevText.length, prevText.length);
            }
          }, 10);
        } else {
          // 첫 번째 문단의 첫 글자에서 백스페이스를 시도한 경우
          e.preventDefault();
          showToast("첫 번째 문단은 더 이상 합칠 수 없습니다.");
        }
      }
      // 문단 내 삭제는 모두 막음 (방향키 등으로 이동 후 삭제 방지)
      else if (!isMobile) {
        // 문단을 합치려 할 때 안내 메시지 표시
        if (cursorPosition !== 0) {
          showToast("문단을 합치실 경우는 문단 젤 첫문자에서 시도해주세요");
        }
        e.preventDefault();
      }
    }
  };

  // 텍스트 변경 시도 막음 (모바일은 키보드 표시를 위해 일단 허용하되 실제 변경은 적용 안함)
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return;
  };

  // 텍스트 영역 높이 자동 조정
  const adjustHeight = (element: HTMLTextAreaElement) => {
    if (!element) return;
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
                if (el) adjustHeight(el);
              }}
              value={text}
              onChange={(e) => handleTextChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-full p-2 resize-none focus:outline-none"
              placeholder="텍스트를 입력하세요..."
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

      {/* 도움말 안내 */}
      <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-100 rounded-md">
        <p className="mb-1">• Enter로 문단을 나눌 때는 문단 중간에서만 가능합니다.</p>
        <p className="mb-1">• 백스페이스로 문단을 합칠 때는 문단 첫 글자에서만 가능합니다.</p>
        <p>• 빈 문단은 생성되지 않습니다.</p>
      </div>
    </div>
  );
}
