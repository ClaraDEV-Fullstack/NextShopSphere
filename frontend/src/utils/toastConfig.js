import toast from 'react-hot-toast';

// Toast helper functions
export const toastConfig = {
    // Success messages
    success: (message, options = {}) => {
        return toast.success(message, {
            duration: 5000,
            ...options
        });
    },

    // Error messages
    error: (message, options = {}) => {
        return toast.error(message || 'Something went wrong', {
            duration: 5000,
            ...options
        });
    },

    // Info messages
    info: (message, options = {}) => {
        return toast(message, {
            icon: 'ℹ️',
            duration: 4000,
            style: {
                background: '#3b82f6',
                color: '#fff',
            },
            ...options
        });
    },

    // Warning messages
    warning: (message, options = {}) => {
        return toast(message, {
            icon: '⚠️',
            duration: 4000,
            style: {
                background: '#f59e0b',
                color: '#fff',
            },
            ...options
        });
    },

    // Promise-based toast
    promise: (promise, messages, options = {}) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading || 'Loading...',
                success: messages.success || 'Success!',
                error: messages.error || 'Error occurred',
            },
            {
                style: {
                    minWidth: '250px',
                },
                ...options
            }
        );
    },

    // Custom loading with ID for later dismissal
    loading: (message) => {
        return toast.loading(message);
    },

    // Dismiss a specific toast
    dismiss: (toastId) => {
        toast.dismiss(toastId);
    },

    // Dismiss all toasts
    dismissAll: () => {
        toast.dismiss();
    }
};

// Export specific toast types for quick access
export const showSuccess = toastConfig.success;
export const showError = toastConfig.error;
export const showInfo = toastConfig.info;
export const showWarning = toastConfig.warning;
export const showPromise = toastConfig.promise;