import React, { useState, useEffect } from 'react';
import RatingInput from '../common/RatingInput';
import { getStores, submitRating, getUserRatings } from '../../api/user';

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [storesResponse, ratingsResponse] = await Promise.all([
        getStores(),
        getUserRatings().catch(() => ({ data: { data: { ratings: [] } } })) // Handle if user has no ratings
      ]);
      
      setStores(storesResponse.data.data.stores);
      
      // Convert user ratings to a map for easy lookup
      const ratingsMap = {};
      if (ratingsResponse.data?.data?.ratings) {
        ratingsResponse.data.data.ratings.forEach(rating => {
          ratingsMap[rating.storeId] = rating;
        });
      }
      setUserRatings(ratingsMap);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load stores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (storeId, rating, comment) => {
    try {
      await submitRating(storeId, rating, comment);
      
      // Update user ratings locally
      setUserRatings(prev => ({
        ...prev,
        [storeId]: { storeId, rating, comment }
      }));
      
      // Refresh stores to get updated average ratings
      fetchData();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  // Get unique categories for filter
  const categories = ['all', ...new Set(stores.map(store => store.category).filter(Boolean))];

  // Filter and sort stores
  const filteredStores = stores
    .filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           store.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           store.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || store.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading stores...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={fetchData}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Browse Stores 🏪
            </h1>
            <p className="text-xl text-gray-600">
              Discover amazing local businesses and share your experiences
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, address, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name (A-Z)</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredStores.length} of {stores.length} stores
          </div>
        </div>

        {/* Stores Grid */}
        {filteredStores.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No stores are available at the moment.'}
            </p>
            {(searchTerm || categoryFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map(store => (
              <div key={store.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{store.name}</h3>
                      {store.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {store.category.charAt(0).toUpperCase() + store.category.slice(1)}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        <span className="font-medium">
                          {store.averageRating > 0 ? store.averageRating.toFixed(1) : 'No ratings'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {store.totalRatings} review{store.totalRatings !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {store.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{store.description}</p>
                  )}

                  {store.address && (
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="mr-1">📍</span>
                      {store.address}
                    </div>
                  )}

                  {store.phone && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="mr-1">📞</span>
                      {store.phone}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Your Rating: {userRatings[store.id] ? (
                          <span className="text-blue-600 font-semibold">
                            {userRatings[store.id].rating} star{userRatings[store.id].rating !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-gray-500">Not rated yet</span>
                        )}
                      </div>
                    </div>
                    <RatingInput
                      initialRating={userRatings[store.id]?.rating || 0}
                      initialComment={userRatings[store.id]?.comment || ''}
                      onSubmit={(rating, comment) => handleRatingSubmit(store.id, rating, comment)}
                      allowEdit={true}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoresList;