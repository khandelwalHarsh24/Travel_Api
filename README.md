# Railway Management System

This project is a Railway Management System similar to IRCTC, developed using Node.js, Express, and PostgreSQL. The system allows users to check train availability, seat availability, and book seats in real-time. It supports multiple stoppages between source and destination stations and handles role-based access for admin and regular users.

## Features

- **User Registration**: Allows new users to register with a hashed password.
- **User Login**: Users can log in to their accounts and receive an authorization token.
- **Admin Operations**: Admin can add new trains and manage seat availability.
- **Train Availability**: Users can check the availability of trains between two stations with multiple stoppages.
- **Seat Booking**: Users can book seats on available trains.
- **Booking Details**: Users can get specific booking details.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **PostgreSQL**: Relational database management system.
- **bcryptjs**: Library to hash passwords.
- **jsonwebtoken**: Library to generate and verify JSON Web Tokens (JWT).

## Installation

### Prerequisites

- Node.js and npm installed on your machine.
- PostgreSQL installed and running.

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/railway-management-system.git
   cd railway-management-system

2. Install dependencies:
 
   npm install

3. Set up PostgreSQL database and tables:

CREATE DATABASE railway_management;

\c railway_management

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user'))
);

CREATE TABLE trains (
    id SERIAL PRIMARY KEY,
    train_number VARCHAR(50) UNIQUE NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL
);

CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE train_routes (
    id SERIAL PRIMARY KEY,
    train_id INTEGER NOT NULL,
    station_id INTEGER NOT NULL,
    stop_order INTEGER NOT NULL,
    FOREIGN KEY (train_id) REFERENCES trains (id) ON DELETE CASCADE,
    FOREIGN KEY (station_id) REFERENCES stations (id) ON DELETE CASCADE
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    train_id INTEGER NOT NULL,
    source_station_id INTEGER NOT NULL,
    destination_station_id INTEGER NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (train_id) REFERENCES trains (id),
    FOREIGN KEY (source_station_id) REFERENCES stations (id),
    FOREIGN KEY (destination_station_id) REFERENCES stations (id)
);


4. Create .env file having a database credentials and jwt secret.
    
  PG_USER: 'your_database_user',
  PG_PASSWORD: 'your_database_password',
  PG_DB: 'your_database_name',
  PG_HOST: 'your_database_host',
  PG_PORT: 5432,
  JWT_SECRET: 'your_jwt_secret_key',
  ADMIN_API_KEY: 'your_admin_api_key'

5. Start the Sever

   node index.js
