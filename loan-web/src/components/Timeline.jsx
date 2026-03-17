import { FiClock, FiUser, FiArrowRight, FiMessageSquare } from 'react-icons/fi';

const Timeline = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="empty-state">
        <p>No timeline events yet.</p>
      </div>
    );
  }

  const getEventIcon = (action) => {
    if (action.includes('Status changed')) return '🔄';
    if (action.includes('created')) return '✨';
    if (action.includes('updated')) return '✏️';
    if (action.includes('reassigned')) return '👤';
    return '📋';
  };

  // Show events in reverse chronological order
  const sortedEvents = [...events].reverse();

  return (
    <div className="timeline">
      {sortedEvents.map((event, index) => (
        <div key={event._id || index} className="timeline-item">
          <div className="timeline-marker">
            <span className="timeline-icon">{getEventIcon(event.action)}</span>
            {index < sortedEvents.length - 1 && <div className="timeline-line"></div>}
          </div>
          <div className="timeline-content">
            <div className="timeline-header">
              <h4 className="timeline-action">{event.action}</h4>
              <span className="timeline-time">
                <FiClock />
                {new Date(event.createdAt).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>

            {event.fromStatus && event.toStatus && (
              <div className="timeline-status-change">
                <span className="timeline-from">{event.fromStatus}</span>
                <FiArrowRight className="timeline-arrow" />
                <span className="timeline-to">{event.toStatus}</span>
              </div>
            )}

            <div className="timeline-meta">
              <span className="timeline-user">
                <FiUser />
                {event.performedBy?.name || 'System'} 
                {event.performedBy?.role && (
                  <span className="timeline-role">({event.performedBy.role})</span>
                )}
              </span>
            </div>

            {event.note && (
              <div className="timeline-note">
                <FiMessageSquare />
                <span>{event.note}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
