
# TrainEase - Train Booking System - Backend

TrainEase is a web and mobile applications system for managing train bookings and shedules. It's backend API provides functionality to search for trains, view schedules, make bookings, and handle user authentication. The system is designed to integrate with both both web and mobile applications. It facilitates seamless operations for users. Additionally, it allow administrators to manage the system effectively. Admins can update train schedules, see charts for bookings, revenue and user registrations along with smooth operations.

## Features

- **User Authentication:** JWT-based authentication with user roles and permissions.

- **Train Schedule Management:** API to handle train scheduling and availability.
  

- **Seat Booking System:** Endpoints for users to book available seats and view selected seats.
  

- **Admin Panel:** Admin users can manage train schedules, bookings, and user accounts via dedicated routes.

- **Seeding:** Predefined data seeding for testing the database with initial data. 

## Routes Overview

- **/api/trains:** Retrieve available trains and schedules.
- **/api/bookings:** Handle seat reservations and bookings.
- **/api/users:** User login, registration, and profile management.
- **/api/admin:** Admin-only routes for managing trains, bookings, and users.

## Tech Stack

  - [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
  - [Express](https://expressjs.com/) - A minimal and flexible Node.js web application framework.
  - [MongoDB](https://www.mongodb.com/) - A NoSQL database for flexible document storage.
  - [Mongoose](https://mongoosejs.com/) - ODM for MongoDB for defining models and data relationships.
  - [JWT](https://jwt.io/) - For secure user authentication.


## Prerequisites

- **Node.js:** [Download Node.js](https://nodejs.org/) and install it on your machine.
- **npm:** Node Package Manager (npm) is included with Node.js.
- **MongoDB:** Ensure you have MongoDB is installed and running.

## Installation
1. Clone the repository

    ```bash
   git clone https://github.com/DimalshaMadushani/TrainEase-Backend.git

   cd TrainEase-Backend
2. Install the dependencies

    ```bash
    yarn install
    OR
   npm install
3. Create an .env file to store environment variables

    ```bash
   HOST="your-ipv4-address"
   JWT_SECRET
   EMAIL_USER
   EMAIL_PASSWORD
   STRIPE_SECRET_KEY
   DB_URL
   

4. Start the development server

    ```
    npm start
    ```

## Deployment

We built our backend on [Render](https://render.com/) plaform. You can access the deployed backend at [TrainEase](https://trainease-backend.onrender.com).
