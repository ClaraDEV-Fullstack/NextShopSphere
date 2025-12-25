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
        { value: '50K+', label: 'Happy Customers' },
        { value: '1000+', label: 'Products' },
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section - More Compact */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 lg:py-20 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                            <HiGlobe className="w-4 h-4" />
                            Made in Cameroon
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                            About NextShopSphere
                        </h1>
                        <p className="text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto">
                            Your trusted online marketplace bringing quality products to every corner of Cameroon.
                            We're on a mission to make online shopping accessible, affordable, and enjoyable for everyone.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section - More Compact */}
            <div className="bg-white dark:bg-secondary-900 py-10 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-3xl lg:text-4xl font-bold text-blue-600 mb-1">{stat.value}</p>
                                <p className="text-sm lg:text-base text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Story Section - More Compact */}
            <section className="py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                                <HiLightningBolt className="w-4 h-4" />
                                Our Story
                            </div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                From Douala to All of Cameroon
                            </h2>
                            <div className="space-y-3 text-gray-600 max-w-2xl mx-auto">
                                <p>
                                    NextShopSphere was founded in 2023 in Douala, Cameroon, with a simple vision:
                                    to bring the convenience of online shopping to every Cameroonian.
                                </p>
                                <p>
                                    We noticed that many people in Cameroon didn't have access to quality products
                                    at fair prices, and those who did often had to travel long distances
                                    to find them.
                                </p>
                                <p>
                                    Today, we deliver to all 10 regions of Cameroon, accept Mobile Money
                                    (MTN MoMo & Orange Money), and have helped thousands of customers discover
                                    products they love.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-6 lg:p-8 lg:ml-8">
                                <img
                                    src="/images/about-store.jpg"
                                    alt="NextShopSphere Store"
                                    className="rounded-2xl shadow-lg w-full"
                                    onError={(e) => {
                                        e.target.src = 'https://media.licdn.com/dms/image/v2/D4D12AQE-ET5TbPBAJg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1695484810521?e=2147483647&v=beta&t=gKiUUK_DTfpwsW-njmhuTbbHe2XSCm3DrY-NKm_HqtU';
                                    }}
                                />
                                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 lg:p-6 lg:ml-8">
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
                </div>
            </section>

            {/* Our Values Section - More Compact */}
            <section className="py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 lg:mb-12">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Our Values</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-8 lg:mb-12">
                            These principles guide everything we do at NextShopSphere
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white dark:bg-secondary-800 rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-3 lg:mb-4">
                                    <value.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg lg:text-xl font-bold text-gray-900">{value.title}</h3>
                                    <p className="text-sm text-gray-600">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section - More Compact */}
            <section className="py-16 lg:py-20 bg-gray-50 dark:bg-secondary-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div>
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                                <div className="text-center">
                                    <h2 className="text-2xl lg:text-3xl font-bold">Why Choose NextShopSphere?</h2>
                                    <ul className="space-y-3 text-left">
                                        {[
                                            'Nationwide delivery across all 10 regions',
                                            'Mobile Money payments (MTN MoMo & Orange Money)',
                                            'Cash on delivery in Douala & Yaoundé',
                                            '7-day return policy',
                                            'Genuine products with quality guarantee',
                                            'Bilingual support (French & English)'
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L5 9l-4 4M7 7l4 4M9 5l4 4" />
                                                    </svg>
                                                </div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="lg:text-right mt-6 lg:mt-8">
                                    <Link
                                        to="/products"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        Start Shopping
                                        <HiArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA Section - More Compact */}
            <section className="py-16 lg:py-20 bg-gray-50 dark:bg-secondary-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="mb-8 lg:mb-12">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Have Questions?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-6 lg:mb-8">
                            Our team is here to help. Contact us anytime and we'll get back to you within 24 hours.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            <HiUserGroup className="w-5 h-5" />
                            Contact Us
                        </Link>
                        <a
                            href="mailto:nextshopsphere@gmail.com"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            nextshopsphere@gmail.com
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;