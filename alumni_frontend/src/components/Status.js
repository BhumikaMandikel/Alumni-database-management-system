import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Status = () => {
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/invites/status');
        setAccepted(response.data.accepted);
        setRejected(response.data.declined);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch invitations by status.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) return <p>Loading status...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Invitations Status</h1>
      <h2>Accepted Alumni</h2>
      <ul>
        {accepted.map((invitation) => (
          <li key={`${invitation.srn}-${invitation.event_name}`}>
            SRN: {invitation.srn} | Event: {invitation.event_name} | Details: {invitation.event_details}
          </li>
        ))}
      </ul>
      
      <h2>Rejected Alumni</h2>
      <ul>
        {rejected.map((invitation) => (
          <li key={`${invitation.srn}-${invitation.event_name}`}>
            SRN: {invitation.srn} | Event: {invitation.event_name} | Details: {invitation.event_details}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Status;
