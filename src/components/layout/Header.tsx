import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import { IoInformationCircleOutline } from "react-icons/io5";
import { useRouteManager } from '@/hooks/useRouteManager';

interface HeaderProps {
  showInfo?: boolean;
}

export default function Header({ showInfo = true }: HeaderProps) {
  const router = useRouter();
  const { goBack, routeState } = useRouteManager();

  const handleBackClick = () => {
    if (!routeState) return;

    const currentPath = router.pathname.split('/')[1];
    console.log('Current path:', currentPath, 'Current step:', routeState.currentStep);

    goBack();
  };

  const handleLogoClick = () => {
    router.push('/'); // 로고 클릭 시 홈('/')으로 이동
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="max-w-[600px] mx-auto flex items-center justify-between px-4 py-3 relative">
        {/* 뒤로 가기 버튼 */}
        <button onClick={handleBackClick} className="cursor-pointer">
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
        
        {/* 로고 클릭 시 홈으로 이동 */}
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-5 cursor-pointer" onClick={handleLogoClick}>
          <Image
            src="/assets/icons/header.png"
            alt="Snapsum Logo"
            width={100}
            height={100}
            priority
          />
        </div>
        
        {/* 정보 아이콘 */}
        {showInfo && <IoInformationCircleOutline className="w-6 h-6 text-primary" />}
      </div>
    </header>
  );
}
