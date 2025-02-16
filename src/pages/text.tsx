import Layout from "@/components/layout/Layout";
import VideoButton from '@/components/common/VideoButton';
import TTSButton from "@/components/common/TTSButton";
import { useState } from "react";
import ProgressBar from "@/components/common/ProgressBar";
import ChatMessage from "@/components/common/ChatMessage";
import NavigationButton from "@/components/common/NavigationButton";
import CustomHead from "@/components/common/CustomHead";

export default function Text() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <Layout showInfo={false}>
      <CustomHead title="SNAPSUM - 텍스트 추출" />
      <div className="w-[600px] h-auto mx-auto flex flex-col items-center gap-8">
        {/* 프로그레스 바 섹션 */}
        <div className="w-[600px] left-0 right-0 bg-white z-10">
          <ProgressBar progress={67} variant="primary" />
          <div className="h-6" /> {/* 간격 */}
          <ProgressBar progress={20} variant="secondary" />
        </div>
        <div className="flex gap-4">
          <VideoButton
            variant="create"
            onClick={() => console.log('create video')}
          />
          <VideoButton
            variant="download"
            onClick={() => console.log('download video')}
          />
          <VideoButton
            variant="new"
            onClick={() => console.log('new video')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TTSButton
            onClick={() => setSelectedId('1')}
            isSelected={selectedId === '1'}
            label="여성 A"
            sublabel="목소리에 대한 간단한 설명"
          />
          <TTSButton
            onClick={() => setSelectedId('2')}
            isSelected={selectedId === '2'}
            label="여성 B"
            sublabel="목소리에 대한 간단한 설명"
          />
          <TTSButton
            onClick={() => setSelectedId('3')}
            isSelected={selectedId === '3'}
            label="남성 A"
            sublabel="목소리에 대한 간단한 설명"
          />
          <TTSButton
            onClick={() => setSelectedId('4')}
            isSelected={selectedId === '4'}
            label="남성 B"
            sublabel="목소리에 대한 간단한 설명"
          />
        </div>
        <div>
          {/* 단독 네비게이션 버튼 사용 */}
          <div className="flex justify-between">
            <NavigationButton
              direction="prev"
              onClick={() => console.log('prev')}
            />
            <NavigationButton
              direction="next"
              onClick={() => console.log('next')}
            />
          </div>

          {/* 채팅 메시지 사용 */}
          <ChatMessage
            message="안녕하세요, 저는 당신의 소중한 영상 제작을 AI로 도울 SNAPSUM 입니다. 블로그는 링크에 있는 글을 자동정리 부탁드려요."
            showNavigationButtons
            onPrevClick={() => console.log('prev')}
            onNextClick={() => console.log('next')}
          />
        </div>
      </div>
    </Layout>
  );
}
