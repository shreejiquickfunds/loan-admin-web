import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import FileTable from '../components/FileTable';
import AddFileModal from '../components/AddFileModal';
import { FiPlus, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// "All" is intentionally last — it's explicit & heavy
const STATUSES = ['Login', 'Document Pending', 'Sanction', 'Disbursement', 'All'];
const PAGE_SIZE = 20;

const Files = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  // Default to first real status, not "All"
  const [statusFilter, setStatusFilter] = useState('Login');
  const [showAddModal, setShowAddModal] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 });
  const { isAdmin } = useAuth();

  const fetchFiles = useCallback(async (pageNum = 1, currentSearch = search, currentStatus = statusFilter) => {
    setLoading(true);
    try {
      const params = { page: pageNum, limit: PAGE_SIZE };
      if (currentSearch) params.search = currentSearch;
      if (currentStatus !== 'All') params.status = currentStatus;

      const { data } = await API.get('/files', { params });
      // Backend now returns { files, pagination }
      setFiles(data.files);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to fetch files', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchFiles(1, search, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFiles(1, search, statusFilter);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    // fetchFiles triggered by useEffect above
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchFiles(newPage, search, statusFilter);
  };

  const handleFileAdded = (newFile) => {
    setFiles([newFile, ...files]);
    setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) return;
    try {
      await API.delete(`/files/${fileId}`);
      setFiles(files.filter((f) => f._id !== fileId));
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch (err) {
      console.error('Failed to delete file', err);
      alert('Error deleting file. ' + (err.response?.data?.message || ''));
    }
  };

  const startRecord = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endRecord   = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="files-page">
      <div className="page-header">
        <div>
          <h1>Loan Files</h1>
          <p className="page-subtitle">Manage and track all loan applications</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <FiPlus /> Add New File
        </button>
      </div>

      <div className="filters-bar">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or MCF ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-sm btn-primary">Search</button>
          </div>
        </form>

        <div className="filter-group">
          <FiFilter className="filter-icon" />
          <div className="status-filters">
            {STATUSES.map((status) => (
              <button
                key={status}
                className={`filter-chip ${statusFilter === status ? 'active' : ''}`}
                onClick={() => handleStatusChange(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="files-count">
        {pagination.total > 0 ? (
          <span>
            Showing <strong>{startRecord}–{endRecord}</strong> of <strong>{pagination.total}</strong> files
            {statusFilter !== 'All' && <span> &nbsp;·&nbsp; Filter: <strong>{statusFilter}</strong></span>}
          </span>
        ) : (
          <span>No files found</span>
        )}
      </div>

      <FileTable files={files} loading={loading} onDeleteFile={isAdmin ? handleDeleteFile : null} />

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="pagination-bar">
          <button
            className="btn btn-icon"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            <FiChevronLeft />
          </button>

          <div className="pagination-pages">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === '...' ? (
                  <span key={`ellipsis-${idx}`} className="pagination-ellipsis">…</span>
                ) : (
                  <button
                    key={item}
                    className={`pagination-btn ${pagination.page === item ? 'active' : ''}`}
                    onClick={() => handlePageChange(item)}
                  >
                    {item}
                  </button>
                )
              )}
          </div>

          <button
            className="btn btn-icon"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            <FiChevronRight />
          </button>
        </div>
      )}

      <AddFileModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onFileAdded={handleFileAdded}
      />
    </div>
  );
};

export default Files;
