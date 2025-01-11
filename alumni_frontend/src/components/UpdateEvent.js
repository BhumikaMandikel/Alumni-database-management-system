import React, { useState } from 'react';
import axios from 'axios';

function UpdateEvent() {
  const [updateEvent, setUpdateEvent] = useState({ name: '', date: '', location: '', description: '' });
  const [error, setError] = useState('');

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/update-event', updateEvent);
      alert('Event updated successfully');
      setUpdateEvent({ name: '', date: '', location: '', description: '' });
    } catch (error) {
      console.error(error);
      setError('Failed to update event.');
    }
  };

  return (
    <div>
      <h3>Update Event</h3>
      {error && <p>{error}</p>}
      <form onSubmit={handleUpdateEvent}>
        <input 
          type="text" 
          placeholder="Event Name to Update" 
          value={updateEvent.name} 
          onChange={(e) => setUpdateEvent({ ...updateEvent, name: e.target.value })} 
          required 
        />
        <input 
          type="date" 
          value={updateEvent.date} 
          onChange={(e) => setUpdateEvent({ ...updateEvent, date: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Location" 
          value={updateEvent.location} 
          onChange={(e) => setUpdateEvent({ ...updateEvent, location: e.target.value })} 
          required 
        />
        <textarea 
          placeholder="Description" 
          value={updateEvent.description} 
          onChange={(e) => setUpdateEvent({ ...updateEvent, description: e.target.value })} 
          required 
        />
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
}

export default UpdateEvent;
