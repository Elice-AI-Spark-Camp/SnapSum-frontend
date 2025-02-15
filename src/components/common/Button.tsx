import { ReactNode } from 'react';

interface ButtonProps {
  icon?: ReactNode;
  children: ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  icon,
  children,
  isSelected = false,
  onClick,
  className = '',
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-[100px] h-[50px]
        rounded-[10px]
        font-bold text-[0.625rem]
        flex flex-col items-center justify-center
        transition-colors duration-200
        ${isSelected 
          ? 'bg-primary text-white' 
          : 'bg-gray-light text-black'
        }
        ${className}
      `}
    >
      {icon && <div className="text-lg">{icon}</div>}
      {children}
    </button>
  );
}