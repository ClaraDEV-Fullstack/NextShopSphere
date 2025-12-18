// src/pages/About.jsx

import { Link } from 'react-router-dom';
import {
    HiShieldCheck,
    HiTruck,
    HiCurrencyDollar,
    HiUserGroup,
    HiGlobe,
    HiHeart,
    HiLightningBolt,
    HiStar,
    HiArrowRight
} from 'react-icons/hi';

const About = () => {
    const stats = [
        { value: '10K+', label: 'Happy Customers' },
        { value: '500+', label: 'Products' },
        { value: '10', label: 'Regions Covered' },
        { value: '24/7', label: 'Support' }
    ];

    const values = [
        {
            icon: HiShieldCheck,
            title: 'Quality Assurance',
            description: 'We carefully select and verify all products to ensure you receive only the best quality items.'
        },
        {
            icon: HiTruck,
            title: 'Fast Delivery',
            description: 'We deliver across all 10 regions of Cameroon with tracking available for every order.'
        },
        {
            icon: HiCurrencyDollar,
            title: 'Fair Pricing',
            description: 'We offer competitive prices and accept Mobile Money, making shopping accessible to everyone.'
        },
        {
            icon: HiHeart,
            title: 'Customer First',
            description: 'Your satisfaction is our priority. Our support team is always ready to help.'
        }
    ];

    const team = [
        { name: 'Jean-Pierre Kamga', role: 'Founder & CEO', image: '/team/ceo.jpg' },
        { name: 'Marie Nguemo', role: 'Operations Manager', image: '/team/ops.jpg' },
        { name: 'Paul Tchinda', role: 'Customer Success', image: '/team/cs.jpg' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 lg:py-28 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                            <HiGlobe className="w-4 h-4" />
                            Made in Cameroon
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            About NetShopSphere
                        </h1>
                        <p className="text-xl text-blue-100">
                            Your trusted online marketplace bringing quality products to every corner of Cameroon.
                            We're on a mission to make online shopping accessible, affordable, and enjoyable for everyone.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <p className="text-4xl font-bold text-blue-600 mb-1">{stat.value}</p>
                            <p className="text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Our Story */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                                <HiLightningBolt className="w-4 h-4" />
                                Our Story
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                                From Douala to All of Cameroon
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    NetShopSphere was founded in 2023 in Douala, Cameroon, with a simple vision:
                                    to bring the convenience of online shopping to every Cameroonian.
                                </p>
                                <p>
                                    We noticed that many people in Cameroon didn't have access to quality products
                                    at fair prices, and those who did often had to travel long distances to find them.
                                    We set out to change that.
                                </p>
                                <p>
                                    Today, we deliver to all 10 regions of Cameroon, accept Mobile Money payments
                                    (MTN MoMo & Orange Money), and have helped thousands of customers discover
                                    products they love.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8 lg:p-12">
                                <img
                                    src="/images/about-store.jpg"
                                    alt="NetShopSphere Store"
                                    className="rounded-2xl shadow-lg w-full"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600';
                                    }}
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <HiStar className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">4.8 Rating</p>
                                    <p className="text-sm text-gray-500">From 2,000+ reviews</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            These principles guide everything we do at NetShopSphere
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-5">
                                    <value.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold mb-6">Why Choose NetShopSphere?</h2>
                                <ul className="space-y-4">
                                    {[
                                        'Nationwide delivery across all 10 regions',
                                        'Mobile Money payments (MTN MoMo & Orange Money)',
                                        'Cash on delivery in Douala & Yaoundé',
                                        '7-day return policy',
                                        'Genuine products with quality guarantee',
                                        'Bilingual support (French & English)'
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="text-center lg:text-right">
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                                >
                                    Start Shopping
                                    <HiArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                        <HiUserGroup className="w-4 h-4" />
                        Get in Touch
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Have Questions?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Our team is here to help. Contact us anytime and we'll get back to you within 24 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Contact Us
                        </Link>
                        <a
                            href="mailto:nextshopsphere@gmail.com"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
                        >
                            netshopsphere@gmail.com
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;