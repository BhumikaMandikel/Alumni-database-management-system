import React, { useState } from 'react';
import axios from 'axios';
import './DeleteAlumni.css';

const DeleteAlumni = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            // Change the URL to correctly include the name as a path parameter
            const response = await axios.delete(`http://localhost:5000/api/delete-alumni/${name}`);
            setMessage(response.data.message);
            setName('');
        } catch (error) {
            setMessage('Error deleting alumni: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div className="delete-alumni">
            <h1>Delete Alumni</h1>
            <form onSubmit={handleDelete}>
                <input 
                    type="text" 
                    placeholder="Enter name of alumni" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
                <button type="submit">Delete Alumni</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default DeleteAlumni;
