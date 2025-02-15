import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { HiPlay } from 'react-icons/hi';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useToastStore } from '@/store/useToastStore';

export default function Info() {
  const [inputLink, setInputLink] = useState('');
  const [isError, setIsError] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const { showToast } = useToastStore();
  const router = useRouter(); 

  const validateLink = (link: string) => {
    const isValidLink = link.includes('blog.naver.com') || link.includes('tistory.com');
    if (!isValidLink) {
      setIsError(true);
      showToast("유효한 링크를 입력해주세요.");
    } else {
      setIsError(false);
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

  const handleSubmit = () => {
    // 링크가 없거나 에러인 경우
    if (isError || !inputLink) {
      showToast("유효하지 않은 링크입니다. 다시 입력해주세요.");
      return;
    }

    // 플랫폼이 선택되지 않은 경우
    if (!selectedPlatform) {
      showToast("플랫폼을 선택해주세요.");
      return;
    }

    // 모든 유효성 검사를 통과한 경우
    const isValidLink = inputLink.includes('blog.naver.com') || inputLink.includes('tistory.com');
    if (isValidLink) {
      router.push({
        pathname: '/text',
        query: { 
          link: inputLink,
          platform: selectedPlatform 
        }
      });
    }
  };

  const helperTextWithBold = (
    <span className="text-xs">
      현재 SNAPSUM은 <strong>네이버 블로그</strong>, <strong>티스토리</strong> 링크만 이용 가능합니다.
    </span>
  );

  return (
    <Layout>
      <Head>
        <title>SNAPSUM</title>
      </Head>
      <div className="w-[335px] mx-auto flex flex-col items-center gap-8">
        <h1 className="text-lg font-bold text-center">
          쉽고 빠르게 숏폼 영상 크리에이터가 되세요.
          <br />
          SNAPSUM에 불여넣기만 하면 시작입니다.
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
          <Button
            icon={<Image src="/assets/icons/YouTube.png" width={30} height={20} alt="Youtube" />}
            isSelected={selectedPlatform === 'youtube'}
            onClick={() => setSelectedPlatform('youtube')}
          >
            youtube
          </Button>
          <Button
            icon={<Image src="/assets/icons/TikTok.png" width={20} height={20} alt="TikTok" />}
            isSelected={selectedPlatform === 'tiktok'}
            onClick={() => setSelectedPlatform('tiktok')}
          >
            tiktok
          </Button>
          <Button
            icon={<Image src="/assets/icons/Instagram.png" width={20} height={20} alt="Instagram" />}
            isSelected={selectedPlatform === 'instagram'}
            onClick={() => setSelectedPlatform('instagram')}
          >
            instagram
          </Button>
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
    </Layout>
  );
}
