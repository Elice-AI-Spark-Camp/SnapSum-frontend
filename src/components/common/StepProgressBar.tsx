import React from 'react';
import ProgressBar from './ProgressBar';

interface StepProgressBarProps {
  currentStep: number;
  platform?: string;
  paragraphCount?: number;
  imageCount?: number;
}

export default function StepProgressBar({ 
  currentStep, 
  platform = '', 
  paragraphCount = 0,
  imageCount = 0 
}: StepProgressBarProps) {
  const getSteps = () => [
    platform,
    `${paragraphCount}개의 문단`,
    `${imageCount}개의 이미지`,
    "영상 생성",
    "최종 확인"
  ];

  const steps = getSteps();
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="w-full fixed top-12 left-0 right-0 bg-white z-50 px-2 py-6">
      <div className="max-w-[600px] mx-auto relative">
        {/* Step labels */}
        <div className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-6">
          {steps.map((step, index) => {
            const isActive = index < currentStep;
            // 마지막 단계에서는 모든 레이블을 보여주고, 그 외에는 이전 단계까지만 보여줌
            const showLabel = currentStep === steps.length ? true : index < currentStep;
            
            return (
              <div key={index} className="w-1/5 flex justify-center">
                {showLabel && (
                  <span className={`text-sm mb-2 whitespace-nowrap text-center
                    ${isActive ? 'text-primary font-bold text-[1.063rem]' : 'text-gray-dark'}`}>
                    {step}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        <ProgressBar progress={progress} variant="primary" />
      </div>
    </div>
  );
}