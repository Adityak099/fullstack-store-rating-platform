import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UpdatePassword from './UpdatePassword';
import { getStoreOwnerDashboard, createStore } from '../../api/storeOwner';

const StoreOwnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getStoreOwnerDashboard();
      setDashboardData(response.data.data);
      setError('');
    } catch (error) {
      console.error('Dashboard error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StoreOverview = ({ data }) => (
    <div className="space-y-8">
      {/* Store Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {data.statistics.averageRating || 'N/A'}
          </div>
          <div className="text-gray-600">Average Rating</div>
          <div className="flex justify-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-lg ${
                  star <= Math.round(data.statistics.averageRating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {data.statistics.totalRatings}
          </div>
          <div className="text-gray-600">Total Reviews</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {data.userRatings.length}
          </div>
          <div className="text-gray-600">Active Customers</div>
        </div>
      </div>

      {/* Store Information */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{data.store.name}</h3>
            <p className="text-gray-600 mb-4">{data.store.description || 'No description available'}</p>
            <div className="space-y-2">
              <p><span className="font-medium">Address:</span> {data.store.address || 'Not provided'}</p>
              <p><span className="font-medium">Phone:</span> {data.store.phone || 'Not provided'}</p>
              <p><span className="font-medium">Category:</span> {data.store.category || 'Not specified'}</p>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h4>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center mb-2">
                <span className="w-12 text-sm">{rating} ⭐</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${
                        data.statistics.totalRatings > 0
                          ? (data.statistics.ratingDistribution[rating] / data.statistics.totalRatings) * 100
                          : 0
                      }%`
                    }}
                  ></div>
                </div>
                <span className="w-8 text-sm text-gray-600">
                  {data.statistics.ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const RatingsTab = ({ data }) => {
    if (!data?.hasStore) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          Please create your store first to view ratings.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer Ratings & Reviews</h2>
        
        {data.userRatings.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">⭐</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings yet</h3>
            <p className="text-gray-600">When customers rate your store, their reviews will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.userRatings.map((rating) => (
              <div key={rating.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-medium text-gray-900 mr-3">{rating.user.name}</h4>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${
                              star <= rating.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({rating.rating}/5)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{rating.user.email}</p>
                    {rating.comment && (
                      <p className="text-gray-800">{rating.comment}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const NoStoreView = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="text-6xl mb-4">🏪</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to your Store Dashboard!</h2>
      <p className="text-gray-600 mb-6">
        You haven't created your store yet. Create your store to start receiving customer ratings and reviews.
      </p>
      <button
        onClick={() => setActiveTab('create-store')}
        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
      >
        Create Your Store
      </button>
    </div>
  );

  const CreateStoreTab = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      address: '',
      phone: '',
      category: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setError('');

      try {
        await createStore(formData);
        await loadDashboardData(); // Reload dashboard data
        setActiveTab('overview'); // Switch back to overview
      } catch (error) {
        setError(error.data?.message || 'Failed to create store');
      } finally {
        setSubmitting(false);
      }
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Store</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your store name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe your store"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Store address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Contact phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a category</option>
              <option value="restaurant">Restaurant</option>
              <option value="retail">Retail</option>
              <option value="grocery">Grocery</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="services">Services</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Store'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const SettingsTab = ({ user }) => (
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
  );

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={loadDashboardData}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return dashboardData?.hasStore ? (
          <StoreOverview data={dashboardData} />
        ) : (
          <NoStoreView />
        );
      case 'ratings':
        return <RatingsTab data={dashboardData} />;
      case 'create-store':
        return <CreateStoreTab />;
      case 'settings':
        return <SettingsTab user={user} />;
      default:
        return dashboardData?.hasStore ? (
          <StoreOverview data={dashboardData} />
        ) : (
          <NoStoreView />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome, {user?.name}! 🏪
            </h1>
            <p className="text-xl text-gray-600">
              Manage your store and connect with customers
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'ratings', name: 'Ratings & Reviews', icon: '⭐' },
                { id: 'settings', name: 'Settings', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
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
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
