import { Outlet, useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useStore } from '../store/useStore';
import { LogOut, Book } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">BookStore</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              <p className="text-sm font-medium">{user?.username}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-md mx-auto px-4 py-6">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
};

export default Layout;
