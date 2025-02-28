import { useState, useEffect } from 'react'; 
import { HiPlay, HiPause } from 'react-icons/hi';

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
  
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!previewUrl) return;
    
    if (isPlaying && audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      if (typeof document !== 'undefined') {
        document.querySelectorAll('audio').forEach(a => {
          a.pause();
          a.currentTime = 0;
        });
      }
      
      const newAudio = new Audio(previewUrl);
      newAudio.onended = () => setIsPlaying(false);
      newAudio.play().catch(err => console.error('오디오 재생 실패:', err));
      setAudio(newAudio);
      setIsPlaying(true);
    }
  };
  
  return (
    <div
      onClick={onClick}
      className={`
        group
        grid grid-cols-2 items-center gap-2 p-4 w-[170px] md:w-[200px] h-[100px]
        rounded-xl border border-gray-default cursor-pointer
        transition-colors duration-200
        ${isSelected
          ? 'bg-secondary border-transparent'
          : 'bg-white hover:bg-secondary hover:border-transparent'}
      `}
    >
      <div className="flex flex-col items-center">
        <span className="text-[0.938rem] font-bold text-primary">{label}</span>
        <div
          onClick={handlePlayClick}
          className="cursor-pointer"
        >
          {isPlaying ? (
            <HiPause
              size={27}
              className={`transition-colors duration-200 
                ${isSelected 
                  ? 'text-primary' 
                  : 'text-secondary group-hover:text-primary'}`}
            />
          ) : (
            <HiPlay
              size={27}
              className={`transition-colors duration-200 
                ${isSelected 
                  ? 'text-primary' 
                  : 'text-secondary group-hover:text-primary'}`}
            />
          )}
        </div>
      </div>
      <span 
        className="text-[0.6rem] break-words tracking-wide font-medium whitespace-pre-line"
      >
        {sublabel}
      </span>
    </div>
  );
}