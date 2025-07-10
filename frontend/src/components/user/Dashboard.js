import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UpdatePassword from './UpdatePassword';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-xl text-gray-600">
              Discover and rate amazing stores in your area
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '🏠' },
                { id: 'activity', name: 'Recent Activity', icon: '📋' },
                { id: 'settings', name: 'Account Settings', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                <div className="dashboard-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <div className="text-3xl mb-4">🏪</div>
                  <h3 className="text-xl font-semibold mb-2">Browse Stores</h3>
                  <p className="text-blue-100 mb-4">
                    Explore local businesses and discover new favorites
                  </p>
                  <Link 
                    to="/stores"
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
                  >
                    View Stores
                  </Link>
                </div>

                {/* <div className="dashboard-card bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <div className="text-3xl mb-4">⭐</div>
                  <h3 className="text-xl font-semibold mb-2">My Reviews</h3>
                  <p className="text-green-100 mb-4">
                    View and manage your store reviews and ratings
                  </p>
                  <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    My Reviews
                  </button>
                </div> */}

                {/* <div className="dashboard-card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <div className="text-3xl mb-4">❤️</div>
                  <h3 className="text-xl font-semibold mb-2">Favorites</h3>
                  <p className="text-purple-100 mb-4">
                    Access your saved and favorite stores quickly
                  </p>
                  <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    View Favorites
                  </button>
                </div> */}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                  <div className="text-gray-600">Reviews Written</div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                  <div className="text-gray-600">Stores Visited</div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                  <div className="text-gray-600">Favorite Stores</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">⭐</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-900 font-medium">Welcome to StoreRater!</p>
                    <p className="text-gray-600 text-sm">Start exploring stores and leaving reviews to see your activity here.</p>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                  <p className="text-gray-600 mb-4">You haven't reviewed any stores yet.</p>
                  <Link 
                    to="/stores"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                  >
                    Browse Stores
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <p className="text-gray-900">{user?.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="text-gray-900">{user?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <p className="text-gray-900 capitalize">{user?.role?.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Security</h3>
                    <UpdatePassword />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
