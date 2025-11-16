import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            EVENTORA
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/services" className="text-gray-700 hover:text-blue-600 transition">
              Services
            </Link>

            {user ? (
              <>
                {user.role === 'vendor' && (
                  <Link to="/vendor/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                    Dashboard
                  </Link>
                )}
                {user.role === 'client' && (
                  <Link to="/client/events" className="text-gray-700 hover:text-blue-600 transition">
                    My Events
                  </Link>
                )}
                <span className="text-sm text-gray-600">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
