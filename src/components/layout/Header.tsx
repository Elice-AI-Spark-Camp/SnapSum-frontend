import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, MoreVertical } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 ">
      <div className="max-w-[768px] mx-auto flex items-center justify-between px-4 py-3 relative">
        <Link href="/" className="cursor-pointer">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </Link>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image
            src="/assets/icons/logo.svg"
            alt="Snapsum Logo"
            width={100}
            height={100}
            priority
          />
        </div>
        
        <MoreVertical className="w-6 h-6 text-gray-700" />
      </div>
    </header>
  );
}