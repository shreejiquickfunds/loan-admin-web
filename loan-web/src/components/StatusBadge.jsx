const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'Login':            return 'status-login';
      case 'Document Pending': return 'status-doc-pending';
      case 'Sanction':         return 'status-sanction';
      case 'Disbursement':     return 'status-disbursement';
      default:                 return 'status-login';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
