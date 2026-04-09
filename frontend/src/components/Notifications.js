import React, { useState, useEffect } from 'react';
import { notificationsAPI } from '../services/api';
import { toast } from 'react-toastify';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationsAPI.getAll();
            setNotifications(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationsAPI.markAllRead();
            fetchNotifications();
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to mark all as read');
        }
    };

    return (
        <div className="page">
            <div className="container">
                <div className="card animate-fade-in">
                    <div className="card-header">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="card-title">Notifications</h2>
                                <p className="card-subtitle">Your recent alerts and messages</p>
                            </div>
                            {notifications.some(n => !n.is_read) && (
                                <button className="btn btn-outline" onClick={handleMarkAllRead}>
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="text-center"><div className="spinner"></div></div>
                        ) : notifications.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {notifications.map(notif => (
                                    <div key={notif.notification_id} style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid', backgroundColor: notif.is_read ? '#1F2937' : '#0f172a', borderColor: notif.is_read ? '#374151' : '#0284c7' }}>
                                        <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
                                            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: notif.is_read ? '#D1D5DB' : '#FFFFFF' }}>{notif.title}</h4>
                                            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                                {new Date(notif.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p style={{ color: notif.is_read ? '#9CA3AF' : '#D1D5DB', margin: 0 }}>{notif.message}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">🔔</div>
                                <h3 className="empty-title">No notifications yet</h3>
                                <p className="empty-message">You're all caught up!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
