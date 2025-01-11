# Alumni-database-management-system
The Alumni Database Management System (ADMS) is a comprehensive platform designed to manage alumni details, track event invitations, donations, and more. The system supports multiple user roles such as **Admin**, **Alumni**, and **Event Organiser**. It allows admins to manage alumni data, while alumni can view their information and track event invitations. Event organisers can send invitations to alumni and track their responses.

## Features

- **Admin View**:
  - Manage all alumni details.
  - Add, delete, and update alumni information.
  - View and analyze donations made by alumni, with a breakdown based on year.
  - Track whether donations are from first-time or repeat donors.
  - Access all alumni information for administrative purposes.

- **Alumni View**:
  - View personal information.
  - Track events they’ve been invited to.
  - Accept or reject event invitations.

- **Event Organiser View**:
  - Send event invitations to alumni based on their SRN (Roll Number).
  - Track responses (Accepted/Rejected).
  - Once an event is finalized (frozen), no further invitations can be sent.
  - Search for alumni based on specific constraints (e.g., name, year of graduation, etc.).

## MySQL Database Integration
The system is connected to a MySQL database to store alumni information, event details, user credentials, and donation history. Below is the structure of the tables used in the system:

### Table Structure

#### 1. **Users Table**
Stores user credentials and roles (Admin, Event Organizer, Alumni).
```sql
CREATE TABLE alumni (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    SRN VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    dob DATE,
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(15),
    branch VARCHAR(50),
    grad_year INT,
    experience TEXT,
    active TINYINT(1) DEFAULT 1,
    address TEXT,
    linkedin VARCHAR(255),
    job_position VARCHAR(100),
    field_of_interest VARCHAR(100)
);
CREATE TABLE donations (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    alumni_id INT,
    donation_amt DECIMAL(10,2) CHECK (donation_amt > 0),
    donation_purpose TEXT,
    donation_date DATE
);
CREATE TABLE eventparticipants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    alumni_id INT,
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending'
);
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    location VARCHAR(200),
    type VARCHAR(50),
    date DATE,
    rsvp_count INT DEFAULT 0 CHECK (rsvp_count >= 0),
    max_capacity INT,
    organizer_id INT,
    special_guests TEXT,
    description TEXT,
    fixed INT DEFAULT 0
);
CREATE TABLE invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumni_id INT,
    srn VARCHAR(20) NOT NULL,
    alumni_name VARCHAR(100) NOT NULL,
    event_details TEXT NOT NULL,
    acceptance_status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Environment Configuration:
To connect to the MySQL database, you need to configure your connection settings in a .env file.
Add the appropriate values for your database connection settings in the .env file:

- **DB_HOST**: The hostname where your MySQL database is hosted (e.g., localhost).
- **DB_USER**: The MySQL username which has complete access across the database (root user).
- **DB_PASSWORD**: The MySQL password.
- **DB_NAME**: The name of your MySQL database.
-  **PORT**: The port number for your application to run on (e.g., 5000).

Ensure that your MySQL server is running and the database and tables are set up as described above.

### Login Configuration

Currently, the login functionality has been hardcoded for simplicity. The following rules are applied:

- **Admin**: Any user whose **username** starts with `admin` and **password** starts with `adminpwd` will be granted access to the admin view.
- **Event Organizer**: Any user whose **username** starts with `org` and **password** starts with `orgpwd` will be granted access to the event organizer view.
- **Alumni**: Any user whose **username** starts with `alumni` and **password** starts with `alumnipwd` will be granted access to the alumni view.

These login credentials have been hardcoded in the `login.js` file on the frontend.

#### Customizing Login:

If you wish to modify or extend the login functionality, you can:
- **Modify the `login.js` file**: Here, you can change the conditions for login or introduce new ones.
- **Create a Users Table**: For better scalability and security, you can create a `users` table in your database to store registered users and their roles, eliminating hardcoding.

A simple schema for the users table can look like this:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('admin', 'event_organizer', 'alumni') NOT NULL
);
```

### How to Run the Application

To run the Alumni Database Management System, follow the steps below:

1. **Backend (Node.js Server)**:
   - Navigate to the backend directory.
   - Run the following command to start the server:
     ```bash
     node server.js
     ```
   - This will start the Node.js server and the backend API will be available.

2. **Frontend (React Application)**:
   - Navigate to the frontend directory.
   - Run the following command to start the frontend:
     ```bash
     npm start
     ```
   - This will start the React application and open it in your default browser.
   
   The frontend will communicate with the backend, so ensure both the server and the frontend are running.

### Database Setup (One-Time Setup)

In the `backend` folder, you will find a file named `triggers.txt`. This file contains the necessary SQL code for setting up triggers and stored procedures in your MySQL database. These need to be run **only once** during the initial setup of the application.

To run the triggers and procedures automatically when the server starts:

1. Open the `server.js` file in the `backend` folder.
2. At the bottom of the `server.js` file, add the contents of the `triggers.txt` file.
3. Save the changes.

**Important**: The SQL code in `triggers.txt` should be executed only once. If it is executed again, it may cause errors (such as duplicate triggers or procedures). Therefore, make sure to remove the SQL code from `server.js` once the triggers and procedures have been successfully created in your database.

Alternatively, you can also manually run the SQL code from `triggers.txt` directly in your MySQL client or command-line interface (CLI).

Once the triggers and procedures are set up in your database, you can proceed with running the server and frontend as mentioned in the previous steps.

### Dependencies
-**Backend**: 
```bash
npm install express mysql cors dotenv
```
-**Frontend**:
```bash
npm install react react-dom react-router-dom axios
```



