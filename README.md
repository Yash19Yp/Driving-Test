# Drive Test Assignment

## Project Structure

```
project-Sturcture/
│
├── public/                     # Static files (CSS, JS, assets)
│   ├── css/
│   ├── js/
│   └── assets/
│
├── views/                      # EJS templates
│   ├── layouts/                # Layout templates
│   ├── index.ejs               # Home page
│   ├── appointment.ejs         # Appointment page
│   ├── login.ejs               # Login page
│   ├── signup.ejs              # Signup page
│   ├── g2.ejs                  # G2 test booking page
│   └── g.ejs                   # G test page
│
├── models/                     # Mongoose models
│   ├── Appointment.ejs         # Appointment Modal
│   └── Users.js                # Users model
│
├── middleware/                 # Middleware
│   └── authMiddleware.js       # Auth middleware
|
├── Controllers/                # Mongoose Controllers
│   ├── authController.js       # Authentication Controllers
│   ├── appointmentController.js# Appointment Controllers
│   ├── pageRouteController.js  # Routes for the pages
│   └── userController.js       # User Controllers Functions
│
├── index.js                    # Main application file
├── .env                        # environment variables
├── package.json                # NPM package file
└── README.md                   # Project documentation
```

## Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   add the following in .env file

   ```bash
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   SESSTION_SECRET=secret_key_for_session
   ```

3. **Run the Application**

   ```bash
   npm start
   ```

4. **Access the Application**
   Open your browser and go to `http://localhost:3000`
