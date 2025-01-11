import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AlumniList from './AlumniList';
import AddAlumni from './AddAlumni'; // Import the AddAlumni component
import DeleteAlumni from './DeleteAlumni';
import UpdateAlumni from './UpdateAlumni';
import EventList from './EventList';
import AddEvent from './AddEvent';
import UpdateEvent from './UpdateEvent';
import DeleteEvent from './DeleteEvent';
import EventDetails from './EventDetails';
import AlumniSearchDetails from './AlumniSearchDetails';
import DonationSummary from './DonationSummary';
import DonationAnalysis from './DonationAnalysis';
import './AdminView.css'; 


function AdminView() {
  return (
    <div className="admin-view">
      <h2>Admin Dashboard</h2>

      {/* Tabs Navigation */}
      <div className="tabs">
        <Link to="/admin/alumni" className="tab">Alumni List</Link>
        <Link to="/admin/add-alumni" className="tab">Add Alumni</Link> {/* New Link */}
        <Link to="/admin/delete-alumni" className="tab">Delete Alumni</Link>
        <Link to="/admin/update-alumni" className="tab">Update Alumni</Link>
        <Link to="/admin/events" className="tab">Events</Link>
        <Link to="/admin/add-event" className="tab">Add Event</Link>
        <Link to="/admin/update-event" className="tab">Update Event</Link>
        <Link to="/admin/delete-event" className="tab">Delete Event</Link>
        <Link to="/admin/events/details" className="tab">Event Details</Link>
        <Link to="/admin/username" className="tab">Search Alumni</Link>
        <Link to="/admin/total-donations" className="tab">Donation Summary</Link>
        <Link to="/admin/donations/analysis" className="tab">Donation Analysis</Link>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <Routes>
          <Route path="/alumni" element={<AlumniList />} />
          <Route path="/add-alumni" element={<AddAlumni />} /> {/* New Route */}
          <Route path="/delete-alumni" element={<DeleteAlumni/>} />
          <Route path="/update-alumni" element={<UpdateAlumni/>} />
          <Route path="/events" element={<EventList />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/update-event" element={<UpdateEvent />} />
          <Route path="/delete-event" element={<DeleteEvent />} />
          <Route path="/events/details" element={<EventDetails />} />
          <Route path="/username" element={<AlumniSearchDetails />} />
          <Route path="/total-donations" element={<DonationSummary />} />
          <Route path="/donations/analysis" element={<DonationAnalysis />} />
          <Route path="*" element={<h3>Please select a tab.</h3>} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminView;
