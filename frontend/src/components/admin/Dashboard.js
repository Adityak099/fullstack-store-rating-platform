import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../api/admin';
import UsersList from './UsersList';
import StoresList from './StoresList';
import CreateUserModal from './CreateUserModal';
import CreateStoreModal from './CreateStoreModal';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
    usersByRole: {},
    recentUsers: [],
    recentStores: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateStoreModal, setShowCreateStoreModal] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      setStats(response.data.data);
      setError('');
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard stats. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserCreated = () => {
    fetchStats();
  };

  const handleStoreCreated = () => {
    fetchStats();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersList onCreateUser={() => setShowCreateUserModal(true)} />;
      case 'stores':
        return <StoresList onCreateStore={() => setShowCreateStoreModal(true)} />;
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => (
    <>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="dashboard-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-3xl mb-4">👥</div>
          <h3 className="text-2xl font-bold mb-2">{stats.totalUsers}</h3>
          <p className="text-blue-100">Total Users</p>
        </div>

        <div className="dashboard-card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-3xl mb-4">🏪</div>
          <h3 className="text-2xl font-bold mb-2">{stats.totalStores}</h3>
          <p className="text-green-100">Total Stores</p>
        </div>

      

        <div className="dashboard-card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-3xl mb-4">⭐</div>
          <h3 className="text-2xl font-bold mb-2">{stats.totalRatings}</h3>
          <p className="text-purple-100">Total Ratings</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button 
              onClick={() => setShowCreateUserModal(true)}
              className="w-full bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg font-medium hover:bg-blue-100 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <span>+ Create New User</span>
                <span className="text-blue-500">→</span>
              </div>
            </button>
            <button 
              onClick={() => setShowCreateStoreModal(true)}
              className="w-full bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg font-medium hover:bg-green-100 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <span>+ Create New Store</span>
                <span className="text-green-500">→</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className="w-full bg-orange-50 border border-orange-200 text-orange-700 px-6 py-4 rounded-lg font-medium hover:bg-orange-100 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <span>Manage All Users</span>
                <span className="text-orange-500">→</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('stores')}
              className="w-full bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg font-medium hover:bg-red-100 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <span>Manage All Stores</span>
                <span className="text-red-500">→</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">User Distribution</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Admins</span>
              <span className="font-semibold text-red-600">{stats.usersByRole?.admin || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Store Owners</span>
              <span className="font-semibold text-blue-600">{stats.usersByRole?.store_owner || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Regular Users</span>
              <span className="font-semibold text-green-600">{stats.usersByRole?.user || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Users</h2>
          <div className="space-y-4">
            {stats.recentUsers && stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">👤</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-gray-900 font-medium">{user.name}</p>
                    <p className="text-gray-600 text-sm">{user.email} - {user.role}</p>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No recent users</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Stores</h2>
          <div className="space-y-4">
            {stats.recentStores && stats.recentStores.length > 0 ? (
              stats.recentStores.map((store) => (
                <div key={store.id} className="flex items-center p-4 bg-green-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">🏪</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-gray-900 font-medium">{store.name}</p>
                    <p className="text-gray-600 text-sm">Owner: {store.owner?.name}</p>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {new Date(store.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No recent stores</p>
            )}
          </div>
        </div>
      </div>
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              System Administrator Dashboard 👑
            </h1>
            <p className="text-xl text-gray-600">
              Welcome, {user?.name}! Manage users, stores, and monitor system health.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              👥 Users ({stats.totalUsers})
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'stores'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🏪 Stores ({stats.totalStores})
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            <p>{error}</p>
            <button 
              onClick={fetchStats}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tab Content */}
        {renderTabContent()}

        {/* Modals */}
        <CreateUserModal
          isOpen={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
          onUserCreated={handleUserCreated}
        />
        <CreateStoreModal
          isOpen={showCreateStoreModal}
          onClose={() => setShowCreateStoreModal(false)}
          onStoreCreated={handleStoreCreated}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
