import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Notifications.css';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      // Only fetch notifications targeted at the currently logged-in user
      const url = user?.studentId 
        ? `http://localhost:3000/api/notifications?targetIt=${user.studentId}`
        : 'http://localhost:3000/api/notifications';
        
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleResponse = async (notif, status) => {
    const isAccepted = status === 'accepted';

    // Safely extract the project name from the incoming notification message
    let projectName = "your";
    if (notif.message && notif.message.includes('Requested to join ')) {
      projectName = notif.message.replace('Requested to join ', '').replace(' project', '');
    }

    // Create new status notification replacing the action request
    const payload = {
      senderIt: user ? `${user.studentId} - ${user.fullName}` : 'Unknown',
      targetIt: notif.senderIt.split(' - ')[0],
      message: isAccepted ? `Request accepted ${projectName} project` : `Request rejected ${projectName} project`,
      type: status
    };

    try {
      // 1. Send the new status notification back to the system
      await fetch('http://localhost:3000/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // 2. Update the pending request instead of deleting it
      const updatePayload = {
        message: isAccepted ? `You accepted - ${projectName} project` : `You rejected - ${projectName} project`,
        type: isAccepted ? 'you_accepted' : 'you_rejected'
      };

      await fetch(`http://localhost:3000/api/notifications/${notif._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });

      // 3. Hot-reload feed
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/notifications/${id}`, { method: 'DELETE' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="notif-page-container custom-scrollbar">
      <div className="notif-header">
        <h1>Notifications</h1>
        <p>Manage your pending membership requests and alerts.</p>
      </div>

      <div className="notif-list">
        {isLoading ? (
          <div className="notif-empty">
            <div className="spinner"></div>
            <p>Loading alerts...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notif-empty notif-caught-up">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3>No new notifications</h3>
            <p>You're all caught up! New alerts will appear here seamlessly.</p>
          </div>
        ) : (
          notifications.map(notif => {
            const isRequest = notif.type === 'join_request';

            return (
              <div key={notif._id} className={`notif-card ${notif.type} flex flex-col md:flex-row gap-4 items-start md:items-center justify-between`}>
                <div className="notif-content flex items-center gap-4">
                  <div className={`notif-icon ${notif.type}`}>
                    {notif.type === 'join_request' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    )}
                    {(notif.type === 'accepted' || notif.type === 'you_accepted') && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"></path></svg>
                    )}
                    {(notif.type === 'rejected' || notif.type === 'you_rejected') && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                    )}
                  </div>
                  <div className="notif-text">
                    <span className="notif-it">{notif.senderIt}</span>
                    <p className="notif-desc">{notif.message}</p>
                  </div>
                </div>

                {isRequest ? (
                  <div className="notif-actions flex gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <button className="btn-notif btn-accept flex-1 md:flex-none" onClick={() => handleResponse(notif, 'accepted')}>Accept</button>
                    <button className="btn-notif btn-reject flex-1 md:flex-none" onClick={() => handleResponse(notif, 'rejected')}>Reject</button>
                  </div>
                ) : (
                  <div className="notif-actions-simple flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
                    <span className={`status-badge ${notif.type}`}>
                      {notif.type.includes('accepted') ? 'Accepted' : 'Rejected'}
                    </span>
                    <button className="btn-notif btn-dismiss" onClick={() => handleDelete(notif._id)}>Dismiss</button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
