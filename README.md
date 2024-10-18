
# TrainEase - Train Booking System - Backend

TrainEase is a backend system for managing train bookings and shedules. This backend API provides functionality to search for trains, view schedules, make reservations, and handle user authentication. The system is designed to integrate with both both web and mobile applications. It facilitates seamless operations for users. Additionally, it allow administrators to manage the system effectively. Admins can update train schedules, see charts for bookings, revenue and user registrations along with smooth operations.

## Features

- **User Authentication:** Provides secure login and registration, along with password recovery via email for easy account access. 
  

- **Ticket Booking:** Allows users to select their starting point, destination, and travel date, displaying available trains for easy selection.
  

- **Class and Seat Selection:** Users can choose their preferred travel class (First, Second, Third) and view an interactive seat layout showing available and booked seats.
  

- **Payment Processing:** Offers secure payment processing via Stripe API ensuring users receive e-ticket confirmations via email after successful transactions.
  
- **Profile Management:** Enables users to edit and manage their personal profile details for a personalized experience.
  

- **Booking History:** Allows users to access and review past bookings for easy reference and planning.

- **Booking Cancellations:** Provides the option to cancel bookings before the travel date, ensuring flexibility for users.

- **Real-Time Notifications:** Sends timely updates regarding booking confirmations, cancellations, and schedule changes to keep users informed.
  

- **Logout Option:** Allows users to securely sign out, protecting their personal data and account information.
  

## Tech Stack

  - [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
  - [Express](https://expressjs.com/) - A minimal and flexible Node.js web application framework.


## Prerequisites

- **Node.js:** [Download Node.js](https://nodejs.org/) and install it on your machine.
- **npm:** Node Package Manager (npm) is included with Node.js.

## Installation
1. Clone the repository

    ```bash
   git clone https://github.com/DimalshaMadushani/TrainEase-Frontend-Web.git

   cd TrainEase-Frontend-Web
2. Install the dependencies

    ```bash
    yarn install
    OR
   npm install
3. Create an .env file to store environment variables

    ```bash
   VITE_HOST="your-ipv4-address"
   VITE_EMAIL_VALIDATION_API_KEY
   VITE_STRIPE_PUBLIC_KEY

4. Start the development server

    ```
    npm run dev
    ```



## Testing

We use Cypress for User Interface testing. You can run tests using

```
npx cypress open
```

## Deployment

We built our web application on [Render](https://render.com/) plaform. You can access the live application at [TrainEase](https://trainease-frontend-web.onrender.com).
