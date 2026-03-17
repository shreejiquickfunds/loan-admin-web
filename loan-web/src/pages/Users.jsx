import { useState, useEffect } from 'react';
import API from '../api/axios';
import { FiUserPlus, FiTrash2, FiShield, FiUser } from 'react-icons/fi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'subadmin',
  });
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      const { data } = await API.post('/users', formData);
      setUsers([...users, data]);
      setFormData({ name: '', email: '', password: '', role: 'subadmin' });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await API.delete(`/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p className="page-subtitle">Manage admin and sub-admin accounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiUserPlus /> {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showForm && (
        <div className="detail-card create-user-card">
          <h3>Create New User</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleCreateUser} className="create-user-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="userName">Full Name</label>
                <input
                  type="text"
                  id="userName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="userEmail">Email</label>
                <input
                  type="email"
                  id="userEmail"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="userPassword">Password</label>
                <input
                  type="password"
                  id="userPassword"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label htmlFor="userRole">Role</label>
                <select
                  id="userRole"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="subadmin">Sub Admin</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      <div className="users-grid">
        {users.map((u) => (
          <div key={u._id} className="user-card">
            <div className="user-card-avatar">
              {u.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-card-info">
              <h3>{u.name}</h3>
              <p className="user-card-email">{u.email}</p>
              <span className={`role-badge ${u.role}`}>
                {u.role === 'admin' ? <FiShield /> : <FiUser />}
                {u.role === 'admin' ? 'Admin' : 'Sub Admin'}
              </span>
            </div>
            {u.role !== 'admin' && (
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u._id)}>
                <FiTrash2 />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
