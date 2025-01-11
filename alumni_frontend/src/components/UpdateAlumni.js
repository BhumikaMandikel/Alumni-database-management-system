import React, { useState } from 'react';
import axios from 'axios';
import './UpdateAlumni.css';

const UpdateAlumni = () => {
    const [name, setName] = useState('');
    const [newData, setNewData] = useState({ email: '', major: '' });
    const [message, setMessage] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Update the API endpoint to include the alumni name as a URL parameter
            const response = await axios.put(`http://localhost:5000/api/update-alumni/${name}`, newData);
            setMessage(response.data.message);
            setName('');
            setNewData({ email: '', major: '' });
        } catch (error) {
            // Update error message handling
            setMessage('Error updating alumni: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <h1>Update Alumni</h1>
            <form onSubmit={handleUpdate}>
                <input 
                    type="text" 
                    placeholder="Enter name of alumni" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
                <input 
                    type="email" 
                    placeholder="New Email" 
                    value={newData.email} 
                    onChange={(e) => setNewData({ ...newData, email: e.target.value })} 
                />
                <input 
                    type="text" 
                    placeholder="New Branch" 
                    value={newData.Branch} 
                    onChange={(e) => setNewData({ ...newData, Branch: e.target.value })} 
                />
                <button type="submit">Update Alumni</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UpdateAlumni;
