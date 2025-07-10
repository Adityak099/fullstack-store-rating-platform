import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-white hover:text-gray-100 transition-colors">
            🏪 StoreRater
          </Link>
          
          <nav className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/stores" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  Browse Stores
                </Link>
                
                <span className="hidden sm:block text-sm">
                  Welcome, <span className="font-medium">{user.name}!</span>
                </span>
                
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                
                {user.role === 'store_owner' && (
                  <Link 
                    to="/store-owner" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    My Store
                  </Link>
                )}
                
                {user.role === 'user' && (
                  <Link 
                    to="/dashboard" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout} 
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-primary-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
