import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserDashboard from './components/user/Dashboard';
import StoresList from './components/user/StoresList';
import AdminDashboard from './components/admin/Dashboard';
import StoreOwnerDashboard from './components/storeOwner/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/stores" element={
                <ProtectedRoute>
                  <StoresList />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/store-owner" element={
                <ProtectedRoute requiredRole="store_owner">
                  <StoreOwnerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
