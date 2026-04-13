import { type ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { useStore } from '../store/useStore';
import { LogOut, Book } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export const Layout = ({ children, title }: LayoutProps) => {
  const { user, logout } = useStore();

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center z-40 max-w-[640px] mx-auto w-full">
        <div className="flex items-center gap-2">
          <Book className="text-primary-600" size={24} />
          <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>
      <main className="flex-1 px-4 py-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
