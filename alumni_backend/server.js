const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // Set the maximum number of connections in the pool
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test database connection
pool.getConnection((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  } else {
    console.log('Database connected!');
  }
});


//----------------------ADMIN-VIEW-------------------------
//ALUMNILIST:Get all alumni
app.get('/api/alumni', (req, res) => {
  pool.query('SELECT * FROM alumni', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// ADD-ALUMNI: Add a new alumni
app.post('/api/add-alumni', async (req, res) => {
  const alumniData = req.body;

  console.log('Incoming alumni data:', alumniData);

  try {
    const query = 'INSERT INTO alumni (SRN, first_name, last_name, dob, email, phone_number, branch, grad_year, experience, address, linkedin, job_position, field_of_interest) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    pool.query(query, [
      alumniData.SRN,
      alumniData.first_name,
      alumniData.last_name,
      alumniData.dob,
      alumniData.email,
      alumniData.phone_number,
      alumniData.branch,
      alumniData.grad_year,
      alumniData.experience,
      alumniData.address,
      alumniData.linkedin,
      alumniData.job_position,
      alumniData.field_of_interest,
    ], (error, results) => {
      if (error) {
        console.error('Error adding alumni:', error);
        return res.status(500).json({ error: 'Error adding alumni' });
      }
      res.status(201).json({ message: 'Alumni added successfully', alumniId: results.insertId });
    });
  } catch (error) {
    console.error('Error adding alumni:', error);
    res.status(500).json({ error: 'Error adding alumni' });
  }
});

// DELETE-ALUMNI: DELETE alumni by first name
app.delete('/api/delete-alumni/:name', (req, res) => {
  console.log(`Received delete request for: ${req.params.name}`); // Log the name received
  const name = req.params.name;
  const sql = 'DELETE FROM alumni WHERE first_name = ?';

  pool.query(sql, [name], (err, result) => {
      if (err) {
          return res.status(500).json({ message: 'Error deleting alumni: ' + err.message });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Alumni not found' });
      }
      res.json({ message: 'Alumni deleted successfully' });
  });
});

// UPDATE-ALUMNI: UPDATE alumni by name
app.put('/api/update-alumni/:name', (req, res) => { // Added :name to the route
  const name = req.params.name; // Get name from the URL
  const { email, Branch } = req.body;
  const sql = 'UPDATE alumni SET email = ?, Branch = ? WHERE first_name = ?';
  
  pool.query(sql, [email, Branch, name], (err, result) => {
      if (err) {
          return res.status(500).json({ message: 'Error updating alumni: ' + err.message });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Alumni not found' });
      }
      res.json({ message: 'Alumni updated successfully' });
  });
});

// EVENTLIST: Get all events
app.get('/api/events', (req, res) => {
  pool.query('SELECT * FROM Events', (error, results) => {
    if (error) {
      console.error('Database query failed:', error);
      return res.status(500).send(error);
    }
    res.json(results);
  });
});

// Endpoint to update an event
app.get('/api/events', (req, res) => {
  pool.query('SELECT * FROM events', (error, results) => {
    if (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Failed to retrieve events' });
    }
    res.json(results);
  });
});

// ADD-EVENT: Add a new event
app.post('/api/add-event', (req, res) => {
  const { name, date, location, description } = req.body;
  if (!name || !date || !location || !description) {
    return res.status(400).json({ error: 'All event details (name, date, location, description) are required' });
  }

  const query = 'INSERT INTO events (name, date, location, description) VALUES (?, ?, ?, ?)';
  pool.query(query, [name, date, location, description], (error) => {
    if (error) {
      console.error('Error adding event:', error);
      return res.status(500).json({ error: 'Failed to add event' });
    }
    res.status(201).json({ message: 'Event added successfully' });
  });
});

// UPDATE-EVENT: Update an existing event
app.put('/api/update-event', (req, res) => {
  const { name, date, location, description } = req.body;
  if (!name || !date || !location || !description) {
    return res.status(400).json({ error: 'All event details (name, date, location, description) are required' });
  }

  const query = 'UPDATE events SET date = ?, location = ?, description = ? WHERE name = ?';
  pool.query(query, [date, location, description, name], (error, results) => {
    if (error) {
      console.error('Error updating event:', error);
      return res.status(500).json({ error: 'Failed to update event' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event updated successfully' });
  });
});

// DELETE-EVENT: Delete an event
app.delete('/api/delete-event', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Event name is required' });
  }

  const query = 'DELETE FROM events WHERE name = ?';
  pool.query(query, [name], (error, results) => {
    if (error) {
      console.error('Error deleting event:', error);
      return res.status(500).json({ error: 'Failed to delete event' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  });
});

//EVENT-DETAILS-BY-NAME:Gets the details of the event from name
app.get('/api/events/details', (req, res) => {
  const eventName = req.query.name; // Get the event name from query params
  console.log('Received request for event:', eventName);

  // Validate the event name parameter
  if (!eventName) {
    return res.status(400).json({ error: 'Event name query parameter is required.' });
  }

  // Query to fetch event details based on the event name
  const query = 'SELECT * FROM events WHERE name = TRIM(?)'; // Adjust the table name and column as necessary

  pool.query(query, [eventName], (error, results) => {
    if (error) {
      console.error('Error fetching event data:', error);
      return res.status(500).json({ error: 'Error fetching event data' });
    }

    // If no results found, return a not found response
    if (results.length === 0) {
      return res.status(404).json({ error: 'No event found with the given name' });
    }

    // Send the event details
    res.json(results);
  });
});

// Get RSVP count for a specific event
app.get('/api/events/rsvp', async (req, res) => {
  const eventName = req.query.name;
  console.log("Event name:", eventName);

  try {
    const query = 'SELECT rsvp_count FROM events WHERE name = ?';
    pool.query(query, [eventName], (error, results) => {
      if (error) {
        console.error('Error fetching RSVP count:', error);
        return res.status(500).json({ error: 'Error fetching RSVP count' });
      }
      
      // Check if any rows are returned
      if (results.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Retrieve the RSVP count from the first row
      const rsvpCount = results[0].rsvp_count;
      console.log("RSVP Count:", rsvpCount);
      res.json({ rsvp_count: rsvpCount });
    });
  } catch (error) {
    console.error('Unexpected error fetching RSVP count:', error);
    res.status(500).json({ error: 'Unexpected error fetching RSVP count' });
  }
});

//STATUS GETTING FIXED FR AN EVENT
// Set fixed status for an event
app.post('/api/events/set-fixed', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Event name is required' });
  }

  const query = 'UPDATE events SET fixed = 1 WHERE name = ?';

  pool.query(query, [name], (error, result) => {
    if (error) {
      console.error('Error updating fixed status:', error);
      return res.status(500).json({ error: 'Error updating fixed status' });
    }

    // Check if any rows were affected (i.e., event was found and updated)
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found or already set' });
    }

    res.json({ message: 'Fixed status updated successfully' });
  });
});




//ALUMNI-DETAILS
// Get alumni by username
app.get('/api/alumni/username', (req, res) => { // Ensure the endpoint matches the frontend request
  const username = req.query.username; // Get the username from query params (e.g., 'alumni_lisa')

  // Validate the username parameter
  if (!username) {
    return res.status(400).json({ error: 'Username query parameter is required.' });
  }

  // Remove the 'alumni_' prefix from the username
  const firstName = username.replace('alumni_', ''); // E.g., 'alumni_lisa' becomes 'lisa'

  try {
    // Query that searches by first_name in the alumni table
    const query = 'SELECT * FROM alumni WHERE first_name = TRIM(?)';

    // Execute the query using the modified firstName
    pool.query(query, [firstName], (error, results) => {
      if (error) {
        console.error('Error fetching alumni data:', error);
        return res.status(500).json({ error: 'Error fetching alumni data' });
      }

      // If no results found, return a not found response
      if (results.length === 0) {
        return res.status(404).json({ error: 'No alumni found with the given username' });
      }

      // Send the filtered data
      res.json(results);
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error' });
  }
});

//INVITATIONS IN ALUMNI VIEW
//invitations page for alumniview
// Endpoint to fetch invitations for a specific alumni
app.get('/api/invites', (req, res) => {
  const srn = req.query.srn; // Accessing SRN from query parameters
  console.log(`Fetching invitations for SRN: ${srn}`); // Debugging statement

  const query = 'SELECT * FROM invitations WHERE srn = ?';

  pool.query(query, [srn], (error, results) => {
    if (error) {
      console.error('Error fetching invitations:', error);
      return res.status(500).json({ error: 'Error fetching invitations' });
    }

    if (results.length === 0) {
      console.log('No invitations found for this SRN.'); // Debugging statement
      return res.status(404).json({ message: 'No invitations found for this SRN.' });
    }

    console.log(`Found ${results.length} invitation(s) for SRN: ${srn}`); // Debugging statement
    res.json(results);
  });
});

//SQLQUERY-1
// Endpoint to respond to invitations
app.post('/api/invitations/respond', (req, res) => {
  const { invitationId, response } = req.body;
  console.log(`Received response for invitation ID ${invitationId}: ${response}`); // Debugging statement

  const query = 'UPDATE invitations SET acceptance_status = ? WHERE id = ?';

  pool.query(query, [response, invitationId], (error) => {
    if (error) {
      console.error('Error updating invitation response:', error);
      return res.status(500).json({ error: 'Error updating invitation response' });
    }

    console.log(`Successfully updated invitation ID ${invitationId} to status: ${response}`); // Debugging statement
    res.json({ message: 'Invitation response recorded successfully' });
  });
});

//SQLQUERY-2
//INVITATION DETAILS
// Endpoint to get lists of accepted and rejected alumni invitations
app.get('/api/invites/status', (req, res) => {
  const query = 'SELECT srn, event_details, acceptance_status FROM invitations WHERE acceptance_status IN (?, ?)';

  pool.query(query, ['accepted', 'declined'], (error, results) => {
    if (error) {
      console.error('Error fetching accepted/rejected invitations:', error);
      return res.status(500).json({ error: 'Error fetching invitations by status' });
    }

    // Separate accepted and rejected invitations
    const accepted = results.filter((invitation) => invitation.acceptance_status === 'accepted');
    const declined = results.filter((invitation) => invitation.acceptance_status === 'declined');

    res.json({ accepted, declined });
  });
});

//SQLQUERY-3
//ALUMNI SEARCH BASED ON PARAMETERS FILETERED
//Creating serach page based on constraints
app.post('/api/search-page', (req, res) => { 
  const { gender, field, value } = req.body;

  console.log('Received search parameters:', {
      gender,
      field,
      value
  });
  
  let query = 'SELECT * FROM alumni WHERE 1=1';
  const queryParams = [];

  // Add gender filter
  if (gender) {
      query += ' AND gender = ?';
      queryParams.push(gender);
      console.log('Added gender filter:', gender);
  }

  // Add field search
  if (field && value) {
      query += ` AND ?? LIKE ?`;
      queryParams.push(field, `%${value}%`);
      console.log('Added field search:', { field, value });
  }

  const formattedSql = mysql.format(query, queryParams);
  console.log('Final SQL Query:', formattedSql);

  pool.query(formattedSql, queryParams, (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
              error: 'Database error',
              details: err.message
          });
      }
      
      console.log(`Query returned ${results.length} results`);
      
      // Optional: Log a sample of the results (first 2 entries)

      res.json(results);
  });
});

//Sending Invitations page
app.post('/api/send-invitation-page', (req, res) => {
  const { srn, eventDetails } = req.body;

  // Check if the alumni exists by SRN
  pool.query('SELECT * FROM alumni WHERE SRN = ?', [srn], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'Alumni not found' });
      }

      const alumni = results[0];
      const newInvitation = {
          alumni_id: alumni.id,
          srn: alumni.SRN,
          alumni_name: `${alumni.first_name} ${alumni.last_name}`,
          event_details: eventDetails
      };

      // Insert invitation into the invitations table
      pool.query('INSERT INTO invitations SET ?', newInvitation, (insertErr) => {
          if (insertErr) {
              console.error('Error inserting invitation:', insertErr);
              if (insertErr.code === 'ER_SIGNAL_EXCEPTION') {
                return res.status(400).json({ error: insertErr.sqlMessage }); // Send the trigger error message to the frontend
              }

              return res.status(500).json({ error: 'Failed to send invitation', details: insertErr.message });
          }
          res.json({ message: 'Invitation sent successfully', invitation: newInvitation });
      });
  });
});

