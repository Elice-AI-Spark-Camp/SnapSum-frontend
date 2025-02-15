import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-[600px] mx-auto min-h-[calc(100vh-96px)] flex items-center">
        <main className="w-full px-6">
          {children}
        </main>
      </div>
    </div>
  );
}