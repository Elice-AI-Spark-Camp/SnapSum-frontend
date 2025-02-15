import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { useState } from 'react';
import Input from '@/components/common/Input';

export default function Info() {
  const [inputLink, setInputLink] = useState('');
  const [isError, setIsError] = useState(false);

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
    <span>
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

      <div className="max-w-[335px] mx-auto px-6 py-10 flex flex-col items-center gap-8">
        <h1 className="text-xl font-bold text-center">
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

        <div className="flex gap-4 w-full">
          <button className="flex-1 border border-gray-default rounded-[10px] py-2 text-sm">
            youtube
          </button>
          <button className="flex-1 border border-gray-default rounded-[10px] py-2 text-sm">
            tiktok
          </button>
          <button className="flex-1 border border-gray-default rounded-[10px] py-2 text-sm">
            instagram
          </button>
        </div>
      </div>
    </Layout>
  );
}