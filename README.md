# Drive Test Assignment

## Project Overview

This project is a Drive Test Booking System designed to help users book appointments for G2 and G driving tests. The system provides interfaces for three types of users: Drivers, Examiners, and Admins. Drivers can book tests and view their results, Examiners can assess the results of driving tests, and Admins can manage the overall system, including viewing and managing all test results.

## Project Structure

```
project-structure/
│
├── public/                     # Static files (CSS, JS, assets)
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript files
│   └── assets/                 # Images and other assets
│
├── views/                      # EJS templates
│   ├── layouts/                # Layout templates (header, footer, navigation)
│   ├── appointment.ejs         # Appointment booking page
│   ├── driverDashboard.ejs     # Dashboard for drivers
│   ├── drivers.ejs             # Admin view to manage drivers
│   ├── examiner.ejs            # Examiner dashboard
│   ├── g.ejs                   # G test booking page
│   ├── g2.ejs                  # G2 test booking page
│   ├── index.ejs               # Home page
│   ├── login.ejs               # Login page
│   ├── signup.ejs              # Signup page
│
├── models/                     # Mongoose models
│   ├── Appointment.js          # Appointment model schema
│   └── Users.js                # User model schema
│
├── middleware/                 # Middleware for the application
│   └── authMiddleware.js       # Authentication and authorization middleware
│
├── controllers/                # Controllers for handling routes and logic
│   ├── appointmentController.js# Handles appointment-related logic
│   ├── authController.js       # Handles authentication (login, signup)
│   ├── examinerController.js   # Handles examiner-related logic
│   ├── pageRouteController.js  # Routes for rendering pages
│   └── userController.js       # Handles user-related logic
│
├── .env                        # Environment variables
├── .env-example                # Example of environment variables file
├── .gitignore                  # Files to ignore in version control
├── index.js                    # Main application file
├── package.json                # NPM package configuration
├── package-lock.json           # NPM package lock file
└── README.md                   # Project documentation
```

## Installation

### 1. **Clone the Repository**

```bash
git clone https://github.com/Yash19Yp/Driving-Test.git
cd Driving-Test
```

### 2. **Install Dependencies**

Install all the required npm packages:

```bash
npm install
```

### 3. **Configure Environment Variables**

Create a `.env` file in the root directory and add your environment variables:

```bash
MONGO_URI=your_mongodb_connection_string
PORT=3000
SESSION_SECRET=secret_key_for_session
```

### 4. **Run the Application**

Start the application using the following command:

```bash
npm start
```

### 5. **Access the Application**

Open your browser and go to `http://localhost:3000` to access the application.

## Features

- **Driver Interface**: Allows users to book G2 and G driving tests, view their appointment details, and check test results.
- **Examiner Interface**: Provides examiners with a list of drivers to assess, allowing them to update test results and add comments.
- **Admin Interface**: Admins can schedule appointments and filtering test results by pass/fail status.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **EJS**
- **Mongoose**s
