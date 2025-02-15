import Head from "next/head";
import Layout from "@/components/layout/Layout";
import VideoButton from '@/components/common/VideoButton';
import { HiPlay } from 'react-icons/hi';

export default function Text() {
  return (
    <Layout>
      <Head>
        <title>SNAPSUM - 영상 제작</title>
      </Head>
      <div className="w-[335px] mx-auto flex flex-col items-center gap-8">
        <div className="flex gap-4">
          <VideoButton
            onClick={() => console.log('영상 제작하기')}
            icon={<HiPlay />}
            label="영상 제작하기"
          />
        </div>
      </div>
    </Layout>
  );
}