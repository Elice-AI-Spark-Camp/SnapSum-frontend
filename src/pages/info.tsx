import Head from "next/head";
import Layout from "@/components/layout/Layout";
import { useState } from 'react';

export default function Info() {
  const [inputLink, setInputLink] = useState('');
  const [isError, setIsError] = useState(false);

  const handleLinkChange = (e) => {
    const link = e.target.value;
    setInputLink(link);
    
    // Simple validation for Naver Blog and Tistory links
    const isValidLink = link.includes('blog.naver.com') || link.includes('tistory.com');
    setIsError(!isValidLink && link.length > 0);
  };

  const handleInputFocus = () => {
    if (isError) {
      setIsError(false);
    }
  };

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

        <div className="w-full">
          <input
            type="text"
            placeholder="링크를 입력해주세요"
            className={`w-full px-4 py-3 rounded-[10px] border text-white  bg-primary ${
              isError ? 'border-error text-error' : 'border-gray-default  focus:bg-gray-light'
            } outline-none`}
            value={inputLink}
            onChange={handleLinkChange}
            onFocus={handleInputFocus}
          />
          <p className="mt-2 text-sm text-center text-gray-500">
            현재 SNAPSUM은 네이버 블로그, 티스토리 링크만 이용 가능합니다.
          </p>
        </div>

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