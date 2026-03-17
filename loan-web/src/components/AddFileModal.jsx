import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiX, FiPlus } from 'react-icons/fi';

const LOAN_TYPES = [
  'Home Loan',
  'Personal Loan',
  'Business Loan',
  'Vehicle Loan',
  'Education Loan',
  'Gold Loan',
];

const AddFileModal = ({ isOpen, onClose, onFileAdded }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    applicantName: '',
    loanType: '',
    assignedTo: '',
  });
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchSubAdmins();
    }
  }, [isOpen]);

  const fetchSubAdmins = async () => {
    try {
      const { data } = await API.get('/users/subadmins');
      setSubAdmins(data);
    } catch (err) {
      console.error('Failed to fetch sub-admins', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/files', formData);
      onFileAdded(data);
      setFormData({ applicantName: '', loanType: '', assignedTo: '' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create file');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><FiPlus className="modal-icon" /> Add New Loan File</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="applicantName">Applicant Name</label>
            <input
              type="text"
              id="applicantName"
              value={formData.applicantName}
              onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
              placeholder="Enter applicant's full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="loanType">Loan Type</label>
            <select
              id="loanType"
              value={formData.loanType}
              onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
              required
            >
              <option value="">Select Loan Type</option>
              {LOAN_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assign To (Sub-Admin)</label>
            <select
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              required
            >
              <option value="">Select Sub-Admin</option>
              {subAdmins.map((admin) => (
                <option key={admin._id} value={admin._id}>{admin.name}</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFileModal;
