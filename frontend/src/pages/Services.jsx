import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchServices();
  }, [page, category]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (searchQuery) params.q = searchQuery;
      if (category) params.category = category;

      const { data } = await axios.get('/service', { params });
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchServices();
  };

  const categories = [
    'decorator',
    'caterer',
    'musician',
    'photographer',
    'host',
    'venue',
    'other',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Browse Services</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">No services found</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
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
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          ${service.price}
                        </p>
                        <p className="text-sm text-gray-500">{service.priceType}</p>
                      </div>
                      <Link
                        to={`/service/${service._id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        View Details
                      </Link>
                    </div>
                    {service.vendor && (
                      <p className="mt-4 text-sm text-gray-500">
                        by {service.vendor.name}
                        {service.vendor.city && ` - ${service.vendor.city}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-6 py-2 bg-white rounded-lg shadow">
                Page {page}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={services.length < 12}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Services;
