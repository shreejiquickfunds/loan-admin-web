import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Timeline from '../components/Timeline';
import StatusBadge from '../components/StatusBadge';
import {
  FiArrowLeft, FiEdit3, FiUser, FiCalendar, FiHash,
  FiCreditCard, FiTrash2, FiDollarSign, FiSave, FiX, FiCheck,
} from 'react-icons/fi';

const STATUSES    = ['Login', 'Document Pending', 'Sanction', 'Disbursement'];
const LOAN_TYPES  = ['Home Loan', 'Personal Loan', 'Business Loan', 'Vehicle Loan', 'Education Loan', 'Gold Loan'];

const FileDetail = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { isAdmin } = useAuth();

  const [file,        setFile]        = useState(null);
  const [loading,     setLoading]     = useState(true);

  // Status update
  const [updateStatus, setUpdateStatus] = useState('');
  const [statusNote,   setStatusNote]   = useState('');
  const [updating,     setUpdating]     = useState(false);

  // Edit Details
  const [editMode,    setEditMode]    = useState(false);
  const [editData,    setEditData]    = useState({});
  const [subAdmins,   setSubAdmins]   = useState([]);
  const [saving,      setSaving]      = useState(false);
  const [editError,   setEditError]   = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  useEffect(() => { fetchFile(); }, [id]);

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

  const openEditMode = async () => {
    setEditError('');
    setEditSuccess('');
    setEditData({
      applicantName: file.applicantName,
      loanType:      file.loanType,
      amount:        file.amount != null ? file.amount : '',
      assignedTo:    file.assignedTo?._id || '',
    });
    setEditMode(true);
    // fetch sub-admins lazily
    if (subAdmins.length === 0) {
      try {
        const { data } = await API.get('/users/subadmins');
        setSubAdmins(data);
      } catch (err) {
        console.error('Failed to fetch sub-admins', err);
      }
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    setSaving(true);
    try {
      const payload = {
        applicantName: editData.applicantName,
        loanType:      editData.loanType,
        assignedTo:    editData.assignedTo,
        amount:        editData.amount !== '' ? editData.amount : null,
      };
      const { data } = await API.put(`/files/${id}`, payload);
      setFile(data);
      setEditSuccess('File details updated successfully!');
      setTimeout(() => { setEditMode(false); setEditSuccess(''); }, 1500);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) return;
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
      const { data } = await API.put(`/files/${id}/status`, { status: updateStatus, note: statusNote });
      setFile(data);
      setStatusNote('');
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdating(false);
    }
  };

  /* ─── Loading / Not found ─── */
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

  /* ─── Main render ─── */
  return (
    <div className="file-detail-page">

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <button className="btn btn-ghost back-btn" onClick={() => navigate('/admin/files')}>
          <FiArrowLeft /> Back to Files
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary"
            onClick={editMode ? () => setEditMode(false) : openEditMode}
          >
            {editMode ? <><FiX /> Cancel Edit</> : <><FiEdit3 /> Edit Details</>}
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
      </div>

      <div className="detail-grid">

        {/* ── File Info / Edit Card ── */}
        <div className="detail-card file-info-card">
          <div className="detail-card-header">
            <h2>File Details</h2>
            <StatusBadge status={file.status} />
          </div>

          {/* ─── VIEW mode ─── */}
          {!editMode && (
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
                <div className="detail-icon"><FiDollarSign /></div>
                <div>
                  <label>Loan Amount</label>
                  <p className="detail-value">
                    {file.amount != null
                      ? `₹${Number(file.amount).toLocaleString('en-IN')}`
                      : <span className="text-muted" style={{ fontStyle: 'italic' }}>Not specified</span>}
                  </p>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon"><FiUser /></div>
                <div>
                  <label>Assigned To</label>
                  <p className="detail-value">
                    {file.assignedTo?.name} <span className="text-muted">({file.assignedTo?.email})</span>
                  </p>
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
          )}

          {/* ─── EDIT mode ─── */}
          {editMode && (
            <form onSubmit={handleEditSave} className="modal-form" style={{ marginTop: '8px' }}>

              {editError   && <div className="alert alert-error"   style={{ marginBottom: '12px' }}>{editError}</div>}
              {editSuccess && (
                <div className="alert" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', marginBottom: '12px', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiCheck /> {editSuccess}
                </div>
              )}

              {/* File Number — read-only */}
              <div className="form-group">
                <label>MCF ID / File Number</label>
                <input
                  type="text"
                  value={file.fileNumber}
                  disabled
                  style={{ opacity: 0.55, cursor: 'not-allowed', fontFamily: 'monospace', letterSpacing: '0.5px' }}
                />
                <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  File number cannot be changed after creation.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="edit-applicantName">Applicant Name <span style={{ color: 'var(--ruby-400)' }}>*</span></label>
                <input
                  type="text"
                  id="edit-applicantName"
                  value={editData.applicantName || ''}
                  onChange={(e) => setEditData({ ...editData, applicantName: e.target.value })}
                  placeholder="Enter applicant's full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-loanType">Loan Type <span style={{ color: 'var(--ruby-400)' }}>*</span></label>
                <select
                  id="edit-loanType"
                  value={editData.loanType || ''}
                  onChange={(e) => setEditData({ ...editData, loanType: e.target.value })}
                  required
                >
                  <option value="">Select Loan Type</option>
                  {LOAN_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-amount">
                  Loan Amount (₹){' '}
                  <span style={{ fontWeight: 400, fontSize: '0.75rem', color: 'var(--text-muted)' }}>(optional)</span>
                </label>
                <input
                  type="number"
                  id="edit-amount"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                  placeholder="e.g. 500000"
                  min="0"
                  step="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-assignedTo">Assign To (Sub-Admin) <span style={{ color: 'var(--ruby-400)' }}>*</span></label>
                <select
                  id="edit-assignedTo"
                  value={editData.assignedTo || ''}
                  onChange={(e) => setEditData({ ...editData, assignedTo: e.target.value })}
                  required
                >
                  <option value="">Select Sub-Admin</option>
                  {subAdmins.map((a) => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
                  <FiX /> Cancel
                </button>
              </div>
            </form>
          )}

          {/* ─── Status Update (always visible) ─── */}
          <div className="status-update-section" style={{ marginTop: editMode ? '24px' : undefined }}>
            <h3><FiEdit3 /> Update Status</h3>
            <form onSubmit={handleStatusUpdate} className="status-update-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">New Status</label>
                  <select
                    id="status"
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="select-themed"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label htmlFor="note">
                    Note (optional)
                    <span style={{ marginLeft: 6, fontWeight: 400, fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                      — Enter for new line · Ctrl+Enter to submit
                    </span>
                  </label>
                  <textarea
                    id="note"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        if (updateStatus !== file.status) handleStatusUpdate(e);
                      }
                    }}
                    placeholder="Add a note about this status change..."
                    rows={3}
                    style={{ resize: 'vertical', minHeight: '76px', lineHeight: '1.55' }}
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
