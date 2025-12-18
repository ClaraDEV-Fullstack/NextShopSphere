// src/pages/Contact.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    HiMail,
    HiPhone,
    HiLocationMarker,
    HiClock,
    HiChatAlt2,
    HiUser,
    HiGlobe,
    HiOfficeBuilding,
    HiCheckCircle,
    HiArrowRight,
    HiQuestionMarkCircle
} from 'react-icons/hi';
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { FaGithub, FaLinkedin, FaBehance } from 'react-icons/fa';
const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setIsSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: HiMail,
            title: 'Email Us',
            value: 'nextshopsphere@gmail.com',
            link: 'mailto:nextshopsphere@gmail.com',
            description: 'We respond within 24 hours'
        },
        {
            icon: HiPhone,
            title: 'Call Us',
            value: '+237 683 669 723',
            link: 'tel:+237683669723',
            description: 'Mon-Sat from 8am to 6pm WAT'
        },
        {
            icon: FaWhatsapp,
            title: 'WhatsApp',
            value: '+237 699 876 543',
            link: 'https://wa.me/237683669723',
            description: 'Chat with us instantly'
        },
        {
            icon: HiLocationMarker,
            title: 'Visit Us',
            value: 'Rue de la Joie, Akwa, Douala',
            link: 'https://maps.google.com/?q=Akwa,Douala,Cameroon',
            description: 'Cameroon, Central Africa'
        }
    ];

    const faqs = [
        {
            question: 'How can I track my order?',
            answer: 'Once your order is shipped, you will receive a tracking number via SMS and email. You can use this number on our website or contact us directly for updates.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept Mobile Money (MTN MoMo, Orange Money), bank transfers, and cash on delivery within Douala and Yaoundé.'
        },
        {
            question: 'Do you deliver across Cameroon?',
            answer: 'Yes! We deliver to all 10 regions of Cameroon. Delivery times vary: 1-2 days for Douala/Yaoundé, 3-5 days for other major cities, and 5-7 days for remote areas.'
        },
        {
            question: 'What is your return policy?',
            answer: 'We offer a 7-day return policy for unused items in original packaging. Please visit our Returns page for more details or contact customer support.'
        }
    ];

    // Fixed: Use component references, not JSX elements
    const socialLinks = [
        { icon: FaGithub, name: 'GitHub', url: 'https://github.com/ClaraDEV-Fullstack', color: 'hover:bg-gray-700' },
        { icon: FaLinkedin, name: 'LinkedIn', url: 'https://linkedin.com/in/clara-beri-794097217/', color: 'hover:bg-blue-600' },
        { icon: FaWhatsapp, name: 'WhatsApp', url: 'https://wa.me/237683669723', color: 'hover:bg-green-600' },
        { icon: FaBehance, name: 'Behance', url: 'https://behance.net/claraberi', color: 'hover:bg-blue-500' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                            <HiChatAlt2 className="w-4 h-4" />
                            We're here to help
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Have questions about your order, our products, or anything else?
                            Our friendly team in Cameroon is ready to assist you.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="mailto:netshopsphere@gmail.com"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                            >
                                <HiMail className="w-5 h-5" />
                                Email Us
                            </a>
                            <a
                                href="https://wa.me/237683669723"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                            >
                                <FaWhatsapp className="w-5 h-5" />
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Contact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 mb-16 relative z-10">
                    {contactInfo.map((info, index) => (
                        <a
                            key={index}
                            href={info.link}
                            target={info.link.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="group bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border border-gray-100 hover:border-blue-200"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <info.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                            <p className="text-blue-600 font-medium mb-1 group-hover:text-blue-700">{info.value}</p>
                            <p className="text-sm text-gray-500">{info.description}</p>
                        </a>
                    ))}
                </div>

                <div className="grid lg:grid-cols-5 gap-12 mb-16">
                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100">
                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <HiCheckCircle className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h3>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        Thank you for contacting us. Our team will review your message and get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                                            <HiChatAlt2 className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
                                            <p className="text-gray-500">Fill out the form below and we'll respond promptly</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Full Name *
                                                </label>
                                                <div className="relative">
                                                    <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        placeholder="John Doe"
                                                        required
                                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Email Address *
                                                </label>
                                                <div className="relative">
                                                    <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="you@example.com"
                                                        required
                                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <div className="relative">
                                                    <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="tel"
                                                        id="phone"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="+237 6XX XXX XXX"
                                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Subject *
                                                </label>
                                                <select
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                                                >
                                                    <option value="">Select a topic</option>
                                                    <option value="order">Order Inquiry</option>
                                                    <option value="product">Product Question</option>
                                                    <option value="shipping">Shipping & Delivery</option>
                                                    <option value="returns">Returns & Refunds</option>
                                                    <option value="payment">Payment Issues</option>
                                                    <option value="partnership">Business Partnership</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Your Message *
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Tell us how we can help you..."
                                                rows={5}
                                                required
                                                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <HiArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Business Hours */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                                    <HiClock className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Business Hours</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Monday - Friday</span>
                                    <span className="font-semibold text-gray-900">8:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Saturday</span>
                                    <span className="font-semibold text-gray-900">9:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Sunday</span>
                                    <span className="font-semibold text-amber-600">Closed</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">
                                * All times are in West Africa Time (WAT)
                            </p>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <HiGlobe className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Follow Us</h3>
                            </div>
                            <p className="text-gray-600 mb-4">Stay connected for updates, offers, and more!</p>
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 ${social.color} hover:text-white transition-all`}
                                        title={social.name}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Returns & Refunds', link: '/returns' },
                                    { label: 'FAQs', link: '/faq' },
                                    { label: 'Track Your Order', link: '/dashboard/orders' }
                                ].map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.link}
                                        className="flex items-center justify-between py-2 border-b border-white/20 hover:border-white/40 transition-colors group"
                                    >
                                        <span>{item.label}</span>
                                        <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-16">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                            <HiQuestionMarkCircle className="w-4 h-4" />
                            Common Questions
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
                        <p className="text-gray-600">Can't find what you're looking for? <Link to="/faq" className="text-blue-600 hover:underline">View all FAQs</Link></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-start gap-3">
                                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                        {index + 1}
                                    </span>
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 ml-11">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Map Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-6 lg:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                                    <HiOfficeBuilding className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Our Store Location</h2>
                                    <p className="text-gray-500">Visit us in Douala, Cameroon</p>
                                </div>
                            </div>
                            <a
                                href="https://maps.google.com/?q=Akwa,Douala,Cameroon"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                <HiLocationMarker className="w-5 h-5" />
                                Get Directions
                            </a>
                        </div>
                    </div>

                    {/* Embedded Google Map */}
                    <div className="h-96">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15919.247234098074!2d9.692659!3d4.050419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1061128c15fb1f2f%3A0x4d7c8e0e18c0e0d0!2sAkwa%2C%20Douala%2C%20Cameroon!5e0!3m2!1sen!2sus!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="NetShopSphere Location - Douala, Cameroon"
                        />
                    </div>

                    {/* Address Footer */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-gray-900">NextShopSphere Cameroon</p>
                                <p className="text-gray-600">Rue de la Joie, Akwa, Douala, Cameroon</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <a href="tel:+237683669723" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                                    <HiPhone className="w-4 h-4" />
                                    +237 683 669 723
                                </a>
                                <span className="text-gray-300 hidden sm:inline">|</span>
                                <a href="mailto:nextshopsphere@gmail.com" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                                    <HiMail className="w-4 h-4" />
                                    nextshopsphere@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;