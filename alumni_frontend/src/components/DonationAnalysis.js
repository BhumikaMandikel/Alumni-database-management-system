import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DonationAnalysis() {
  const [donationSummary, setDonationSummary] = useState({});
  const [year, setYear] = useState(''); // State to hold the input year
  const [loading, setLoading] = useState(true); // State to handle loading

  const fetchDonationSummary = async (year = '') => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/donations/analysis', { params: { year } }); // Update endpoint with query parameter
      setDonationSummary(response.data);
    } catch (error) {
      console.error('Error fetching donation summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch without a year
    fetchDonationSummary(); 
  }, []);

  const handleYearChange = (e) => {
    setYear(e.target.value); // Update the year state
  };

  const handleYearSubmit = () => {
    // Fetch donation summary based on the entered year
    fetchDonationSummary(year);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Donation Analysis</h2>

      {/* Input for year */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="year-input">Enter Year:</label>
        <input
          type="text"
          id="year-input"
          value={year}
          onChange={handleYearChange}
          placeholder="e.g. 2024"
          style={{ marginLeft: '10px', marginRight: '10px' }}
        />
        <button onClick={handleYearSubmit}>Submit</button>
      </div>

      {/* Overall Donation Summary */}
      <h3>Overall Donation Summary</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Total Donation Amount: ${donationSummary.totalAmount ? donationSummary.totalAmount.toFixed(2) : 'N/A'}</p>
          <p>First-time Donors: {donationSummary.firstTime ? donationSummary.firstTime : 'N/A'}</p>
          <p>Returning Donors: {donationSummary.returning ? donationSummary.returning : 'N/A'}</p>
        </>
      )}

      {/* Donations Above a Certain Threshold */}
      <h3>Donations Above Threshold ($1000)</h3>
      {loading ? (
        'Loading...'
      ) : (
        donationSummary.thresholdDonations && donationSummary.thresholdDonations.length > 0 ? (
          <table style={{ marginTop: '10px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '10px' }}>Alumni ID</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Amount</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {donationSummary.thresholdDonations.map((donation) => (
                <tr key={donation.donation_id}>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{donation.alumni_id}</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>${donation.donation_amt.toFixed(2)}</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{new Date(donation.donation_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No donations above the threshold for the selected year.</p>
        )
      )}
    </div>
  );
}

export default DonationAnalysis;
