import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiFileText, FiLogIn, FiFileText as FiDoc, FiCheckCircle, FiDollarSign, FiClock } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, filesRes] = await Promise.all([
        API.get('/files/stats'),
        API.get('/files', { params: { limit: 5 } }),
      ]);
      setStats(statsRes.data);
      // Backend now returns { files, pagination }
      setRecentFiles(filesRes.data.files ?? filesRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Files',       value: stats?.total       || 0, icon: <FiFileText />,   color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
    { label: 'Login',             value: stats?.login       || 0, icon: <FiLogIn />,      color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { label: 'Document Pending',  value: stats?.docPending  || 0, icon: <FiClock />,      color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Sanction',          value: stats?.sanction    || 0, icon: <FiCheckCircle />,color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Disbursement',      value: stats?.disbursement|| 0, icon: <FiDollarSign />, color: '#e8b84b', bg: 'rgba(232, 184, 75, 0.1)'  },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p className="page-subtitle">Here's what's happening with your loan files today.</p>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card" style={{ '--card-color': card.color, '--card-bg': card.bg }}>
            <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <h3 className="stat-value">{card.value}</h3>
              <p className="stat-label">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Files</h2>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/files')}>
            View All Files
          </button>
        </div>

        {recentFiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No Files Yet</h3>
            <p>Start by adding your first loan file.</p>
            <button className="btn btn-primary" onClick={() => navigate('/admin/files')}>
              Go to Files
            </button>
          </div>
        ) : (
          <div className="recent-files-list">
            {recentFiles.map((file) => (
              <div key={file._id} className="recent-file-card" onClick={() => navigate(`/admin/files/${file._id}`)}>
                <div className="recent-file-avatar">
                  {file.applicantName?.charAt(0).toUpperCase()}
                </div>
                <div className="recent-file-info">
                  <h4>{file.applicantName}</h4>
                  <p>{file.fileNumber} • {file.loanType}</p>
                </div>
                <div className="recent-file-status">
                  <span className={`status-dot status-dot-${file.status.toLowerCase().replace(/\s/g, '-')}`}></span>
                  <span>{file.status}</span>
                </div>
                <div className="recent-file-date">
                  {new Date(file.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
