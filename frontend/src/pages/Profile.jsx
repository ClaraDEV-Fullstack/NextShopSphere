import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiUser, HiMail, HiPhone, HiLocationMarker, HiPencil, HiCheck, HiX, HiCamera, HiShieldCheck, HiPhotograph, HiUpload } from 'react-icons/hi';
import { authAPI } from '../api/api';
import { loadUser } from '../store/authSlice';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        city: '',
        country: '',
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                country: user.country || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                country: user.country || '',
            });
        }
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const dataToSend = {};
            Object.keys(formData).forEach(key => {
                if (formData[key] !== undefined) {
                    dataToSend[key] = formData[key];
                }
            });

            await authAPI.updateProfile(dataToSend);
            await dispatch(loadUser());

            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            const errorMessage = error.response?.data
                ? Object.values(error.response.data).flat().join(' ')
                : 'Failed to update profile';

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (file) => {
        if (!file) return;

        if (!file.type.match('image.*')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const uploadImage = async () => {
        if (!fileInputRef.current?.files[0] && !previewImage) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', fileInputRef.current.files[0]);

        try {
            await authAPI.updateProfilePicture(formData);
            await dispatch(loadUser());

            toast.success('Profile picture updated successfully!');
            setShowAvatarModal(false);
            setPreviewImage(null);
        } catch (error) {
            const errorMessage = error.response?.data?.avatar?.[0] ||
                error.response?.data?.detail ||
                'Failed to upload profile picture';
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const cancelUpload = () => {
        setShowAvatarModal(false);
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                        <Loader size="lg" />
                    </div>
                    <p className="text-gray-500 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-8 lg:py-12">
            {/* Avatar Upload Modal */}
            {showAvatarModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                        <HiPhotograph className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Update Photo</h3>
                                        <p className="text-sm text-gray-500">Choose a new profile picture</p>
                                    </div>
                                </div>
                                <button
                                    onClick={cancelUpload}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <HiX className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Upload Area */}
                        <div className="p-6">
                            {previewImage ? (
                                <div className="text-center">
                                    <div className="relative inline-block mb-4">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                                        />
                                        <button
                                            onClick={() => {
                                                setPreviewImage(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors shadow-lg"
                                        >
                                            <HiX className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">Looking good! Ready to upload?</p>
                                </div>
                            ) : (
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={triggerFileInput}
                                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                                        dragActive
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                    }`}
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <HiUpload className={`w-8 h-8 ${dragActive ? 'text-blue-600' : 'text-blue-500'}`} />
                                    </div>
                                    <p className="font-semibold text-gray-700 mb-1">
                                        {dragActive ? 'Drop your image here' : 'Drag & drop your photo'}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-3">or click to browse</p>
                                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                            <button
                                onClick={cancelUpload}
                                className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={uploadImage}
                                disabled={!previewImage || isUploading}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <HiCheck className="w-5 h-5" />
                                        Upload Photo
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-500 mt-2">Manage your account information and preferences</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sidebar - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                            {/* Cover Pattern */}
                            <div className="h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                {/* Avatar */}
                                <div className="relative -mt-14 mb-4">
                                    <div className="relative inline-block">
                                        <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <HiUser className="w-12 h-12 text-blue-500" />
                                            )}
                                        </div>

                                        {/* Camera Button */}
                                        <button
                                            onClick={() => setShowAvatarModal(true)}
                                            className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center group"
                                        >
                                            <HiCamera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                                        {user.first_name || user.username} {user.last_name}
                                    </h2>
                                    <p className="text-gray-500">{user.email}</p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {new Date().getFullYear() - new Date(user.created_at).getFullYear() || '< 1'}
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium">Years Member</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 text-center">
                                        <div className="flex items-center justify-center gap-1 text-emerald-600">
                                            <HiShieldCheck className="w-5 h-5" />
                                            <span className="font-bold">Verified</span>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium">Account Status</p>
                                    </div>
                                </div>

                                {/* Member Since */}
                                <div className="text-center pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500">
                                        Member since <span className="font-semibold text-gray-700">{new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Upload Card */}
                        <div className="mt-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative">
                                <HiPhotograph className="w-8 h-8 mb-3 opacity-80" />
                                <h3 className="font-bold mb-1">Update Your Photo</h3>
                                <p className="text-sm text-blue-100 mb-4">Add a photo to personalize your account</p>
                                <button
                                    onClick={() => setShowAvatarModal(true)}
                                    className="w-full py-2.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                                >
                                    Choose Photo
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Profile Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Information Card */}
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                            {/* Card Header */}
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                            <HiUser className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                                            <p className="text-gray-500 text-sm">Update your personal details</p>
                                        </div>
                                    </div>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                                        >
                                            <HiPencil className="w-4 h-4" />
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleCancel}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                        >
                                            <HiX className="w-4 h-4" />
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Form */}
                            <div className="p-6 lg:p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name Fields */}
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your first name"
                                                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your last name"
                                                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Email (Read-only) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="w-full px-4 py-3.5 pl-12 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                                                <HiMail className="w-full h-full" />
                                            </div>
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-md font-medium">
                                                Locked
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">Email cannot be changed for security reasons</p>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="+1 (555) 123-4567"
                                                className="w-full px-4 py-3.5 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 font-medium"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                                                <HiPhone className="w-full h-full" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="px-4 bg-white text-sm text-gray-400 font-medium">Address Information</span>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Street Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="123 Main Street, Apt 4B"
                                                className="w-full px-4 py-3.5 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 font-medium"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                                                <HiLocationMarker className="w-full h-full" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* City & Country */}
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="New York"
                                                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="United States"
                                                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    {isEditing && (
                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-70"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Saving Changes...
                                                    </>
                                                ) : (
                                                    <>
                                                        <HiCheck className="w-5 h-5" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Security Card */}
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                            <div className="p-6 lg:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                                        <HiShieldCheck className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Account Security</h3>
                                        <p className="text-gray-500 mb-6">
                                            Your account is protected with industry-standard security measures.
                                            We use encryption to keep your data safe.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { label: 'Email Verified', color: 'emerald' },
                                                { label: 'Secure Connection', color: 'blue' },
                                                { label: 'Data Encrypted', color: 'indigo' }
                                            ].map((badge) => (
                                                <span
                                                    key={badge.label}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-${badge.color}-50 text-${badge.color}-700 rounded-lg text-sm font-medium`}
                                                >
                                                    <HiCheck className="w-4 h-4" />
                                                    {badge.label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;