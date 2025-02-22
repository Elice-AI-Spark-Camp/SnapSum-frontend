// pages/index.tsx
import Image from "next/image";
import { useRouter } from 'next/router';
import CustomHead from "@/components/common/CustomHead";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    // 로컬 스토리지 초기화
    localStorage.removeItem('routeState');
    // info 페이지로 이동
    router.push('/info');
  };

  return (
    <>
      <CustomHead
        title="SNAPSUM"
        withViewport={true}
      />

      <div className="max-w-[768px] mx-auto min-h-screen bg-white">
        <div
          className="flex items-center justify-center min-h-screen cursor-pointer"
          onClick={handleStart}
        >
          <Image
            src="/assets/icons/icon.png"
            alt="Logo"
            width={600}
            height={600}
            priority
            className="w-full max-w-[600px] h-auto px-4"
          />
        </div>
      </div>
    </>
  );
}
