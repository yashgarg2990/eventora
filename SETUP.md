# EVENTORA Setup Guide

## Quick Start

Your event management platform is ready with two separate interfaces:

### 1. Backend (Already configured)
- Location: `backend/` directory
- MongoDB connection configured
- All APIs ready

### 2. Frontend (New React App)
- Location: `frontend/` directory
- Built with React + Tailwind CSS
- Fully functional UI for clients and vendors

## Running the Application

### Start Backend
```bash
cd backend
npm start
```
Runs on: http://localhost:4000

### Start Frontend
```bash
cd frontend
npm run dev
```
Runs on: http://localhost:5173

## User Flows

### Client Flow
1. Register as "Client"
2. Browse services at /services
3. View service details
4. Book services by creating an event
5. Manage events at /client/events

### Vendor Flow
1. Register as "Vendor"
2. Go to dashboard at /vendor/dashboard
3. Add services with photos
4. Manage service listings
5. View and edit services

## Key Features Built

### Client Side
- Service browsing with search and filters
- Service detail pages
- Event creation with multiple service booking
- Event management dashboard
- Protected client routes

### Vendor Side
- Vendor dashboard
- Add/Edit/Delete services
- Photo upload support
- Service management
- Protected vendor routes

### Authentication
- JWT-based authentication
- Role-based access control
- Secure login/register flows
- Protected routes for both roles

## Configuration Files

- `frontend/.env` - API URL configuration
- `backend/.env` - Database and JWT secrets (already configured)

All set to go!
