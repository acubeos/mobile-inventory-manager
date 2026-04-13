import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingCart, History, Users } from 'lucide-react';
import { clsx } from 'clsx';

export const BottomNav = () => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dash' },
    { to: '/inventory', icon: BookOpen, label: 'Books' },
    { to: '/sales', icon: ShoppingCart, label: 'Sale' },
    { to: '/records', icon: History, label: 'Records' },
    { to: '/customers', icon: Users, label: 'Clients' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50 flex justify-around items-center h-16 max-w-[640px] mx-auto">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center justify-center flex-1 min-w-0 transition-colors',
              isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
            )
          }
        >
          <Icon size={24} />
          <span className="text-xs mt-1 truncate">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
