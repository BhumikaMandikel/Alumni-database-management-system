import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AlumniList.css';

function AlumniList() {
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/alumni')
      .then(response => setAlumni(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="alumni-container">
      <h2>Alumni List</h2>
      <table className="alumni-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Graduation Year</th>
            <th>Branch</th>
            <th>Current Position</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>LinkedIn</th>
            <th>Donation Amount</th>
            <th>Donation Status</th>
          </tr>
        </thead>
        <tbody>
          {alumni.map((alum) => (
            <tr key={alum.id}>
              <td>{`${alum.first_name} ${alum.last_name}`}</td>
              <td>{alum.grad_year}</td>
              <td>{alum.branch}</td>
              <td>{alum.job_position}</td>
              <td>{alum.email}</td>
              <td>{alum.phone_number}</td>
              <td>
                <a href={alum.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn Profile
                </a>
              </td>
              <td>{alum.donation_amount}</td>
              <td>{alum.donation_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AlumniList;
