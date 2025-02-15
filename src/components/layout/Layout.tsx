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
      <div className="max-w-[600px] mx-auto min-h-[calc(100vh-96px)] flex items-center">
        <main className="w-full px-6">
          {children}
        </main>
      </div>
    </div>
  );
}