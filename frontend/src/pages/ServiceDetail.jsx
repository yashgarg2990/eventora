import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const ServiceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const { data } = await axios.get(`/service/${id}`);
      setService(data);
    } catch (error) {
      console.error('Failed to fetch service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'client') {
      alert('Only clients can book services');
      return;
    }
    navigate('/client/create-event', { state: { serviceId: id } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Service not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:underline"
        >
          ← Back to Services
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {service.photos && service.photos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {service.photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`${service.title} ${idx + 1}`}
                  className="w-full h-64 object-cover"
                />
              ))}
            </div>
          )}

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h1>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {service.category}
                </span>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-gray-900">${service.price}</p>
                <p className="text-gray-600">{service.priceType}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </div>

            {service.perks && service.perks.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Features</h2>
                <ul className="grid md:grid-cols-2 gap-3">
                  {service.perks.map((perk, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.availability && service.availability.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Availability
                </h2>
                <p className="text-gray-700">
                  Available on: {service.availability.join(', ')}
                </p>
              </div>
            )}

            {service.vendor && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Vendor Information
                </h2>
                <p className="text-gray-700">
                  <strong>Name:</strong> {service.vendor.name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {service.vendor.email}
                </p>
                {service.vendor.phone && (
                  <p className="text-gray-700">
                    <strong>Phone:</strong> {service.vendor.phone}
                  </p>
                )}
                {service.vendor.city && (
                  <p className="text-gray-700">
                    <strong>City:</strong> {service.vendor.city}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleBookService}
              className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Book This Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
