import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Timeline from '../components/Timeline';
import StatusBadge from '../components/StatusBadge';
import { FiArrowLeft, FiEdit3, FiUser, FiCalendar, FiHash, FiCreditCard, FiTrash2 } from 'react-icons/fi';

const STATUSES = ['New', 'Under Review', 'Under Process', 'Approved', 'Rejected', 'Completed'];

const FileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchFile();
  }, [id]);

  const fetchFile = async () => {
    try {
      const { data } = await API.get(`/files/${id}`);
      setFile(data);
      setUpdateStatus(data.status);
    } catch (err) {
      console.error('Failed to fetch file', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) return;
    
    try {
      await API.delete(`/files/${id}`);
      navigate('/admin/files');
    } catch (err) {
      console.error('Failed to delete file', err);
      alert('Error deleting file. ' + (err.response?.data?.message || ''));
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (updateStatus === file.status) return;

    setUpdating(true);
    try {
      const { data } = await API.put(`/files/${id}/status`, {
        status: updateStatus,
        note: statusNote,
      });
      setFile(data);
      setStatusNote('');
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading file details...</p>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="empty-state">
        <h3>File Not Found</h3>
        <button className="btn btn-primary" onClick={() => navigate('/admin/files')}>
          Go Back to Files
        </button>
      </div>
    );
  }

  return (
    <div className="file-detail-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-ghost back-btn" onClick={() => navigate('/admin/files')}>
          <FiArrowLeft /> Back to Files
        </button>
        {isAdmin && (
          <button 
            className="btn" 
            style={{ color: '#dc3545', backgroundColor: '#fdf3f4', borderColor: '#fbc2c4' }}
            onClick={handleDeleteFile}
          >
            <FiTrash2 /> Delete File
          </button>
        )}
      </div>

      <div className="detail-grid">
        {/* File Info Card */}
        <div className="detail-card file-info-card">
          <div className="detail-card-header">
            <h2>File Details</h2>
            <StatusBadge status={file.status} />
          </div>

          <div className="file-details-grid">
            <div className="detail-item">
              <div className="detail-icon"><FiHash /></div>
              <div>
                <label>File Number</label>
                <p className="detail-value">{file.fileNumber}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><FiUser /></div>
              <div>
                <label>Applicant Name</label>
                <p className="detail-value">{file.applicantName}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><FiCreditCard /></div>
              <div>
                <label>Loan Type</label>
                <p className="detail-value">{file.loanType}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><FiUser /></div>
              <div>
                <label>Assigned To</label>
                <p className="detail-value">{file.assignedTo?.name} <span className="text-muted">({file.assignedTo?.email})</span></p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><FiUser /></div>
              <div>
                <label>Created By</label>
                <p className="detail-value">{file.createdBy?.name}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><FiCalendar /></div>
              <div>
                <label>Created On</label>
                <p className="detail-value">
                  {new Date(file.createdAt).toLocaleString('en-IN', {
                    day: '2-digit', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', hour12: true,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Status Update Form */}
          <div className="status-update-section">
            <h3><FiEdit3 /> Update Status</h3>
            <form onSubmit={handleStatusUpdate} className="status-update-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">New Status</label>
                  <select
                    id="status"
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label htmlFor="note">Note (optional)</label>
                  <input
                    type="text"
                    id="note"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add a note about this status change..."
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updating || updateStatus === file.status}
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </form>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="detail-card timeline-card">
          <div className="detail-card-header">
            <h2>📋 Activity Timeline</h2>
          </div>
          <Timeline events={file.timeline} />
        </div>
      </div>
    </div>
  );
};

export default FileDetail;
