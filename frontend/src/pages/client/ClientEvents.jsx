import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

const ClientEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const { data } = await axios.get('/event/account');
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getEventTypeLabel = (type) => {
    const types = {
      marriage: 'Marriage',
      engagement: 'Engagement',
      birthday: 'Birthday',
      meeting: 'Meeting',
      get_together: 'Get Together',
      other: 'Other',
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Events</h1>
          <Link
            to="/client/create-event"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            + Create New Event
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              You haven't created any events yet
            </p>
            <Link
              to="/client/create-event"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {getEventTypeLabel(event.eventType)}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>

                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Date:</strong> {event.eventDate}
                  </p>
                  <p>
                    <strong>Venue:</strong> {event.venueAddress}
                  </p>
                  <p>
                    <strong>Guests:</strong> {event.numberOfGuests}
                  </p>
                  <p>
                    <strong>Budget:</strong> ${event.budget}
                  </p>
                  {event.finalCost && (
                    <p>
                      <strong>Final Cost:</strong> ${event.finalCost}
                    </p>
                  )}
                  <p>
                    <strong>Services:</strong> {event.services?.length || 0}
                  </p>
                  {event.coordinator && (
                    <p>
                      <strong>Coordinator:</strong> {event.coordinator.name}
                    </p>
                  )}
                </div>

                {event.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">{event.notes}</p>
                  </div>
                )}

                <Link
                  to={`/client/event/${event._id}`}
                  className="mt-4 block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientEvents;
