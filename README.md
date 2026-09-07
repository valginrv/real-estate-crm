# Real Estate CRM

## Project Overview

A full-stack CRM application for managing real estate leads,
properties, bookings, and sales employees.

## Tech Stack

- Angular
- Bootstrap
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Features

- Admin and Sales Employee login
- Lead management
- Lead assignment
- Lead stage tracking
- Project, building and unit management
- Property booking
- Double booking prevention
- Dashboard statistics
- Role-based access control

## Local Setup

### Backend

cd backend
npm install
npm start

### Frontend

cd frontend
npm install
ng serve

## Environment Variables

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

## API Overview

POST /api/auth/register
POST /api/auth/login
GET /api/leads
POST /api/leads
PUT /api/leads/:id
DELETE /api/leads/:id

GET /api/users/sales
GET /api/properties
GET /api/bookings
POST /api/bookings

## Important Decisions

1. JWT is used for authentication.
2. Role-based middleware protects admin-only APIs.
3. MongoDB references connect leads, users, and units.
4. Atomic unit update prevents double booking.
5. Bootstrap is used for responsive UI.

