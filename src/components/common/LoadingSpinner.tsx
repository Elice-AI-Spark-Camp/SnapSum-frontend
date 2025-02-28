import React, { useState, useEffect } from 'react';
import { RingLoader } from 'react-spinners';

const LoadingSpinner = ({ message = "로딩중...", totalTimeInSeconds = 60 }) => {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTimeInSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + (100 / totalTimeInSeconds);
        return newProgress > 100 ? 100 : newProgress;
      });

      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        return newTime < 0 ? 0 : newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalTimeInSeconds]);

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0" style={{ zIndex: 9999 }}>
      {/* 반투명 오버레이 */}
      <div className="absolute inset-0 bg-white bg-opacity-80" />

      {/* 중앙 정렬된 컨텐츠 */}
      <div className="min-h-screen flex flex-col items-center justify-center relative">
        <div className="flex flex-col items-center gap-8">
          {/* react-spinners의 RingLoader 사용 */}
          <RingLoader
            color="#4F4F4F"
            size={60}
            speedMultiplier={1}
          />

          {/* 텍스트 */}
          <div className="text-center">
            <p className="text-sm text-gray-600  font-bold mb-2">{message}</p>
            <p className="text-sm text-gray-600 mb-4">
              해당 작업은 최대 {Math.ceil(totalTimeInSeconds / 60)}분 이상 소요됩니다. 예상 남은 시간: {formatTimeLeft(timeLeft)}
            </p>

            {/* 프로그레스바 컨테이너 */}
            <div className="w-80 bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;