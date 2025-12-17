import React, { useState, useEffect, useRef } from 'react';
import { notificationsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/styles.css';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth(); // To verify auth status

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const [notifResponse, countResponse] = await Promise.all([
                notificationsAPI.getAll({ page_size: 5 }),
                notificationsAPI.getUnreadCount()
            ]);

            // Handle pagination format
            const notifList = notifResponse.data.results || notifResponse.data;
            setNotifications(notifList);
            setUnreadCount(countResponse.data.count);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const handleMarkRead = async (notification) => {
        try {
            await notificationsAPI.markRead(notification.notification_id);
            if (notification.link) {
                navigate(notification.link);
                setShowDropdown(false);
            }
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationsAPI.markAllRead();
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    // Styles for the component
    const styles = {
        bellContainer: {
            position: 'relative',
            marginRight: '15px',
            cursor: 'pointer'
        },
        bellButton: {
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            color: 'white',
            cursor: 'pointer',
            padding: '5px',
            position: 'relative'
        },
        badge: {
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
        },
        dropdown: {
            position: 'absolute',
            top: '100%',
            right: 0,
            width: '320px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            overflow: 'hidden',
            marginTop: '10px'
        },
        header: {
            padding: '12px 16px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f9fafb'
        },
        title: {
            margin: 0,
            fontSize: '1rem',
            fontWeight: 600,
            color: '#1f2937'
        },
        markAllBtn: {
            fontSize: '0.8rem',
            color: '#2563eb',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
        },
        list: {
            maxHeight: '350px',
            overflowY: 'auto'
        },
        item: {
            padding: '12px 16px',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            display: 'block',
            textAlign: 'left',
            width: '100%'
        },
        unreadItem: {
            backgroundColor: '#eff6ff'
        },
        itemTitle: {
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '4px'
        },
        itemMessage: {
            fontSize: '0.85rem',
            color: '#6b7280',
            marginBottom: '6px',
            lineHeight: 1.4
        },
        itemTime: {
            fontSize: '0.75rem',
            color: '#9ca3af'
        },
        empty: {
            padding: '20px',
            textAlign: 'center',
            color: '#6b7280',
            fontStyle: 'italic'
        },
        footer: {
            padding: '10px',
            textAlign: 'center',
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#f9fafb'
        },
        viewAllLink: {
            color: '#2563eb',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500
        }
    };

    return (
        <div style={styles.bellContainer} ref={dropdownRef}>
            <button
                style={styles.bellButton}
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="Notifications"
            >
                🔔
                {unreadCount > 0 && (
                    <span style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {showDropdown && (
                <div style={styles.dropdown}>
                    <div style={styles.header}>
                        <h4 style={styles.title}>Notifications</h4>
                        {unreadCount > 0 && (
                            <button
                                style={styles.markAllBtn}
                                onClick={handleMarkAllRead}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div style={styles.list}>
                        {notifications.length > 0 ? (
                            notifications.map(notif => (
                                <div
                                    key={notif.notification_id}
                                    style={{
                                        ...styles.item,
                                        ...(notif.is_read ? {} : styles.unreadItem)
                                    }}
                                    onClick={() => handleMarkRead(notif)}
                                >
                                    <div style={styles.itemTitle}>{notif.title}</div>
                                    <div style={styles.itemMessage}>{notif.message}</div>
                                    <div style={styles.itemTime}>
                                        {new Date(notif.created_at).toLocaleString([], {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={styles.empty}>No notifications</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
