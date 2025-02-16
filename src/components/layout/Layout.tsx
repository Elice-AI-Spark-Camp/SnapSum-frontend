// components/layout/Layout.tsx
import Toast from '../common/Toast';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  showInfo?: boolean;
}

export default function Layout({ children, showInfo = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header showInfo={showInfo} />
      <Toast />
      <div className="pt-[96px] bg-white "> {/* Header height */}
        {children}
      </div>
    </div>
  );
}