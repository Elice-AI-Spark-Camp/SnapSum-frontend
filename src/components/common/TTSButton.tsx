import { HiPlay, HiPause } from "react-icons/hi";
import { useState, useEffect } from "react";

interface TTSButtonProps {
  onClick: () => void;
  isSelected?: boolean;
  label: string;
  sublabel: string;
  previewUrl?: string;
}

export default function TTSButton({ 
  onClick, 
  isSelected = false, 
  label, 
  sublabel,
  previewUrl
}: TTSButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  // 컴포넌트 언마운트 시 오디오 정리
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 버튼 클릭 이벤트가 상위로 전파되지 않도록
    
    if (!previewUrl) return;
    
    if (isPlaying && audio) {
      // 이미 재생 중이면 정지
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      // 모든 다른 오디오 요소 중지 (전역 오디오 관리가 필요하면 상위 컴포넌트로 로직 이동 필요)
      document.querySelectorAll('audio').forEach(a => {
        a.pause();
        a.currentTime = 0;
      });
      
      // 새 오디오 생성 및 재생
      const newAudio = new Audio(previewUrl);
      newAudio.onended = () => setIsPlaying(false);
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        grid grid-cols-2 items-center gap-2 p-4 w-[170px] md:w-[200px] h-[100px]
        rounded-xl border border-gray-default
        transition-colors duration-200
        ${isSelected 
           ? 'bg-secondary border-transparent'
           : 'bg-white hover:bg-secondary'}
      `}
    >
      <div className="flex flex-col items-center">
        <span className="text-[0.938rem] font-bold text-primary">{label}</span>
        <button 
          onClick={handlePlayClick}
          className="focus:outline-none"
        >
          {isPlaying ? (
            <HiPause
              size={27}
              className={`transition-colors duration-200 ${isSelected ? 'text-primary' : 'text-secondary hover:text-primary'}`}
            />
          ) : (
            <HiPlay
              size={27}
              className={`transition-colors duration-200 ${isSelected ? 'text-primary' : 'text-secondary hover:text-primary'}`}
            />
          )}
        </button>
      </div>
      <span className="text-[0.625rem] break-words tracking-wide font-medium">{sublabel}</span>
    </button>
  );
}