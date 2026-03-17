const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'New': return 'status-new';
      case 'Under Review': return 'status-review';
      case 'Under Process': return 'status-process';
      case 'Approved': return 'status-approved';
      case 'Rejected': return 'status-rejected';
      case 'Completed': return 'status-completed';
      default: return 'status-new';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
