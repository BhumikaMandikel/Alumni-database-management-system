// SearchPage.js

import React, { useState } from 'react';
import axios from 'axios';
import './ConstraintSearchPage.css';

const SearchPage = () => {
    const [gender, setGender] = useState('');
    const [field, setField] = useState('');
    const [value, setValue] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/search-page', {
                gender,
                field,
                value,
            });
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <h1>Search Alumni</h1>
            <div>
                <h3>Gender:</h3>
                <label>
                    <input
                        type="radio"
                        name="gender"
                        value="male"
                        onChange={(e) => setGender(e.target.value)}
                    />
                    Male
                </label>
                <label>
                    <input
                        type="radio"
                        name="gender"
                        value="female"
                        onChange={(e) => setGender(e.target.value)}
                    />
                    Female
                </label>
                <label>
                    <input
                        type="radio"
                        name="gender"
                        value=""
                        onChange={(e) => setGender('')}
                    />
                    Both
                </label>
            </div>

            <div>
                <h3>Search Field:</h3>
                <select onChange={(e) => setField(e.target.value)}>
                    <option value="">Select Field</option>
                    <option value="first_name">Name</option>
                    <option value="branch">Department</option>
                    <option value="grad_year">Graduation Year</option> {/* This remains unchanged */}
                    {/* Add more fields as necessary */}
                    <option value="dob">Date of Birth</option>
                    <option value="active">Active Status</option>
                    <option value="field_of_interest">Field Of Interest</option>
                </select>
                <input
                    type="text"
                    placeholder="Value"
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>

            <button onClick={handleSearch}>Search</button>

            <h3>Results:</h3>
            {results.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>SRN</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>DOB</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Branch</th>
                            <th>Graduation Year</th>
                            <th>Experience</th>
                            <th>Address</th>
                            <th>LinkedIn</th>
                            <th>Job Position</th>
                            <th>Field of Interest</th>
                            <th>Gender</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((alumnus) => (
                            <tr key={alumnus.id}>
                                <td>{alumnus.id}</td>
                                <td>{alumnus.SRN}</td>
                                <td>{alumnus.first_name}</td>
                                <td>{alumnus.last_name}</td>
                                <td>{new Date(alumnus.dob).toLocaleDateString()}</td>
                                <td>{alumnus.email}</td>
                                <td>{alumnus.phone_number}</td>
                                <td>{alumnus.branch}</td>
                                <td>{alumnus.grad_year}</td>
                                <td>{alumnus.experience}</td>
                                <td>{alumnus.address}</td>
                                <td><a href={alumnus.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></td>
                                <td>{alumnus.job_position}</td>
                                <td>{alumnus.field_of_interest}</td>
                                <td>{alumnus.gender}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
};

export default SearchPage;
