import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DonationSummary = () => {
  const [totalDonations, setTotalDonations] = useState([]);
  const [totalReceived, setTotalReceived] = useState(0);
  const [topDonors, setTopDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTotalDonations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/total-donations');
        setTotalDonations(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch total donations.');
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    const fetchTotalReceived = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/total-received');
        setTotalReceived(response.data.total_received);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch total received donations.');
      }
    };

    fetchTotalDonations();
    fetchTotalReceived();
  }, []);

  const fetchTopDonors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/top-donors');
      setTopDonors(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch top donors.');
    }
  };

  if (loading) return <p>Loading donations...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Total Donations</h1>
      <ul>
        {totalDonations.map((donation) => (
          <li key={donation.donation_purpose}>
            {donation.donation_purpose}: ${donation.total_amount.toFixed(2)}
          </li>
        ))}
      </ul>

      <h2>Total Donations Received: ${totalReceived.toFixed(2)}</h2>

      <button onClick={fetchTopDonors}>Get Top 5 Donors</button>

      <h2>Top Donors</h2>
      <ul>
        {topDonors.map((donor, index) => (
          <li key={index}>
            {donor.first_name} | Amount: ${donor.donation_amt.toFixed(2)} | Purpose: {donor.donation_purpose} | Branch: {donor.branch}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationSummary;
