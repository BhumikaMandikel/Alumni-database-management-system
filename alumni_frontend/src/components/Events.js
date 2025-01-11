import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events...');
        const response = await axios.get('http://localhost:5000/api/events');

        if (!response.data) {
          throw new Error('No data received');
        }

        console.log('Events received:', response.data);
        setEvents(response.data);
      } catch (error) {
        console.error('Error details:', error);
        setError(error.response?.data?.message || 'Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDetailsClick = (eventId) => {
    navigate(`/events/${eventId}`); // Navigate to event details
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Events List</h2>
        <p>No events found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Events List</h2>
      <div className="grid gap-4">
        {events.map(event => (
          <div 
            key={event.event_id} 
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{event.name || 'Untitled Event'}</h3>
            <div className="space-y-2">
              {event.location && <p><strong>Location:</strong> {event.location}</p>}
              {event.type && <p><strong>Type:</strong> {event.type}</p>}
              {event.date && (
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              )}
              {event.rsvp_count !== undefined && (
                <p><strong>RSVP Count:</strong> {event.rsvp_count}</p>
              )}
              {event.max_capacity && (
                <p><strong>Max Capacity:</strong> {event.max_capacity}</p>
              )}
              {event.special_guests && (
                <p><strong>Special Guests:</strong> {event.special_guests}</p>
              )}
              <button onClick={() => handleDetailsClick(event.event_id)} className="mt-2 text-blue-600 hover:underline">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
