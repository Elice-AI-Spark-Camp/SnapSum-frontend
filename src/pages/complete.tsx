import { useRouter } from 'next/router';
import Layout from "@/components/layout/Layout";
import StepProgressBar from "@/components/common/StepProgressBar";
import CustomHead from "@/components/common/CustomHead";
import VideoButton from "@/components/common/VideoButton";

export default function Complete() {
  const router = useRouter();
  const { platform, paragraphCount } = router.query;
  const platformName = typeof platform === 'string' ? platform : '';
  const count = typeof paragraphCount === 'string' ? parseInt(paragraphCount, 10) : 0;

  const handleDownload = () => {
    // TODO: 다운로드 로직
    console.log('다운로드');
  };

  const handleNewVideo = () => {
    router.push('/info');
  };

  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - 영상 제작 완료" />
      
      <div className="sticky top-0 bg-white z-50">
        <StepProgressBar
          currentStep={5}
          platform={platformName}
          paragraphCount={count}
        />
      </div>

      <div className="relative max-w-[600px] mx-auto px-2">
        <div className="mt-8 mb-32">
          <div className="text-center mb-12">
            <h2 className="text-xl font-bold ">SNAPSUM과 함께</h2>
            <h2 className="text-xl font-bold mb-4">영상 제작 완료!</h2>
            <p className="text-gray-600 text-sm">
              이제 다운로드 버튼을 눌러 영상을 다운받으세요.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <VideoButton
              variant="download"
              onClick={handleDownload}
            />
            <VideoButton
              variant="new"
              onClick={handleNewVideo}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}