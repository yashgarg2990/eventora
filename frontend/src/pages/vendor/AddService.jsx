import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const AddService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'decorator',
    description: '',
    price: '',
    priceType: 'fixed',
    perks: '',
    availability: '',
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    try {
      const { data } = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPhotos([...photos, ...data]);
    } catch (error) {
      alert('Failed to upload photos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const serviceData = {
        ...formData,
        price: Number(formData.price),
        perks: formData.perks.split(',').map((p) => p.trim()).filter(Boolean),
        availability: formData.availability.split(',').map((d) => d.trim()).filter(Boolean),
        photos,
      };

      await axios.post('/service', serviceData);
      navigate('/vendor/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Failed to create service');
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Service</h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Professional Wedding Photography"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your service in detail"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type
                </label>
                <select
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fixed">Fixed</option>
                  <option value="per_head">Per Head</option>
                  <option value="package">Package</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features (comma-separated)
              </label>
              <input
                type="text"
                name="perks"
                value={formData.perks}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="High-quality cameras, Professional editing, 2 photographers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability (comma-separated dates)
              </label>
              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2024-12-25, 2024-12-31"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photos
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating Service...' : 'Create Service'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddService;
