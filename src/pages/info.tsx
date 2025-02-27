import { useEffect, useState } from 'react';
import { useRouteManager } from '@/hooks/useRouteManager';
import Layout from "@/components/layout/Layout";
import Input from '@/components/common/Input';
import PlatformButton from '@/components/common/PlatformButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { HiPlay } from 'react-icons/hi';
import Image from 'next/image';
import { useToastStore } from '@/store/useToastStore';
import CustomHead from "@/components/common/CustomHead";
import { useSummaryMutation } from '@/services/useSummaryMutation';

export default function Info() {
  const { navigateTo, updateState, clearState } = useRouteManager();
  const [inputLink, setInputLink] = useState('');
  const [isError, setIsError] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const { showToast } = useToastStore();
  const { createSummaryMutation } = useSummaryMutation();

  // 새 영상 시작시 이전 상태 초기화
  useEffect(() => {
    clearState();
  }, []);

  const validateLink = (link: string) => {
    const isValidLink = link.includes('blog.naver.com') || link.includes('tistory.com');
    if (!isValidLink) {
      setIsError(true);
      showToast("유효한 링크를 입력해주세요.");
    } else {
      setIsError(false);
    }
  };

  const handleSubmit = () => {
    if (isError || !inputLink) {
      showToast("유효하지 않은 링크입니다. 다시 입력해주세요.");
      return;
    }

    if (!selectedPlatform) {
      showToast("플랫폼을 선택해주세요.");
      return;
    }

    const isValidLink = inputLink.includes('blog.naver.com') || inputLink.includes('tistory.com');
    if (isValidLink) {
      updateState({ platform: selectedPlatform });
      createSummaryMutation.mutate({
        url: inputLink,
        platform: selectedPlatform
      }, {
        onSuccess: () => navigateTo('text')
      });
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setInputLink(link);
  };

  const handleInputFocus = () => {
    if (isError) {
      setIsError(false);
    }
  };

  const handleInputBlur = () => {
    validateLink(inputLink);
  };

  const helperTextWithBold = (
    <span className="text-xs">
      현재 SNAPSUM은 <strong>네이버 블로그</strong> 링크만 이용 가능합니다.
    </span>
  );

  return (
    <Layout>
      <CustomHead title="SNAPSUM - 링크 선택" />
      {createSummaryMutation.isPending && (
        <LoadingSpinner message="텍스트를 추출하고 요약합니다." />
      )}
      <div className="min-h-[calc(90vh-96px)] flex items-center justify-center">
        <div className="w-[335px] flex flex-col items-center gap-8">
          <h1 className="text-lg font-bold text-center">
            쉽고 빠르게 숏폼 영상 크리에이터가 되세요.
            <br />
            SNAPSUM에 붙여넣기만 하면 시작입니다.
          </h1>

          <Input
            value={inputLink}
            onChange={handleLinkChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="링크를 입력해주세요"
            isError={isError}
            helperText={helperTextWithBold}
          />

          <div className="flex gap-4 justify-center w-full">
            <PlatformButton
              icon={<Image src="/assets/icons/YouTube.png" width={30} height={20} alt="Youtube" />}
              isSelected={selectedPlatform === 'youtube'}
              onClick={() => setSelectedPlatform('youtube')}
            >
              youtube
            </PlatformButton>
            <PlatformButton
              icon={<Image src="/assets/icons/TikTok.png" width={20} height={20} alt="TikTok" />}
              isSelected={selectedPlatform === 'tiktok'}
              onClick={() => setSelectedPlatform('tiktok')}
            >
              tiktok
            </PlatformButton>
            <PlatformButton
              icon={<Image src="/assets/icons/Instagram.png" width={20} height={20} alt="Instagram" />}
              isSelected={selectedPlatform === 'instagram'}
              onClick={() => setSelectedPlatform('instagram')}
            >
              instagram
            </PlatformButton>
          </div>

          <button
            className="
              flex items-center gap-2 
              text-primary
              px-6 py-3 rounded-[10px]
              font-bold
            "
            onClick={handleSubmit}
          >
            <HiPlay size={24} />
            시작하기
          </button>
        </div>
      </div>
    </Layout>
  );
}