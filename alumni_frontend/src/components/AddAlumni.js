import React, { useState } from 'react';
import axios from 'axios';
import './AddAlumni.css';

const AddAlumni = () => {
  const [alumniData, setAlumniData] = useState({
    SRN: '',
    first_name: '',
    last_name: '',
    dob: '',
    email: '',
    phone_number: '',
    branch: '',
    grad_year: '',
    experience: '',
    address: '',
    linkedin: '',
    job_position: '',
    field_of_interest: '',
  });

  const [error, setError] = useState(null); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumniData({ ...alumniData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setError(null); // Reset error state
    setLoading(true); // Start loading

    try {
      const response = await axios.post('http://localhost:5000/api/add-alumni', alumniData);

      if (response.status >= 200 && response.status < 300) {
        console.log('Alumni added:', response.data);
        // Optionally reset the form or show a success message
        setAlumniData({
          SRN: '',
          first_name: '',
          last_name: '',
          dob: '',
          email: '',
          phone_number: '',
          branch: '',
          grad_year: '',
          experience: '',
          address: '',
          linkedin: '',
          job_position: '',
          field_of_interest: '',
        });
      } else {
        setError('Error adding alumni: ' + response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error adding alumni: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="add-alumni-container">
      <h2>Add New Alumni</h2>
      {error && <div className="error-message">{error}</div>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        {/* Input fields */}
        <input type="text" name="SRN" placeholder="SRN" value={alumniData.SRN} onChange={handleChange} required />
        <input type="text" name="first_name" placeholder="First Name" value={alumniData.first_name} onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" value={alumniData.last_name} onChange={handleChange} required />
        <input type="date" name="dob" value={alumniData.dob} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={alumniData.email} onChange={handleChange} required />
        <input type="text" name="phone_number" placeholder="Phone Number" value={alumniData.phone_number} onChange={handleChange} required />
        <input type="text" name="branch" placeholder="Branch" value={alumniData.branch} onChange={handleChange} required />
        <input type="number" name="grad_year" placeholder="Graduation Year" value={alumniData.grad_year} onChange={handleChange} required />
        <textarea name="experience" placeholder="Experience" value={alumniData.experience} onChange={handleChange} />
        <textarea name="address" placeholder="Address" value={alumniData.address} onChange={handleChange} />
        <input type="url" name="linkedin" placeholder="LinkedIn Profile URL" value={alumniData.linkedin} onChange={handleChange} />
        <input type="text" name="job_position" placeholder="Job Position" value={alumniData.job_position} onChange={handleChange} />
        <input type="text" name="field_of_interest" placeholder="Field of Interest" value={alumniData.field_of_interest} onChange={handleChange} />
        <button type="submit" disabled={loading}>Add Alumni</button> {/* Disable button while loading */}
        {loading && <p>Adding alumni, please wait...</p>} {/* Loading message */}
      </form>
    </div>
  );
};

export default AddAlumni;
