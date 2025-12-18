import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;