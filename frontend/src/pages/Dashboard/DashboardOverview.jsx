import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    HiOutlineShoppingBag,
    HiOutlineHeart,
    HiOutlineCog,
    HiOutlineTruck,
    HiOutlineArrowRight,
    HiOutlineSparkles,
    HiOutlineBell,
    HiOutlineClipboardList,
    HiOutlineChevronRight,
    HiOutlineCube
} from 'react-icons/hi';
import api from '../../api/api';
import Skeleton from '../../components/ui/Skeleton';

const StatCard = ({ icon: Icon, label, value, color, bgColor, link, isLoading }) => (
    <Link
        to={link}
        className="group relative bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-secondary-100 dark:border-secondary-700 overflow-hidden"
    >
        {/* Decorative gradient */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${bgColor} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`} />

        <div className="relative flex items-start justify-between">
            <div className="space-y-1">
                {isLoading ? (
                    <>
                        <Skeleton className="h-10 w-20 mb-2 rounded-lg" />
                        <Skeleton className="h-4 w-28 rounded-md" />
                    </>
                ) : (
                    <>
                        <p className={`text-4xl font-bold ${color}`}>{value}</p>
                        <p className="text-secondary-500 dark:text-secondary-400 font-medium">{label}</p>
                    </>
                )}
            </div>
            <div className={`p-4 rounded-2xl ${bgColor} bg-opacity-10 dark:bg-opacity-20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <Icon className={`w-7 h-7 ${color}`} />
            </div>
        </div>

        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </Link>
);

const QuickLinkCard = ({ icon: Icon, label, description, link, color, bgColor }) => (
    <Link
        to={link}
        className="group flex items-center gap-5 p-5 bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-100 dark:border-secondary-700 hover:shadow-lg hover:border-transparent transition-all duration-300"
    >
        <div className={`p-4 rounded-2xl ${bgColor} bg-opacity-10 dark:bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="font-bold text-secondary-900 dark:text-white group-hover:text-primary-500 transition-colors">
                {label}
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">{description}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
            <HiOutlineArrowRight className="w-5 h-5 text-secondary-400 group-hover:text-white transition-colors" />
        </div>
    </Link>
);

const DashboardOverview = () => {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState({
        orders: 0,
        wishlist: 0,
        pending: 0,
        delivered: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);

                const ordersRes = await api.get('/orders/');
                const orders = ordersRes.data.results || ordersRes.data || [];

                const wishlistRes = await api.get('/wishlist/');
                const wishlist = wishlistRes.data.results || wishlistRes.data || [];

                setStats({
                    orders: orders.length,
                    wishlist: wishlist.length,
                    pending: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
                    delivered: orders.filter(o => o.status === 'delivered').length
                });

                setRecentOrders(orders.slice(0, 5));

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
            delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
            cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
        };
        return colors[status] || colors.pending;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-blue-50/30 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-3xl p-8 lg:p-10 text-white overflow-hidden shadow-2xl shadow-blue-500/20">
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
                            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl" />

                            {/* Subtle pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-10 right-20 w-4 h-4 border-2 border-white rounded-full" />
                                <div className="absolute top-20 right-40 w-2 h-2 bg-white rounded-full" />
                                <div className="absolute bottom-10 right-32 w-3 h-3 border border-white rounded-full" />
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full">
                                    <HiOutlineSparkles className="w-5 h-5" />
                                    <span className="text-sm font-medium">{getGreeting()}</span>
                                </div>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                                Welcome back, {user?.first_name || user?.username}! 👋
                            </h1>
                            <p className="text-blue-100 text-lg max-w-xl">
                                Here's what's happening with your account today. Track your orders, manage your wishlist, and more.
                            </p>

                            {/* Quick action buttons */}
                            <div className="flex flex-wrap gap-3 mt-6">
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                                >
                                    Start Shopping
                                    <HiOutlineArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/dashboard/orders"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/25 transition-colors"
                                >
                                    View Orders
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        <StatCard
                            icon={HiOutlineShoppingBag}
                            label="Total Orders"
                            value={stats.orders}
                            color="text-blue-600"
                            bgColor="bg-blue-500"
                            link="/dashboard/orders"
                            isLoading={isLoading}
                        />
                        <StatCard
                            icon={HiOutlineHeart}
                            label="Wishlist Items"
                            value={stats.wishlist}
                            color="text-amber-600"
                            bgColor="bg-amber-500"
                            link="/dashboard/wishlist"
                            isLoading={isLoading}
                        />
                        <StatCard
                            icon={HiOutlineTruck}
                            label="In Progress"
                            value={stats.pending}
                            color="text-indigo-600"
                            bgColor="bg-indigo-500"
                            link="/dashboard/orders"
                            isLoading={isLoading}
                        />
                        <StatCard
                            icon={HiOutlineClipboardList}
                            label="Delivered"
                            value={stats.delivered}
                            color="text-emerald-600"
                            bgColor="bg-emerald-500"
                            link="/dashboard/orders"
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h2 className="text-lg font-bold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <QuickLinkCard
                                icon={HiOutlineBell}
                                label="Notifications"
                                description="Check your latest updates and alerts"
                                link="/dashboard/notifications"
                                color="text-indigo-600"
                                bgColor="bg-indigo-500"
                            />
                            <QuickLinkCard
                                icon={HiOutlineCog}
                                label="Account Settings"
                                description="Manage your profile and preferences"
                                link="/dashboard/settings"
                                color="text-secondary-600"
                                bgColor="bg-secondary-500"
                            />
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white dark:bg-secondary-800 rounded-3xl shadow-sm border border-secondary-100 dark:border-secondary-700 overflow-hidden">
                        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-secondary-100 dark:border-secondary-700 bg-gradient-to-r from-secondary-50 to-white dark:from-secondary-800 dark:to-secondary-800">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <HiOutlineCube className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                                        Recent Orders
                                    </h2>
                                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                        Track and manage your purchases
                                    </p>
                                </div>
                            </div>
                            <Link
                                to="/dashboard/orders"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl transition-colors"
                            >
                                View All
                                <HiOutlineArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="p-6 lg:px-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Skeleton className="w-14 h-14 rounded-2xl" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-5 w-32 rounded-md" />
                                                    <Skeleton className="h-4 w-24 rounded-md" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Skeleton className="h-6 w-20 rounded-md" />
                                                <Skeleton className="h-8 w-24 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : recentOrders.length > 0 ? (
                                recentOrders.map((order, index) => (
                                    <Link
                                        key={order.id}
                                        to={`/orders/${order.id}`}
                                        className="group flex items-center justify-between p-6 lg:px-8 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent dark:hover:from-blue-900/10 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-100 to-secondary-50 dark:from-secondary-700 dark:to-secondary-600 flex items-center justify-center font-bold text-secondary-400 dark:text-secondary-300 group-hover:from-blue-100 group-hover:to-blue-50 group-hover:text-blue-500 transition-all">
                                                #{order.id}
                                            </div>
                                            <div>
                                                <p className="font-bold text-secondary-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    Order #{order.id}
                                                </p>
                                                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 lg:gap-6">
                                            <span className="text-lg font-bold text-secondary-900 dark:text-white">
                                                ${parseFloat(order.total || 0).toFixed(2)}
                                            </span>
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <HiOutlineChevronRight className="w-5 h-5 text-secondary-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all hidden lg:block" />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-12 lg:p-16 text-center">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-secondary-100 to-secondary-50 dark:from-secondary-700 dark:to-secondary-600 flex items-center justify-center">
                                        <HiOutlineShoppingBag className="w-10 h-10 text-secondary-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
                                        No orders yet
                                    </h3>
                                    <p className="text-secondary-500 dark:text-secondary-400 mb-6 max-w-sm mx-auto">
                                        You haven't placed any orders yet. Start shopping to see your orders here.
                                    </p>
                                    <Link
                                        to="/products"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all"
                                    >
                                        Browse Products
                                        <HiOutlineArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile View All */}
                        {recentOrders.length > 0 && (
                            <div className="sm:hidden p-4 border-t border-secondary-100 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50">
                                <Link
                                    to="/dashboard/orders"
                                    className="flex items-center justify-center gap-2 w-full py-3 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                >
                                    View All Orders
                                    <HiOutlineArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;