// AlumniSearchDetails.js
import React, { useState } from 'react';
import axios from 'axios';

function AlumniSearchDetails() {
  const [searchName, setSearchName] = useState('');
  const [alumni, setAlumni] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alumni/username', {
        params: { username: searchName },
      });

      if (response.data && response.data.length > 0) {
        setAlumni(response.data[0]); // Set to the first alumnus if it’s an array
        setError(''); // Clear any previous error
      } else {
        setError('No alumni found with that name.');
        setAlumni(null); // Clear previous alumni data
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch alumni data.');
      setAlumni(null); // Clear previous alumni data
    }
  };

  return (
    <div>
      <h2>Search Alumni</h2>
      <input
        type="text"
        placeholder="Enter alumni name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p>{error}</p>} {/* Display error if any */}
      
      {alumni && (
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

export default AlumniSearchDetails;
