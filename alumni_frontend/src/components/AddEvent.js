import React, { useState } from 'react';
import axios from 'axios';

function AddEvent() {
  const [newEvent, setNewEvent] = useState({ name: '', date: '', location: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/add-event', newEvent);
      console.log('Event added:', response.data);
      setSuccess('Event added successfully!');
      setError(''); // Clear any previous error messages
      // Reset the form
      setNewEvent({ name: '', date: '', location: '', description: '' });
    } catch (error) {
      console.error(error);
      setError('Failed to add event. Please try again.'); // Set error message
      setSuccess(''); // Clear any previous success messages
    }
  };

  return (
    <div>
      <h3>Add New Event</h3>
      <form onSubmit={handleAddEvent}>
        <input 
          type="text" 
          placeholder="Event Name" 
          value={newEvent.name} 
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} 
          required 
        />
        <input 
          type="date" 
          value={newEvent.date} 
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Location" 
          value={newEvent.location} 
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} 
          required 
        />
        <textarea 
          placeholder="Description" 
          value={newEvent.description} 
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} 
          required 
        />
        <button type="submit">Add Event</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error if any */}
      {success && <p style={{ color: 'green' }}>{success}</p>} {/* Display success message */}
    </div>
  );
}

export default AddEvent;
