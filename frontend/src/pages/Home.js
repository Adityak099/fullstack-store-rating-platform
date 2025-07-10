import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 via-purple-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">StoreRater</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-100 leading-relaxed">
              Discover, rate, and review local stores in your community
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Get Started
                </Link>
                <Link 
                  to="/login" 
                  className="bg-transparent border-2 border-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link 
                  to={user.role === 'admin' ? '/admin' : 
                      user.role === 'store_owner' ? '/store-owner' : '/dashboard'} 
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose StoreRater?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our community and discover the best local businesses in your area
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="text-4xl mb-6 text-center">🏪</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Discover Stores</h3>
              <p className="text-gray-600 leading-relaxed">
                Find local businesses and stores in your area with detailed information and reviews.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="text-4xl mb-6 text-center">⭐</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Rate & Review</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your experience and help others make informed decisions about local stores.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="text-4xl mb-6 text-center">👥</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">
                Join a community of local shoppers sharing authentic reviews and recommendations.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="text-4xl mb-6 text-center">📊</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Store Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Store owners can manage their profiles and respond to customer feedback.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who trust StoreRater for their local business discovery
          </p>
          {!user && (
            <Link 
              to="/register" 
              className="bg-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Sign Up Today
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
