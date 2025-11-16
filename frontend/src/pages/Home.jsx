import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to EVENTORA
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your one-stop platform for all event management needs
          </p>

          {!user && (
            <div className="flex justify-center gap-4">
              <Link
                to="/register?role=client"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
              >
                Book Services
              </Link>
              <Link
                to="/register?role=vendor"
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition"
              >
                Become a Vendor
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">For Clients</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Browse and book services for your events
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Find decorators, caterers, photographers, and more
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Manage all your events in one place
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Get personalized event coordination
              </li>
            </ul>
            <Link
              to="/services"
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Services
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">For Vendors</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                List your services and reach more clients
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Manage bookings and availability
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Build your reputation with reviews
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Grow your event services business
              </li>
            </ul>
            <Link
              to="/register?role=vendor"
              className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Join as Vendor
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Service Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Decorator', 'Caterer', 'Musician', 'Photographer', 'Host', 'Venue', 'Other'].map(
              (category) => (
                <div
                  key={category}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                >
                  <p className="font-semibold text-gray-800">{category}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