//SQLQUERY-4
//totaldonation amount
app.get('/api/total-donations', (req, res) => {
  const query = `
    SELECT donation_purpose, SUM(donation_amt) AS total_amount FROM donations GROUP BY donation_purpose
  `;

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching donation totals:', error);
      return res.status(500).json({ error: 'Error fetching donation totals' });
    }

    res.json(results);
  });
});


//TOTAL DONATION CALCULATED
// Endpoint to get the total donations received by organisation
app.get('/api/total-received', (req, res) => {
  const query = 'SELECT SUM(donation_amt) AS total_received FROM donations';

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching total donations received:', error);
      return res.status(500).json({ error: 'Error fetching total donations received' });
    }

    res.json(results[0]); // Assuming results is an array with one object
  });
});

//TO GET TOP DONORS RESULT IN DESC ORDER OF DONATION AMOUNT
// Endpoint to get top 5 donors with their details
app.get('/api/top-donors', (req, res) => {
  const query = `SELECT a.first_name, d.donation_amt, d.donation_purpose, a.branch FROM donations d JOIN alumni a ON d.alumni_id = a.id ORDER BY d.donation_amt DESC  LIMIT 5`;

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching top donors:', error);
      return res.status(500).json({ error: 'Error fetching top donors' });
    }

    res.json(results);
  });
});

