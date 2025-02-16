import Image from "next/image";
import { useRouter } from 'next/router';
import CustomHead from "@/components/common/CustomHead";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <CustomHead
        title="SNAPSUM"
        withViewport={true}
      />

      <div className="max-w-[768px] mx-auto min-h-screen bg-white">
        <div
          className="flex items-center justify-center min-h-screen"
          onClick={() => router.push('/info')}
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