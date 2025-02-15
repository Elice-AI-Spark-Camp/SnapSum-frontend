import { IoVideocam } from "react-icons/io5";

interface VideoButtonProps {
  onClick: () => void;
}

export default function VideoButton({ onClick }: VideoButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center justify-center gap-2 
        w-[185px] h-[40px] 
        bg-gray-default hover:bg-secondary 
        rounded-[5px]
        transition-colors
      "
    >
      <IoVideocam size={25} className="text-primary" />
      <span className="text-[0.938rem] font-bold text-primary">
        영상 제작하기
      </span>
    </button>
  );
}