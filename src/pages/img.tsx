import { useRouter } from 'next/router';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import ChatMessage from "@/components/common/ChatMessage";
import NavigationButton from "@/components/common/NavigationButton";
import CustomHead from "@/components/common/CustomHead";

export default function Img() {
  const router = useRouter();
  const { platform, paragraphCount, tts } = router.query;
  const platformName = typeof platform === 'string' ? platform : '';
  const count = typeof paragraphCount === 'string' ? parseInt(paragraphCount, 10) : 0;

  // 더미 이미지 데이터 (9개)
  const images = Array(9).fill('생성된 이미지');

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - 이미지 선택" />

      {/* Header와 Progress Bar */}
      <div className="sticky top-0 bg-white z-50">
        <StepProgressBar
          currentStep={3}
          platform={platformName}
          paragraphCount={count}
        />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="relative max-w-[600px] mx-auto px-2">
        <div className="mt-8 mb-32">
          {/* 챗 메시지 */}
          <div className="mb-6 w-fit">
            <ChatMessage
              message={`당신이 남긴 글로 ${count}개의 이미지를 만들어 보았어요.\n필요없는 이미지를 지우거나 리텍스트를 통해 새로운 이미지를 찾아볼 수 있어요.`}
              showNavigationButtons
              onPrevClick={() => router.back()}
            />
          </div>

          {/* 이미지 갤러리 */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>instagram</span>
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

          {/* 스크롤 버튼 */}
          <button className="w-full py-3 bg-gray-200 text-gray-600 rounded">
            스크롤
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white py-6">
        <div className="max-w-[600px] mx-auto px-6 flex justify-between">
          <NavigationButton
            direction="prev"
            onClick={() => router.back()}
            textType="long"
          />
          <NavigationButton
            direction="next"
            onClick={() => router.push({
              pathname: '/video',
              query: {
                platform: platformName,
                paragraphCount: count,
                tts: tts
              }
            })}
            textType="long"
          />
        </div>
      </div>
    </Layout>
  );
}