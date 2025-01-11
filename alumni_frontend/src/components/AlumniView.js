// AlumniView.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';
import AlumniDetails from './AlumniDetails';
import Invitations from './Invitations';
import PersonalDonationDetails from './PersonalDonationDetails';

function AlumniView() {
  const [alumni, setAlumni] = useState(null); // State to store alumni data
  const [error, setError] = useState(''); // State to store any error messages
  const[alumniId,setAlumniId]=useState(null);

  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const username = localStorage.getItem('alumniUsername'); // Retrieve the username from local storage

        // Send request with the username as a query parameter
        const response = await axios.get('http://localhost:5000/api/alumni/username', {
          params: { username },
        });

        // Check if response contains the alumni data
        if (response.data && response.data.length > 0) {
          setAlumni(response.data[0]); // Set to the first alumnus if it’s an array
          localStorage.setItem('alumniSRN', response.data[0].SRN);
          localStorage.setItem('alumniID', response.data[0].user_id);
          setAlumniId(response.data.user_id)
        } else {
          setError('No alumni data found.');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch your alumni data.');
      }
    };

    fetchAlumniData();
  }, []);

  return (
    <div className="alumni-view">
      <h2>Alumni Dashboard</h2>

      {/* Tabs Navigation */}
      <div className="tabs">
        <Link to="/alumni/details" className="tab">Profile</Link>
        <Link to="/alumni/invites" className="tab">Invites</Link> {/* Placeholder for future invites tab */}
        <Link to="/alumni/personal-donations" className="tab">Donations</Link>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <Routes>
          <Route path="/details" element={<AlumniDetails alumni={alumni} error={error} />} />
          <Route path="/invites" element={<Invitations/>} /> {/* Placeholder for invites */}
          <Route path="/personal-donations" element={<PersonalDonationDetails alumniId={alumniId}/>} />
          
          {/* Default route to redirect to Profile tab */}
          <Route path="*" element={<h3>Please select a tab.</h3>} />
        </Routes>
      </div>
    </div>
  );
}

export default AlumniView;
