import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AlumniDetails() {
  const [alumni, setAlumni] = useState(null); // Start as null to handle loading state
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const username = localStorage.getItem('alumniUsername'); // Retrieve the username from local storage

        // Send request with the username as a query parameter
        const response = await axios.get('http://localhost:5000/api/alumni/username', { // Updated the endpoint to match the server
          params: { username },
        });
        
        // Check if response contains the alumni data
        if (response.data && response.data.length > 0) {
          setAlumni(response.data[0]); // Set to the first alumnus if it’s an array
          localStorage.setItem('alumniSRN', response.data[0].SRN);
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
    <div>
      <h2>Your Alumni Profile</h2>
      {error && <p>{error}</p>} {/* Display error if any */}
      {!alumni ? (
        <p>Loading...</p> // Show loading state while fetching data
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Job Position</th>
              <th>Field of Interest</th>
            </tr>
          </thead>
          <tbody>
            <tr key={alumni.id}>
              <td>{alumni.first_name} {alumni.last_name}</td>
              <td>{alumni.email}</td>
              <td>{alumni.job_position}</td>
              <td>{alumni.field_of_interest}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}


export default AlumniDetails;
