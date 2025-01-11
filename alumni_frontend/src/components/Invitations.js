import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvitations = async () => {
      const srn = localStorage.getItem('alumniSRN'); // Get the SRN from local storage
      if (!srn) {
        setError('SRN not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/invites', { 
          params: { srn },
        });
        if (response.data && response.data.length > 0) {
          setInvitations(response.data);
        } else {
          setError('No invitations found for this SRN.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch invitations.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  const respondToInvitation = async (invitationId, response) => {
    try {
      const res = await axios.post('http://localhost:5000/api/invitations/respond', {
        invitationId,
        response,
      });
      if (res.status === 200) {
        alert(res.data.message);

        // Refresh invitations
        const srn = localStorage.getItem('alumniSRN'); // Re-fetch SRN
        const updatedRes = await axios.get(`http://localhost:5000/api/invites`, {
          params: { srn },
        });
        setInvitations(updatedRes.data);
      }
    } catch (err) {
      setError('Failed to respond to invitation.');
    }
  };

  if (loading) return <p>Loading invitations...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Invitations</h1>
      <ul>
        {invitations.map((invitation) => (
          <li key={invitation.id}>
            <p>Event: {invitation.event_name}</p>
            <p>Details: {invitation.event_details}</p>
            <p>Status: {invitation.acceptance_status || 'Pending'}</p>
            <button onClick={() => respondToInvitation(invitation.id, 'accepted')}>Accept</button>
            <button onClick={() => respondToInvitation(invitation.id, 'declined')}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Invitations;
