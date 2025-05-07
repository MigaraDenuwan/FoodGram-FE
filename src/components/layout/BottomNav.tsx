import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, User, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const BottomNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!user) return null;

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around py-2">
        <Link
          to="/"
          className={`flex flex-col items-center p-2 ${
            isActive('/') ? 'text-accent-500' : 'text-gray-500'
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/search"
          className={`flex flex-col items-center p-2 ${
            isActive('/search') ? 'text-accent-500' : 'text-gray-500'
          }`}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        <Link
          to="/recipe/create"
          className={`flex flex-col items-center p-2 ${
            isActive('/recipe/create') ? 'text-accent-500' : 'text-gray-500'
          }`}
        >
          <PlusSquare className="h-6 w-6" />
          <span className="text-xs mt-1">Create</span>
        </Link>
        <Link
          to={`/profile/${user.id}`}
          className={`flex flex-col items-center p-2 ${
            location.pathname.includes('/profile') ? 'text-accent-500' : 'text-gray-500'
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;