import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import './landing.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/files" element={
            <ProtectedRoute>
              <AdminLayout>
                <Files />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/files/:id" element={
            <ProtectedRoute>
              <AdminLayout>
                <FileDetail />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
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