//SQLQUERY-5(imp) 
//personal donations list latest
app.get('/api/alumni/personal-donations', (req, res) => {
  const alumniId = req.query.alumniId;
  console.log(alumniId)

  const query = `SELECT d.donation_amt, d.donation_date, a.first_name, a.donation_amount AS total_donated FROM donations d JOIN alumni a ON d.alumni_id = a.user_id WHERE d.alumni_id = ? ORDER BY d.donation_date DESC LIMIT 1;`;

  pool.query(query, [alumniId], (error, results) => {
    if (error) {
      console.error('Error fetching donations:', error);
      return res.status(500).json({ error: 'Database error fetching donations' });
    }

    // If results found, return them; otherwise, return a message
    if (results.length > 0) {
      res.json({ donations: results });
    } else {
      res.json({ message: 'No donations found for this alumni.' });
    }
  });
});

//FUNCTIONS
// Function to get total donations for a specific year
const getTotalDonations = (year) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT SUM(donation_amt) AS total_donated FROM donations WHERE YEAR(donation_date) = ?`;
    pool.query(query, [year], (error, results) => {
      if (error) return reject(error);
      resolve(results[0]?.total_donated || 0); // Handle null result
    });
  });
};

// Function to get first-time donors count for a specific year
const getFirstTimeDonorsCount = (year) => {
  return new Promise((resolve, reject) => {
    const firstTimeQuery = `
      SELECT COUNT(DISTINCT alumni_id) AS first_time_donors 
      FROM donations 
      WHERE YEAR(donation_date) = ? 
      AND alumni_id NOT IN (SELECT alumni_id FROM donations WHERE YEAR(donation_date) < ?);
    `;
    pool.query(firstTimeQuery, [year, year], (error, results) => {
      if (error) return reject(error);
      resolve(results[0]?.first_time_donors || 0); // Handle null result
    });
  });
};

// Function to get returning donors count for a specific year
const getReturningDonorsCount = (year) => {
  return new Promise((resolve, reject) => {
    const returningQuery = `
      SELECT COUNT(DISTINCT alumni_id) AS returning_donors 
      FROM donations 
      WHERE YEAR(donation_date) = ? 
      AND alumni_id IN (SELECT alumni_id FROM donations WHERE YEAR(donation_date) < ?);
    `;
    pool.query(returningQuery, [year, year], (error, results) => {
      if (error) return reject(error);
      resolve(results[0]?.returning_donors || 0); // Handle null result
    });
  });
};

// Function to get donations above a certain threshold
const getDonationsAboveThreshold = (threshold, year) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT alumni_id, donation_amt, donation_date 
      FROM donations 
      WHERE donation_amt > ? AND YEAR(donation_date) = ?
      ORDER BY donation_amt DESC;
    `;
    // Pass the parameters as an array
    pool.query(query, [threshold, year], (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

//DONATION ANALYSIS
// Summary Endpoint
app.get('/api/donations/analysis', async (req, res) => {
  try {
    const year = req.query.year; // Get year from query parameters

    // Validate year parameter
    if (!year || isNaN(year)) {
      return res.status(400).json({ error: 'Invalid year parameter' });
    }

    // Convert year to integer
    const yearInt = parseInt(year, 10);

    const totalDonations = await getTotalDonations(yearInt);
    const firstTimeDonors = await getFirstTimeDonorsCount(yearInt);
    const returningDonors = await getReturningDonorsCount(year);
    const threshold = req.query.threshold || 1000; // Default threshold
    const thresholdDonations = await getDonationsAboveThreshold(threshold, yearInt);

    res.json({
      totalAmount: totalDonations,
      firstTime: firstTimeDonors,
      returning: returningDonors,
      thresholdDonations,
    });

  } catch (error) {
    console.error('Error fetching donation summary:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//creating the triggers section





// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
