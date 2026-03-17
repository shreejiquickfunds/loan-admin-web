import { useState, useEffect } from 'react';
import API from '../api/axios';
import FileTable from '../components/FileTable';
import AddFileModal from '../components/AddFileModal';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';

const STATUSES = ['All', 'New', 'Under Review', 'Under Process', 'Approved', 'Rejected', 'Completed'];

const Files = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [statusFilter]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'All') params.status = statusFilter;

      const { data } = await API.get('/files', { params });
      setFiles(data);
    } catch (err) {
      console.error('Failed to fetch files', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFiles();
  };

  const handleFileAdded = (newFile) => {
    setFiles([newFile, ...files]);
  };

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
              placeholder="Search by name or file number..."
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
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="files-count">
        <span>Showing <strong>{files.length}</strong> files</span>
      </div>

      <FileTable files={files} loading={loading} />

      <AddFileModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onFileAdded={handleFileAdded}
      />
    </div>
  );
};

export default Files;
