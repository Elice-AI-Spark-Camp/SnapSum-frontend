import { useRouter } from 'next/router';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import ChatMessage from "@/components/common/ChatMessage";
import NavigationButton from "@/components/common/NavigationButton";
import CustomHead from "@/components/common/CustomHead";

export default function Text() {
  const router = useRouter();
  const { platform } = router.query;

  // platform이 string임을 확인
  const platformName = typeof platform === 'string' ? platform : '';

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - 영상 제작" />

      {/* Step Progress Bar */}
      <StepProgressBar
        currentStep={1}
        platform={platformName}
      />

      <div className="w-[600px] h-auto mx-auto mt-24">
        <div className="flex flex-col gap-8">
          <div className="mt-8">
            {/* Enter키 안내 메시지 */}
            <div className="bg-gray-light rounded-lg p-4 mb-6 flex items-center gap-2">
              <span className="text-sm">
                Enter키를 누르면 문단이 분리됩니다.
                <br />
                Backspace를 누르면 문단이 하나로 합쳐집니다.
              </span>
            </div>

            {/* 채팅 메시지들 */}
            <div className="space-y-4">
              <ChatMessage
                message="안녕하세요, 저는 당신의 소중한 영상 제작을 AI로 도울 SNAPSUM 입니다. 블로그는 링크에 있는 글을 자동정리 부탁드려요."
                showNavigationButtons
                onPrevClick={() => console.log('prev')}
              />

              <ChatMessage
                message="샘플 텍스트입니다. SNAPSUM은 AI를 활용한 숏폼 영상 제작 서비스로 누구나 쉽게 영상 크리에이터로의 전환을 돕습니다."
              />
            </div>
          </div>

          {/* 하단 네비게이션 */}
          <div className="fixed bottom-8 left-0 right-0">
            <div className="max-w-[600px] mx-auto px-6 flex justify-between">
              <NavigationButton
                direction="prev"
                onClick={() => console.log('prev')}
                textType="long"
              />
              <NavigationButton
                direction="next"
                onClick={() => console.log('next')}
                textType="long"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}