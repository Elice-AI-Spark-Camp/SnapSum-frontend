// components/common/LoadingSpinner.tsx
export default function LoadingSpinner({ message = "로딩중..." }: { message?: string }) {
  return (
    <div className="min-h-[calc(90vh-96px)] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div 
            className="absolute inset-0 border-4 border-primary rounded-full animate-spin"
            style={{ 
              borderTopColor: 'transparent',
              animationDuration: '1s'
            }}
          ></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold mb-2">{message}</p>
          <p className="text-sm text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    </div>
  );
}