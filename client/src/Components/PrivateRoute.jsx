import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function PrivateRoute({ children, requiredRole }) {
    const { isAuthenticated, role } = useSelector((state) => state.user);

    // Not logged in → send to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but wrong role → send to their own dashboard
    if (requiredRole && role !== requiredRole) {
        if (role === 'admin') return <Navigate to="/admin/viewLoans" replace />;
        if (role === 'user') return <Navigate to="/user/viewAllLoans" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;
