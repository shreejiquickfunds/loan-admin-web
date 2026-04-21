import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { FiEye, FiCalendar, FiUser, FiTrash2 } from 'react-icons/fi';

const FileTable = ({ files, loading, onDeleteFile }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="table-loading">
        <div className="loading-spinner"></div>
        <p>Loading files...</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📂</div>
        <h3>No Loan Files Found</h3>
        <p>No files match your current search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>File Number</th>
            <th>Applicant Name</th>
            <th>Loan Type</th>
            <th>Amount</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file._id} className="table-row" onClick={() => navigate(`/admin/files/${file._id}`)}>
              <td>
                <span className="file-number">{file.fileNumber}</span>
              </td>
              <td>
                <div className="applicant-cell">
                  <div className="applicant-avatar">
                    {file.applicantName?.charAt(0).toUpperCase()}
                  </div>
                  <span>{file.applicantName}</span>
                </div>
              </td>
              <td>
                <span className="loan-type-badge">{file.loanType}</span>
              </td>
              <td>
                <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                  {file.amount != null
                    ? `₹${Number(file.amount).toLocaleString('en-IN')}`
                    : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                </span>
              </td>
              <td>
                <div className="assigned-cell">
                  <FiUser className="cell-icon" />
                  <span>{file.assignedTo?.name || 'Unassigned'}</span>
                </div>
              </td>
              <td>
                <StatusBadge status={file.status} />
              </td>
              <td>
                <div className="date-cell">
                  <FiCalendar className="cell-icon" />
                  <span>{new Date(file.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-icon" onClick={(e) => { e.stopPropagation(); navigate(`/admin/files/${file._id}`); }}>
                    <FiEye /> View
                  </button>
                  {onDeleteFile && (
                    <button 
                      className="btn btn-icon" 
                      style={{ color: '#dc3545', backgroundColor: '#fdf3f4', borderColor: '#fbc2c4' }}
                      onClick={(e) => { e.stopPropagation(); onDeleteFile(file._id); }}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;
