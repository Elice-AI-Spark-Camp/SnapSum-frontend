import Head from "next/head";
import Layout from "@/components/layout/Layout";

export default function Info() {
  return (
    <Layout>
      <Head>
        <title>Snapsum</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>

      <div className="max-w-[768px] mx-auto px-6 py-10 flex flex-col items-center gap-8">
        <h1 className="text-xl font-bold text-center">
          쉽고 빠르게 숏폼 영상 크리에이터가 되세요.
          <br />
          SNAPSUM에 불여넣기만 하면 시작입니다.
        </h1>

        <button className="w-full max-w-[600px] bg-gray-800 text-white py-3 rounded-lg font-medium">
          링크 불여넣기
        </button>

        <div className="text-sm text-gray-500 text-center">
          현재 SNAPSUM은 네이버 블로그, 티스토리 링크만 이용 가능합니다.
        </div>

        <div className="flex gap-4 w-full max-w-[600px]">
          <button className="flex-1 border border-gray-200 rounded-lg py-2 text-sm">
            youtube
          </button>
          <button className="flex-1 border border-gray-200 rounded-lg py-2 text-sm">
            tiktok
          </button>
          <button className="flex-1 border border-gray-200 rounded-lg py-2 text-sm">
            instagram
          </button>
        </div>
      </div>
    </Layout>
  );
}