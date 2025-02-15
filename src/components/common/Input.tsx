interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  isError?: boolean;
  className?: string;
  helperText?: string | React.ReactNode;
}

export default function Input({
  value,
  onChange,
  onFocus,
  onBlur,
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
          ${isError ? 'border-error' : 'border-gray-default focus:border-gray-400'} 
          outline-none text-white placeholder:text-white
          focus:bg-gray-default [&:focus]:text-white ${className || ''}`}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {helperText && (
        <p className={`mt-2 text-sm text-center ${isError ? 'text-error' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}