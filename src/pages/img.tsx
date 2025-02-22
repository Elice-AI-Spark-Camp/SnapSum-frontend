// pages/img.tsx
import { useRouteManager } from '@/hooks/useRouteManager';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import ChatMessage from "@/components/common/ChatMessage";
import NavigationButton from "@/components/common/NavigationButton";
import CustomHead from "@/components/common/CustomHead";

export default function Img() {
  const { routeState, navigateTo, goBack, isLoading } = useRouteManager();
  const images = Array(9).fill('생성된 이미지');

  if (isLoading || !routeState) {
    return null;
  }

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - 이미지 선택" />

      <div className="sticky top-0 bg-white z-50">
        <StepProgressBar
          currentStep={routeState.currentStep}
          platform={routeState.platform}
          paragraphCount={routeState.paragraphCount}
        />
      </div>

      <div className="relative max-w-[600px] mx-auto px-2">
        <div className="mt-8 mb-32">
          <div className="mb-6 w-fit">
            <ChatMessage
              message={`당신이 남긴 글로 ${routeState.paragraphCount}개의 이미지를 만들어 보았어요.\n필요없는 이미지를 지우거나 리텍스트를 통해 새로운 이미지를 찾아볼 수 있어요.`}
              showNavigationButtons
              onPrevClick={goBack}
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{routeState.platform}</span>
              <span>{images.length}개의 이미지</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className="aspect-[3/4] bg-gray-200 flex items-center justify-center text-sm text-gray-500"
                >
                  생성된 이미지
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-3 bg-gray-200 text-gray-600 rounded">
            스크롤
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white py-6">
        <div className="max-w-[600px] mx-auto px-6 flex justify-between">
          <NavigationButton
            direction="prev"
            onClick={goBack}
            textType="long"
          />
          <NavigationButton
            direction="next"
            onClick={() => navigateTo('video')}
            textType="long"
          />
        </div>
      </div>
    </Layout>
  );
}
