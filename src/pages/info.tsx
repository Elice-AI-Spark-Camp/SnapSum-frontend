import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { HiPlay } from 'react-icons/hi';
import Image from 'next/image';

export default function Info() {
  const [inputLink, setInputLink] = useState('');
  const [isError, setIsError] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const validateLink = (link: string) => {
    const isValidLink = link.includes('blog.naver.com') || link.includes('tistory.com');
    setIsError(!isValidLink && link.length > 0);
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
    <span className="text-[0.625rem]">
      현재 SNAPSUM은 <strong>네이버 블로그</strong>, <strong>티스토리</strong> 링크만 이용 가능합니다.
    </span>
  );

  return (
    <Layout>
      <Head>
        <title>Snapsum</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>

      <div className="w-[335px] mx-auto flex flex-col items-center gap-8">
        <h1 className="text-base font-bold text-center">
          쉽고 빠르게 숏폼 영상 크리에이터가 되세요.
          <br />
          SNAPSUM에 불여넣기만 하면 시작입니다.
        </h1>

        <Input
          value={inputLink}
          onChange={handleLinkChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          isError={isError}
          placeholder="링크를 입력해주세요"
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
        >
          <HiPlay size={24} />
          시작하기
        </button>
      </div>
    </Layout>
  );
}