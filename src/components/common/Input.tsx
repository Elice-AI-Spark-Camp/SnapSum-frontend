interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  placeholder?: string;
  isError?: boolean;
  className?: string;
  helperText?: string | React.ReactNode;
}

export default function Input({
  value,
  onChange,
  onFocus,
  placeholder,
  isError,
  className,
  helperText,
}: InputProps) {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-[10px] border bg-primary 
          ${isError ? 'border-error' : 'border-gray-default focus:bg-gray-default'} 
          outline-none text-white placeholder:text-gray-400 ${className || ''}`}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        style={{ color: 'white' }}  // 인라인 스타일로 흰색 강제 적용
      />
      {helperText && (
        <p className={`mt-2 text-sm text-center ${isError ? 'text-error' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}