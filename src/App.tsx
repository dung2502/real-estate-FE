import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import PropertyList from './components/PropertyList';
import PropertyForm from './components/PropertyForm';
import PropertyDetail from './components/PropertyDetail';
import RegisterForm from './components/RegisterForm';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <LoginForm />
        </PublicRoute>
      } />

        <Route path="/register" element={
            <PublicRoute>
                <RegisterForm />
            </PublicRoute>
        } />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <HomePage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/properties" element={
        <ProtectedRoute>
          <Layout>
            <PropertyList />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/properties/create" element={
        <ProtectedRoute>
          <Layout>
            <PropertyForm />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/properties/:id" element={
        <ProtectedRoute>
          <Layout>
            <PropertyDetail />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/properties/:id/edit" element={
        <ProtectedRoute>
          <Layout>
            <PropertyForm />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
