import React, { useState } from 'react';
import axios from 'axios';

const InvitationsPage = () => {
    const [srn, setSrn] = useState('');
    const [eventDetails, setEventDetails] = useState('');
    const [message, setMessage] = useState('');

    const handleSendInvitation = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/send-invitation-page', {
                srn,
                eventDetails,
            });
            alert(response.data.message);
            setSrn('');
            setEventDetails('');
            
            // Set the message to be displayed below
            setMessage('Invitation has been successfully sent!');
        } catch (error) {
            console.error('Error sending invitation:', error);
            alert('Failed to send invitation');
        }
    };

    return (
        <div>
            <h1>Send Invitation</h1>
            <input
                type="text"
                placeholder="Enter SRN"
                value={srn}
                onChange={(e) => setSrn(e.target.value)}
            />
            <textarea
                placeholder="Event Details"
                value={eventDetails}
                onChange={(e) => setEventDetails(e.target.value)}
            />
            <button onClick={handleSendInvitation}>Send Invitation</button>
            {message && <p>{message}</p>} {/* Display the message if it exists */}
        </div>
    );
};

export default InvitationsPage;
