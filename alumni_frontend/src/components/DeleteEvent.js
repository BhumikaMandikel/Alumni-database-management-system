import React, { useState } from 'react';
import axios from 'axios';

function DeleteEvent() {
  const [eventName, setEventName] = useState('');
  const [error, setError] = useState('');

  const handleDeleteEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.delete('http://localhost:5000/api/delete-event', {
        data: { name: eventName }
      });
      alert('Event deleted successfully');
      setEventName('');
    } catch (error) {
      console.error(error);
      setError('Failed to delete event.');
    }
  };

  return (
    <div>
      <h3>Delete Event</h3>
      {error && <p>{error}</p>}
      <form onSubmit={handleDeleteEvent}>
        <input 
          type="text" 
          placeholder="Event Name to Delete" 
          value={eventName} 
          onChange={(e) => setEventName(e.target.value)} 
          required 
        />
        <button type="submit">Delete Event</button>
      </form>
    </div>
  );
}

export default DeleteEvent;
