import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { FiEye, FiCalendar, FiUser } from 'react-icons/fi';

const FileTable = ({ files, loading }) => {
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
                <button className="btn btn-icon" onClick={(e) => { e.stopPropagation(); navigate(`/admin/files/${file._id}`); }}>
                  <FiEye /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;
