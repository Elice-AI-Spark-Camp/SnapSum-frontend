// components/layout/Header.tsx
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import { IoInformationCircleOutline } from "react-icons/io5";

interface HeaderProps {
  showInfo?: boolean;
}

export default function Header({ showInfo = true }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0">
      <div className="max-w-[600px] mx-auto flex items-center justify-between px-4 py-3 relative">
        <button 
          onClick={() => router.back()} 
          className="cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
        
        <Link 
          href="/" 
          className="absolute left-1/2 transform -translate-x-1/2 mt-5 cursor-pointer"
        >
          <Image
            src="/assets/icons/header.png"
            alt="Snapsum Logo"
            width={100}
            height={100}
            priority
          />
        </Link>
        
        {showInfo && <IoInformationCircleOutline className="w-6 h-6 text-primary" />}
      </div>
    </header>
  );
}