import React from 'react';
import { Routes, Route, Link} from 'react-router-dom';
import EventList from './EventList';
import AddEvent from './AddEvent';
import UpdateEvent from './UpdateEvent';
import DeleteEvent from './DeleteEvent';
import SearchPage from './ConstraintSearchPage';
import InvitationsPage from './SendInvitation';
import Status from './Status';

function EventOrganizerView() {
  return (
    <div className="event-organizer-view">
      <h2>Event Organizer Dashboard</h2>

      {/* Tabs Navigation */}
      <div className="tabs">
        <Link to="/event-organizer/events" className="tab">Events</Link>
        <Link to="/event-organizer/add-event" className="tab">Add Event</Link>
        <Link to="/event-organizer/update-event" className="tab">Update Event</Link>
        <Link to="/event-organizer/delete-event" className="tab">Delete Event</Link>
        <Link to="/event-organizer/search-page" className="tab">Constraint Search Page</Link>
        <Link to="/event-organizer/send-invitation-page" className="tab">Send Invitation Page</Link>
        <Link to="/event-organizer/invites/status" className="tab">Updated Event Status</Link>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <Routes>
          <Route path="/events" element={<EventList />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/update-event" element={<UpdateEvent />} />
          <Route path="/delete-event" element={<DeleteEvent />} />
          <Route path="/search-page" element={<SearchPage />} />
          <Route path="/send-invitation-page" element={<InvitationsPage />} />
          <Route path="/invites/status" element={<Status />} />
          
          {/* Default route to redirect to Events tab */}
          <Route path="*" element={<h3>Please select a tab.</h3>} />
        </Routes>
      </div>
    </div>
  );
}

export default EventOrganizerView;
