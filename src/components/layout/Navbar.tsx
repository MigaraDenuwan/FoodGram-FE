import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, PlusSquare, User, Search, LogOut, Utensils } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile } from '../../services/profileService';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleProfileClick = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await getProfile(user.id, user.token);
      navigate(`/profile/${user.id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        navigate('/profile/edit');
      } else {
        console.error('Error fetching profile:', error);
        navigate('/profile/edit');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Here we make sure to only submit a search if the query is not empty
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Utensils className="h-8 w-8 text-accent-500" />
              <span className="font-serif text-2xl font-semibold text-accent-800">
                FoodGram
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </form>
            <Link
              to="/"
              className="text-gray-700 hover:text-accent-500 p-2 rounded-md"
            >
              <Home className="h-6 w-6" />
            </Link>
            <Link
              to="/recipe/create"
              className="text-gray-700 hover:text-accent-500 p-2 rounded-md"
            >
              <PlusSquare className="h-6 w-6" />
            </Link>
            {user && (
              <button
                onClick={handleProfileClick}
                className="text-gray-700 hover:text-accent-500 p-2 rounded-md"
              >
                <User className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-accent-500 p-2 rounded-md"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
