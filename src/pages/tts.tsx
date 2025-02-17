import { useRouter } from 'next/router';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import ChatMessage from "@/components/common/ChatMessage";
import NavigationButton from "@/components/common/NavigationButton";
import CustomHead from "@/components/common/CustomHead";
import TTSButton from "@/components/common/TTSButton";
import { useState } from 'react';

export default function TTS() {  // 대문자로 변경
  const router = useRouter();
  const { platform, paragraphCount } = router.query;
  const platformName = typeof platform === 'string' ? platform : '';
  const count = typeof paragraphCount === 'string' ? parseInt(paragraphCount, 10) : 0;

  const [selectedTTS, setSelectedTTS] = useState<string>('');

  const ttsOptions = [
    { id: 'female_a', label: '여성 A', sublabel: '목소리에 대한\n간단한 설명' },
    { id: 'female_b', label: '여성 B', sublabel: '목소리에 대한\n간단한 설명' },
    { id: 'male_a', label: '남성 A', sublabel: '목소리에 대한\n간단한 설명' },
    { id: 'male_b', label: '남성 B', sublabel: '목소리에 대한\n간단한 설명' }
  ];

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - TTS 선택" />

      <div className="sticky top-0 bg-white z-50">
        <StepProgressBar
          currentStep={2}
          platform={platformName}
          paragraphCount={count}
        />
      </div>

      <div className="relative max-w-[600px] mx-auto px-2">
        <div className="mt-8 mb-32">
          <div className="mb-6 w-fit">
            <ChatMessage
              message="영상에서 재생할 목소리를 선택해주세요."
              showNavigationButtons
              onPrevClick={() => router.back()}
            />
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-2 max-w-[410px] gap-[10px]">
              {ttsOptions.map((tts) => (
                <TTSButton
                  key={tts.id}
                  onClick={() => setSelectedTTS(tts.id)}
                  isSelected={selectedTTS === tts.id}
                  label={tts.label}
                  sublabel={tts.sublabel}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white py-6">
        <div className="max-w-[600px] mx-auto px-6 flex justify-between">
          <NavigationButton
            direction="prev"
            onClick={() => router.back()}
            textType="long"
          />
          <NavigationButton
            direction="next"
            onClick={() => router.push(`/video?platform=${platformName}&paragraphCount=${count}`)}
            textType="long"
          />
        </div>
      </div>
    </Layout>
  );
}