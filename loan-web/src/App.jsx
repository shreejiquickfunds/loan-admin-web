import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Files from './pages/Files';
import FileDetail from './pages/FileDetail';
import Users from './pages/Users';
import { useAuth } from './context/AuthContext';

const AdminLayout = ({ children, collapsed, setCollapsed }) => {
  const location = useLocation();

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    }
  }, [location.pathname, setCollapsed]);

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div 
        className={`sidebar-overlay ${!collapsed ? 'active' : ''}`} 
        onClick={() => setCollapsed(true)} 
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= 768);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/files" element={
            <ProtectedRoute>
              <AdminLayout collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>
                <Files />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/files/:id" element={
            <ProtectedRoute>
              <AdminLayout collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>
                <FileDetail />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly>
              <AdminLayout collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
