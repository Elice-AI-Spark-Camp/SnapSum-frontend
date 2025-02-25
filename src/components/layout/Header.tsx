// components/layout/Header.tsx
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import { IoInformationCircleOutline } from "react-icons/io5";
import { useRouteManager, ROUTE_STEPS } from '@/hooks/useRouteManager';

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
    
    // 로그 출력 후 goBack 실행
    goBack();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="max-w-[600px] mx-auto flex items-center justify-between px-4 py-3 relative">
        <button onClick={handleBackClick} className="cursor-pointer">
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
        
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-5">
          <Image
            src="/assets/icons/header.png"
            alt="Snapsum Logo"
            width={100}
            height={100}
            priority
          />
        </div>
        
        {showInfo && <IoInformationCircleOutline className="w-6 h-6 text-primary" />}
      </div>
    </header>
  );
}