import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axios';

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedServiceId = location.state?.serviceId;

  const [formData, setFormData] = useState({
    eventType: 'marriage',
    eventDate: '',
    venueAddress: '',
    budget: '',
    numberOfGuests: '',
    notes: '',
  });
  const [selectedServices, setSelectedServices] = useState(
    preSelectedServiceId ? [preSelectedServiceId] : []
  );
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get('/service', { params: { limit: 100 } });
      setAvailableServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (selectedServices.length === 0) {
      setError('Please select at least one service');
      setLoading(false);
      return;
    }

    try {
      const eventData = {
        ...formData,
        budget: Number(formData.budget),
        numberOfGuests: Number(formData.numberOfGuests),
        services: selectedServices,
      };

      await axios.post('/event', eventData);
      navigate('/client/events');
    } catch (err) {
      setError(err.response?.data || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = [
    { value: 'marriage', label: 'Marriage' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'get_together', label: 'Get Together' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:underline"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Address
              </label>
              <input
                type="text"
                name="venueAddress"
                value={formData.venueAddress}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Event venue address"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget ($)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special requirements or notes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Services ({selectedServices.length} selected)
              </label>
              <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg p-4">
                {availableServices.length === 0 ? (
                  <p className="text-gray-500">No services available</p>
                ) : (
                  <div className="space-y-2">
                    {availableServices.map((service) => (
                      <label
                        key={service._id}
                        className="flex items-start p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service._id)}
                          onChange={() => toggleService(service._id)}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{service.title}</p>
                          <p className="text-sm text-gray-600">{service.category}</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            ${service.price} ({service.priceType})
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
