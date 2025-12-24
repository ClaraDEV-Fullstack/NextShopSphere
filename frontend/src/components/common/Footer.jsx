import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    HiMail,
    HiPhone,
    HiLocationMarker,
    HiShoppingBag,
    HiShieldCheck,
    HiOutlineArrowRight,
    HiHeart,
    HiCheckCircle,
    HiOutlineExternalLink
} from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaWhatsapp, FaBehance } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsSubscribing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Thanks for subscribing! Check your inbox.');
        setEmail('');
        setIsSubscribing(false);
    };

    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: FaGithub, name: 'GitHub', url: 'https://github.com/ClaraDEV-Fullstack', color: 'hover:bg-gray-700' },
        { icon: FaLinkedin, name: 'LinkedIn', url: 'https://linkedin.com/in/clara-beri-794097217/', color: 'hover:bg-blue-600' },
        { icon: FaWhatsapp, name: 'WhatsApp', url: 'https://wa.me/237683669723', color: 'hover:bg-green-600' },
        { icon: FaBehance, name: 'Behance', url: 'https://behance.net/claraberi', color: 'hover:bg-blue-500' }
    ];

    const shopLinks = [
        { label: 'All Products', path: '/products' },
        { label: 'New Arrivals', path: '/products?sort=newest' },
        { label: 'Best Sellers', path: '/products?sort=popular' },
        { label: 'On Sale', path: '/products?on_sale=true' },
        { label: 'Categories', path: '/categories' }
    ];

    const supportLinks = [
        { label: 'Contact Us', path: '/contact' },
        { label: 'FAQ', path: '/faq' },
        { label: 'About Us', path: '/about' },
        { label: 'Returns & Refunds', path: '/returns' },
        { label: 'Track Order', path: '/dashboard/orders' }
    ];

    return (
        <footer className="bg-gray-900 text-gray-300 relative overflow-hidden text-sm">
            {/* Main Footer */}
            <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        <Link to="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">N</span>
                            </div>
                            <span className="text-xl font-bold">
                                <span className="text-blue-400">Next</span>
                                <span className="text-green-500">Shop</span>
                                <span className="text-amber-400">Sphere</span>
                            </span>
                        </Link>

                        <p className="text-gray-400 mb-4 leading-snug text-sm">
                            Your trusted marketplace in Cameroon. Quality products, secure payments, and fast delivery.
                        </p>

                        <div className="flex gap-2">
                            {socialLinks.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-gray-400 hover:text-white ${social.color} transition-all`}
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold mb-3 flex items-center gap-1">
                            <HiShoppingBag className="w-4 h-4 text-blue-400" /> Shop
                        </h4>
                        <ul className="space-y-1">
                            {shopLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <HiOutlineArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold mb-3 flex items-center gap-1">
                            <HiShieldCheck className="w-4 h-4 text-blue-400" /> Support
                        </h4>
                        <ul className="space-y-1">
                            {supportLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <HiOutlineArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & WhatsApp */}
                    <div className="lg:col-span-4 space-y-3">
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <h4 className="text-white font-bold mb-1 flex items-center gap-1">
                                <HiMail className="w-4 h-4 text-blue-400" /> Subscribe
                            </h4>
                            <p className="text-gray-400 text-xs mb-2">
                                Exclusive deals and offers delivered to your inbox.
                            </p>
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSubscribing}
                                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded flex items-center justify-center gap-1 disabled:opacity-70"
                                >
                                    {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                                    {!isSubscribing && <HiOutlineArrowRight className="w-4 h-4" />}
                                </button>
                            </form>
                        </div>

                        <a
                            href="https://wa.me/237683669723"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-green-600/10 border border-green-600/30 rounded hover:bg-green-600/20 transition-colors"
                        >
                            <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                                <FaWhatsapp className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-semibold text-xs">Chat with us</p>
                                <p className="text-green-400 text-[10px]">Quick responses, 24/7</p>
                            </div>
                            <HiOutlineExternalLink className="w-4 h-4 text-green-400" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 bg-black/20">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                    <span>© {currentYear} NextShopSphere. All rights reserved.</span>
                    <span className="flex items-center gap-1">
                        Made with <HiHeart className="w-3 h-3 text-red-500" /> in Cameroon
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
