import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingCart, Users, History } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BottomNav = () => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/inventory', icon: BookOpen, label: 'Inventory' },
    { to: '/sales', icon: ShoppingCart, label: 'Sales' },
    { to: '/customers', icon: Users, label: 'Customers' },
    { to: '/records', icon: History, label: 'Records' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 flex justify-around items-center z-50 h-16">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center w-full py-1 text-xs font-medium transition-colors",
              isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )
          }
        >
          <Icon className="w-6 h-6 mb-1" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
