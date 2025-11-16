# EVENTORA - Event Management Platform

A full-stack event management platform built with React, Tailwind CSS, and Node.js/Express backend.

## Features

### For Clients
- Browse and search event services
- Filter services by category
- View detailed service information
- Create and manage events
- Book multiple services for events
- Track event status

### For Vendors
- Create vendor account
- Add and manage services
- Upload service photos
- Set pricing and availability
- Manage service listings

## Getting Started

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file in backend directory with:
```
PORT=4000
CLIENT_URL=http://localhost:5173
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
```

3. Start the backend server:
```bash
npm start
```

Backend will run on http://localhost:4000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env` file in frontend directory:
```
VITE_API_URL=http://localhost:4000/api
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## Usage

### Creating a Client Account
1. Go to home page
2. Click "Book Services" or "Register"
3. Fill in details and select role as "Client"
4. Login with your credentials

### Creating a Vendor Account
1. Go to home page
2. Click "Become a Vendor" or "Register"
3. Fill in details and select role as "Vendor"
4. Login with your credentials

### For Vendors - Adding Services
1. Login as vendor
2. Go to Dashboard
3. Click "Add New Service"
4. Fill in service details and upload photos
5. Submit to create service

### For Clients - Booking Services
1. Login as client
2. Browse services
3. View service details
4. Click "Book This Service"
5. Fill in event details and select services
6. Submit to create event booking

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Axios
- Vite

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt
- Cookie Parser
- AWS S3 for image storage

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API configuration
│   ├── components/       # Reusable components
│   ├── context/          # React context (Auth)
│   ├── pages/            # Page components
│   │   ├── client/       # Client-specific pages
│   │   └── vendor/       # Vendor-specific pages
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point

backend/
├── config/               # Database configuration
├── controllers/          # Route controllers
├── middlewares/          # Custom middlewares
├── models/               # Mongoose models
├── routes/               # Route definitions
└── utils/                # Utility functions
```

## API Endpoints

### User
- POST `/api/user/register` - Register new user
- POST `/api/user/login` - Login user
- POST `/api/user/logout` - Logout user
- GET `/api/user/profile` - Get user profile

### Services
- GET `/api/service` - List all services
- GET `/api/service/:id` - Get service details
- GET `/api/service/account` - Get vendor's services
- POST `/api/service` - Create service (vendor only)
- PUT `/api/service` - Update service (vendor only)
- DELETE `/api/service` - Delete service (vendor only)

### Events
- GET `/api/event/account` - Get client's events
- GET `/api/event/:id` - Get event details
- POST `/api/event` - Create event (client only)
- PUT `/api/event` - Update event
- DELETE `/api/event` - Delete event

## Security

- JWT-based authentication
- Password hashing with bcrypt
- HTTP-only cookies
- CORS enabled
- Protected routes for role-based access
