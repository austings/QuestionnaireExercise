import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ children, redirectTo = "/login" }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // If there is no token, redirect to login page
    return <Navigate to={redirectTo} replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // If the user is not an admin and trying to access /admin, redirect to a different page (e.g., /dashboard)
    if (decoded.admin !== 1 && window.location.pathname === "/admin") {
      return <Navigate to="/dashboard" replace />;
    }

    // If the user is an admin, or they are not an admin and accessing other pages, render the children (requested component)
    return children;

  } catch (err) {
    console.error('Error decoding token:', err);
    return <Navigate to={redirectTo} replace />;
  }
}

export default ProtectedRoute;
