import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PersonalDonationDetails() {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        const alumniId = localStorage.getItem('alumniID'); // Retrieve alumni ID from local storage

        // Send request to fetch the latest 2 donations for the given alumni
        const response = await axios.get('http://localhost:5000/api/alumni/personal-donations', { // Updated the endpoint to match the server
            params: { alumniId },
          });

        if (response.data && response.data.donations) {
          setDonations(response.data.donations); // Set donation data
        } else {
          setError('No donation data found for this alumni.');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch donation data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonationData();
  }, []);

  return (
    <div>
      <h2>Your Latest Donation</h2>
      {error && <p>{error}</p>}
      {loading ? (
        <p>Loading...</p> // Show loading state while data is being fetched
      ) : donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Donation Amount</th>
              <th>Donation Date</th>
              <th>Total Donated</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation, index) => (
              <tr key={index}>
                <td>${donation.donation_amt.toFixed(1)}</td>
                <td>{new Date(donation.donation_date).toLocaleDateString()}</td>
                <td>${donation.total_donated.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PersonalDonationDetails;
