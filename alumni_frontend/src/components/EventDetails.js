import React, { useState } from 'react';
import axios from 'axios';

const EventDetails = () => {
  const [eventName, setEventName] = useState('');
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState('');
  const [budgetMultiplier, setBudgetMultiplier] = useState(0); // New state for budget multiplier
  const [totalBudget, setTotalBudget] = useState(null); // State to display total budget

  const handleFetchEventDetails = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.get(`http://localhost:5000/api/events/details`, {
        params: { name: eventName },
      });
      setEventDetails(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred');
      }
      setEventDetails(null);
    }
  };

  // Function to calculate total budget
  const handleCalculateBudget = async () => {
    if (!eventDetails || budgetMultiplier <= 0) {
      setError('Please enter a valid budget multiplier');
      return;
    }
    
    try {
      const rsvpResponse = await axios.get(`http://localhost:5000/api/events/rsvp`, {
        params: { name: eventName },
      });
      
      const rsvpCount = rsvpResponse.data.rsvp_count;
      const calculatedBudget = rsvpCount * parseInt(budgetMultiplier, 10);
      setTotalBudget(calculatedBudget);
    } catch (err) {
      setError('Failed to calculate budget');
    }
  };

  // Function to set the 'fixed' column value to 1
  const handleSetFixed = async () => {
    try {
      await axios.post(`http://localhost:5000/api/events/set-fixed`, { name: eventName });
      alert('Event fixed status updated successfully!');
    } catch (err) {
      setError('Failed to update fixed status');
    }
  };

  return (
    <div className="event-details">
      <h1>Event Details</h1>
      <form onSubmit={handleFetchEventDetails}>
        <label htmlFor="eventName">Enter Event Name:</label>
        <input
          type="text"
          id="eventName"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
        <button type="submit">Fetch Event Details</button>
      </form>

      {error && <div className="error">{error}</div>}

      {eventDetails && (
        <div className="event-info">
          <h2>Event Details:</h2>
          <div className="event-card">
            {eventDetails.map((event, index) => (
              <div key={index} className="event-item">
                <h3>{event.event_name}</h3>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Description:</strong> {event.description}</p>
              </div>
            ))}
          </div>

          <div className="budget-calculation">
            <h3>Calculate Total Event Budget</h3>
            <label htmlFor="budgetMultiplier">Enter Budget Multiplier:</label>
            <input
              type="number"
              id="budgetMultiplier"
              value={budgetMultiplier}
              onChange={(e) => setBudgetMultiplier(e.target.value)}
            />
            <button onClick={handleCalculateBudget}>Calculate Total Budget</button>
            {totalBudget !== null && (
              <p><strong>Total Event Budget:</strong> ${totalBudget}</p>
            )}
          </div>

          <button onClick={handleSetFixed}>Set Fixed Status</button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
