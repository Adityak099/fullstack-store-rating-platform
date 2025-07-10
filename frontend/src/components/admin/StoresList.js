import React, { useState, useEffect } from 'react';
import { getAllStores } from '../../api/admin';

const StoresList = ({ onCreateStore }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  
  // Enhanced filter states
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await getAllStores();
      setStores(response.data.data.stores);
      setError('');
    } catch (error) {
      console.error('Error fetching stores:', error);
      setError('Failed to load stores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(store => {
    // Global search filter
    const matchesSearch = !searchTerm || 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.owner?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.owner?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && store.isActive) ||
                         (statusFilter === 'inactive' && !store.isActive);
    
    // Specific filters
    const matchesName = !nameFilter || store.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesEmail = !emailFilter || store.owner?.email.toLowerCase().includes(emailFilter.toLowerCase());
    const matchesAddress = !addressFilter || store.address?.toLowerCase().includes(addressFilter.toLowerCase());
    const matchesRole = roleFilter === 'all' || roleFilter === 'store_owner'; // All stores are owned by store owners
    
    return matchesSearch && matchesStatus && matchesName && matchesEmail && matchesAddress && matchesRole;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setNameFilter('');
    setEmailFilter('');
    setAddressFilter('');
    setRoleFilter('all');
  };

  const viewStoreDetails = (store) => {
    setSelectedStore(store);
    setShowStoreDetails(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={fetchStores}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Stores Management</h2>
        <button
          onClick={() => onCreateStore()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + Add New Store
        </button>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Stores</h3>
        
        {/* Global Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Global Search</label>
          <input
            type="text"
            placeholder="Search by store name, owner name, email, address, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Specific Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Store Name</label>
            <input
              type="text"
              placeholder="Enter store name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Owner Email</label>
            <input
              type="text"
              placeholder="Enter owner email..."
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Address</label>
            <input
              type="text"
              placeholder="Enter address..."
              value={addressFilter}
              onChange={(e) => setAddressFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredStores.length} of {stores.length} stores
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-green-600 hover:text-green-800 font-medium"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <div 
            key={store.id} 
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => viewStoreDetails(store)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{store.name}</h3>
                {store.category && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {store.category}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  store.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {store.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {store.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{store.description}</p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">👤</span>
                {store.owner?.name}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">�</span>
                {store.owner?.email}
              </div>
              {store.address && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">�</span>
                  {store.address}
                </div>
              )}
              {store.phone && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">�</span>
                  {store.phone}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">⭐</span>
                  <span className="font-medium text-sm">
                    {store.averageRating > 0 ? store.averageRating.toFixed(1) : 'No ratings'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {store.totalRatings} review{store.totalRatings !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">🏪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' || nameFilter || emailFilter || addressFilter
              ? 'Try adjusting your search or filter criteria.' 
              : 'No stores are available at the moment.'}
          </p>
        </div>
      )}

      {/* Store Details Modal */}
      {showStoreDetails && selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Store Details</h2>
              <button
                onClick={() => setShowStoreDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Store Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedStore.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <p className="text-gray-900">{selectedStore.category || 'No category'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedStore.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedStore.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <p className="text-gray-900">{selectedStore.phone || 'No phone number'}</p>
                </div>
              </div>

              {/* Description */}
              {selectedStore.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-gray-900">{selectedStore.description}</p>
                </div>
              )}

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <p className="text-gray-900">{selectedStore.address || 'No address provided'}</p>
              </div>

              {/* Owner Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                    <p className="text-gray-900">{selectedStore.owner?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Owner Email</label>
                    <p className="text-gray-900">{selectedStore.owner?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      Store Owner
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Rating</label>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-2 text-lg">⭐</span>
                      <span className="text-xl font-semibold text-gray-900">
                        {selectedStore.averageRating > 0 ? selectedStore.averageRating.toFixed(1) : 'No ratings'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Reviews</label>
                    <p className="text-xl font-semibold text-gray-900">
                      {selectedStore.totalRatings} review{selectedStore.totalRatings !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                    <p className="text-gray-900">
                      {new Date(selectedStore.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                    <p className="text-gray-900">
                      {new Date(selectedStore.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-6 border-t">
              <button
                onClick={() => setShowStoreDetails(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoresList;
