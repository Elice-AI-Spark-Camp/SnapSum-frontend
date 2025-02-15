import { useToastStore } from '@/store/useToastStore';
import { HiExclamation } from 'react-icons/hi';

export default function Toast() {
  const message = useToastStore((state) => state.message);

  // message가 null이면 아예 렌더링하지 않도록 수정
  if (!message) return null;

  return (
    <div
      className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 
        rounded-lg shadow-lg bg-[#FFFCF1] text-black
        z-50 flex items-center gap-2 text-[0.625rem]
        `}
    >
      <HiExclamation size={20} className="text-error" />
      {message}
    </div>
  );
}