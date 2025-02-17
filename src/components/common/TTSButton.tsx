import { HiPlay } from "react-icons/hi";

interface TTSButtonProps {
  onClick: () => void;
  isSelected?: boolean;
  label: string;
  sublabel: string;
}

export default function TTSButton({ onClick, isSelected = false, label, sublabel }: TTSButtonProps) {
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
        <HiPlay 
          size={27} 
          className={`transition-colors duration-200 ${isSelected ? 'text-primary' : 'text-secondary hover:text-primary'}`}
        />
      </div>
      <span className="text-[0.625rem] break-words tracking-wide font-medium">{sublabel}</span>
    </button>
  );
}
