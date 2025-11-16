import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyServices();
  }, []);

  const fetchMyServices = async () => {
    try {
      const { data } = await axios.get('/service/account');
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await axios.delete('/service', { data: { serviceId } });
      setServices(services.filter((s) => s._id !== serviceId));
    } catch (error) {
      alert('Failed to delete service');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
          </div>
          <Link
            to="/vendor/add-service"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            + Add New Service
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              You haven't added any services yet
            </p>
            <Link
              to="/vendor/add-service"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Add Your First Service
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {service.photos && service.photos.length > 0 && (
                  <img
                    src={service.photos[0]}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.title}
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {service.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gray-900">
                      ${service.price}
                    </p>
                    <p className="text-sm text-gray-500">{service.priceType}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/vendor/edit-service/${service._id}`}
                      className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
