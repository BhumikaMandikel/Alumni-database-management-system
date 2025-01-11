import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EventList() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch events.');
    }
  };

  const handleDeleteEvent = async (eventName) => {
    try {
      await axios.delete('http://localhost:5000/api/delete-event', {
        data: { name: eventName }
      });
      setEvents(events.filter(event => event.name !== eventName));
    } catch (error) {
      console.error(error);
      setError('Failed to delete event.');
    }
  };

  return (
    <div>
      <h3>Upcoming Events</h3>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Location</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.name}>
              <td>{event.name}</td>
              <td>{event.date}</td>
              <td>{event.location}</td>
              <td>{event.description}</td>
              <td>
                <button onClick={() => handleDeleteEvent(event.name)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EventList;
