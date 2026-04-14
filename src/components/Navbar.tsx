import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Heart, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/products', icon: Package, label: '产品' },
    { path: '/health', icon: Heart, label: '健康' },
    { path: '/profile', icon: User, label: '我的' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-blue-600' : ''}`} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;