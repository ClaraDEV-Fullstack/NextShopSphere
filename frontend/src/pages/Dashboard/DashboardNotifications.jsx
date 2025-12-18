import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    HiOutlineBell,
    HiOutlineCheck,
    HiOutlineTrash,
    HiOutlineShoppingBag,
    HiOutlineTruck,
    HiOutlineCreditCard,
    HiOutlineSpeakerphone,
    HiOutlineArrowLeft
} from 'react-icons/hi';
import api from '../../api/api';
import Skeleton from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

const DashboardNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/notifications/');
            setNotifications(response.data.results || response.data || []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllRead = async () => {
        try {
            await api.post('/notifications/mark_all_read/');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark notifications as read');
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/mark_read/`);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}/`);
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success('Notification deleted');
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const clearAll = async () => {
        try {
            await api.delete('/notifications/clear_all/');
            setNotifications([]);
            toast.success('All notifications cleared');
        } catch (error) {
            toast.error('Failed to clear notifications');
        }
    };

    const getTypeIcon = (type) => {
        const icons = {
            order: HiOutlineShoppingBag,
            payment: HiOutlineCreditCard,
            shipping: HiOutlineTruck,
            promo: HiOutlineSpeakerphone,
            system: HiOutlineBell,
        };
        return icons[type] || HiOutlineBell;
    };

    const getTypeColor = (type) => {
        const colors = {
            order: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
            payment: 'text-green-500 bg-green-100 dark:bg-green-900/30',
            shipping: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
            promo: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
            system: 'text-secondary-500 bg-secondary-100 dark:bg-secondary-700',
        };
        return colors[type] || colors.system;
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-1 text-secondary-500 hover:text-primary-500 mb-2"
                        >
                            <HiOutlineArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Notifications</h1>
                        <p className="text-secondary-500 dark:text-secondary-400">
                            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="flex items-center gap-2 px-4 py-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors"
                            >
                                <HiOutlineCheck className="w-5 h-5" />
                                <span className="hidden sm:inline">Mark all read</span>
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                            >
                                <HiOutlineTrash className="w-5 h-5" />
                                <span className="hidden sm:inline">Clear all</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {isLoading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-secondary-800 rounded-2xl p-5 border border-secondary-100 dark:border-secondary-700">
                                <div className="flex gap-4">
                                    <Skeleton className="w-12 h-12 rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-5 w-1/3" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : notifications.length > 0 ? (
                        notifications.map((notification) => {
                            const Icon = getTypeIcon(notification.type);

                            return (
                                <div
                                    key={notification.id}
                                    className={`bg-white dark:bg-secondary-800 rounded-2xl p-5 border transition-all ${
                                        notification.is_read
                                            ? 'border-secondary-100 dark:border-secondary-700'
                                            : 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${getTypeColor(notification.type)}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className={`font-semibold ${notification.is_read ? 'text-secondary-700 dark:text-secondary-300' : 'text-secondary-900 dark:text-white'}`}>
                                                        {notification.title}
                                                    </h3>
                                                    <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-sm text-secondary-400 dark:text-secondary-500 mt-2">
                                                        {notification.time_ago || new Date(notification.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    {!notification.is_read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <HiOutlineCheck className="w-5 h-5 text-primary-500" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <HiOutlineTrash className="w-5 h-5 text-red-500" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Link Button */}
                                            {notification.link && (
                                                <Link
                                                    to={notification.link}
                                                    className="inline-flex items-center gap-1 mt-3 text-primary-500 hover:text-primary-600 text-sm font-medium"
                                                >
                                                    View Details →
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-12 text-center border border-secondary-100 dark:border-secondary-700">
                            <HiOutlineBell className="w-16 h-16 mx-auto text-secondary-300 dark:text-secondary-600 mb-4" />
                            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                                No notifications
                            </h3>
                            <p className="text-secondary-500 dark:text-secondary-400">
                                You're all caught up! We'll notify you when something happens.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardNotifications;