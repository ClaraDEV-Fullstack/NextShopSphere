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
        toast.success('Thanks for subscribing! Check your inbox for confirmation.');
        setEmail('');
        setIsSubscribing(false);
    };

    const currentYear = new Date().getFullYear();

    // Fixed: Use component references, not JSX elements
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
        <footer className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-300 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
            </div>

            {/* Main Footer Content */}
            <div className="relative max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        {/* Logo */}
                        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                                <span className="text-white font-bold text-xl">N</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold">
                                    <span className="text-blue-400">Next</span>
                                    <span className="text-green-500">Shop</span>
                                    <span className="text-amber-400">Sphere</span>
                                </span>
                            </div>
                        </Link>

                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Your trusted online marketplace in Cameroon. We bring quality products
                            to your doorstep with secure payments via Mobile Money and fast nationwide delivery.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-2">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white ${social.color} transition-all`}
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <HiShoppingBag className="w-5 h-5 text-blue-400" />
                            Shop
                        </h4>
                        <ul className="space-y-3">
                            {shopLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <HiOutlineArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <HiShieldCheck className="w-5 h-5 text-blue-400" />
                            Support
                        </h4>
                        <ul className="space-y-3">
                            {supportLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <HiOutlineArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-4">
                        {/* Newsletter */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-2xl p-6 border border-gray-800">
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                <HiMail className="w-5 h-5 text-blue-400" />
                                Subscribe to Our Newsletter
                            </h4>
                            <p className="text-gray-400 text-sm mb-4">
                                Get exclusive deals, new arrivals, and special offers delivered to your inbox.
                            </p>
                            <form onSubmit={handleSubscribe} className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubscribing}
                                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isSubscribing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Subscribing...
                                        </>
                                    ) : (
                                        <>
                                            Subscribe Now
                                            <HiOutlineArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 mt-3 flex items-start gap-1.5">
                                <HiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                We respect your privacy. Unsubscribe anytime.
                            </p>
                        </div>

                        {/* WhatsApp CTA */}
                        <a
                            href="https://wa.me/237683669723"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 flex items-center gap-3 p-4 bg-green-600/10 border border-green-600/30 rounded-xl hover:bg-green-600/20 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                                <FaWhatsapp className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-semibold">Chat with us on WhatsApp</p>
                                <p className="text-green-400 text-sm">Quick responses, 24/7</p>
                            </div>
                            <HiOutlineExternalLink className="w-5 h-5 text-green-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Payment Methods & Trust Section */}
            <div className="relative border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        {/* Payment Methods */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <span className="text-gray-500 text-sm">We Accept:</span>
                            <div className="flex flex-wrap justify-center gap-2">
                                <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2">
                                    <span className="text-xs font-bold text-amber-400">MTN</span>
                                    <span className="text-xs text-amber-400/70">MoMo</span>
                                </div>
                                <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center gap-2">
                                    <span className="text-xs font-bold text-orange-400">Orange</span>
                                    <span className="text-xs text-orange-400/70">Money</span>
                                </div>
                                <div className="px-3 py-2 bg-gray-800 rounded-lg">
                                    <span className="text-xs font-bold text-blue-400">VISA</span>
                                </div>
                                <div className="px-3 py-2 bg-gray-800 rounded-lg">
                                    <span className="text-xs font-bold text-red-400">Mastercard</span>
                                </div>
                                <div className="px-3 py-2 bg-gray-800 rounded-lg">
                                    <span className="text-xs font-bold text-blue-300">PayPal</span>
                                </div>
                                <div className="px-3 py-2 bg-gray-800 rounded-lg">
                                    <span className="text-xs font-bold text-gray-400">COD</span>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <HiShieldCheck className="w-5 h-5 text-green-500" />
                                <span>Secure Checkout</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <HiCheckCircle className="w-5 h-5 text-blue-500" />
                                <span>Verified Seller</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative border-t border-gray-800 bg-black/30">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <span>© {currentYear} NetShopSphere.</span>
                            <span className="hidden sm:inline">All rights reserved.</span>
                            <span className="hidden sm:inline text-gray-700">|</span>
                            <span className="hidden sm:inline flex items-center gap-1">
                                Made with <HiHeart className="w-4 h-4 text-red-500" /> in Cameroon
                            </span>
                        </div>

                        {/* Legal Links */}
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-gray-500 hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                            <Link to="/about" className="text-gray-500 hover:text-white transition-colors">
                                About us
                            </Link>
                            <Link to="/returns" className="text-gray-500 hover:text-white transition-colors">
                                Refund Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;