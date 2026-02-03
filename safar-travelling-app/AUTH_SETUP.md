# OTP-Based Email Authentication Setup

This guide explains how to set up and configure the OTP-based email authentication system for the Safar travelling app using Nodemailer.

## Overview

The authentication system includes:
- User sign-up with OTP verification via email
- User login with OTP verification via email
- 6-digit OTP with 10-minute expiration
- Max 5 attempt limit before OTP expiration
- Secure JWT-based session management
- MongoDB for user and OTP storage

## Prerequisites

- Node.js (v14+) and npm installed
- MongoDB (local or cloud instance like MongoDB Atlas)
- Gmail account (or other email service) for sending OTPs
- The Safar travelling app cloned and ready to run

## Step 1: Set Up MongoDB

### Option A: Local MongoDB

1. Download and install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   mongod
   ```
3. Default connection string: `mongodb://localhost:27017/safar`

### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a user and whitelist your IP
4. Get your connection string from the cluster overview
5. Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/safar`

## Step 2: Configure Email Service (Gmail)

### Using Gmail

1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left menu
3. Enable "2-Step Verification" if not already enabled
4. Go to "App passwords" and select:
   - App: Mail
   - Device: Windows Computer (or your device)
5. Copy the generated app password (16 characters)
6. Use this password in your `.env` file as `MAIL_PASSWORD`

### Using Other Email Services

Update `MAIL_SERVICE` in your `.env` file. Supported services:
- `gmail`
- `outlook`
- `yahoo`
- `aol`
- Or configure a custom SMTP server

## Step 3: Install Dependencies

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd ../client
npm install
```

## Step 4: Configure Environment Variables

### Backend (.env in server directory)

Create a `.env` file in the `/server` directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/safar
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
MAIL_SERVICE=gmail
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password_here
```

### Frontend (.env.local in client directory)

Create a `.env.local` file in the `/client` directory:

```
VITE_API_URL=http://localhost:5000/api
```

## Step 5: Run the Application

### Terminal 1: Start Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

### Terminal 2: Start Frontend Development Server

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Testing the Authentication Flow

### Sign Up Flow

1. Click "Sign up" on the login page
2. Enter email, password, and confirm password
3. Click "Get OTP"
4. Check your email for the 6-digit OTP
5. Enter the OTP and click "Verify OTP"
6. You should be logged in and redirected to the home page

### Login Flow

1. Click "Login" (if logged out)
2. Enter your email
3. Click "Request OTP"
4. Check your email for the 6-digit OTP
5. Enter the OTP and click "Login"
6. You should be logged in

## API Endpoints

### Authentication Routes

**POST** `/api/auth/signup-request-otp`
- Request OTP for signup
- Body: `{ email: "user@example.com" }`

**POST** `/api/auth/verify-otp-signup`
- Verify OTP and create account
- Body: `{ email, otp, password, confirmPassword }`

**POST** `/api/auth/login-request-otp`
- Request OTP for login
- Body: `{ email: "user@example.com" }`

**POST** `/api/auth/verify-otp-login`
- Verify OTP and login
- Body: `{ email, otp }`

**GET** `/api/auth/me`
- Get current user (requires Bearer token)
- Header: `Authorization: Bearer <token>`

## Troubleshooting

### OTP not being sent

1. Check email credentials in `.env`:
   - Ensure `MAIL_USER` is correct
   - Ensure `MAIL_PASSWORD` is the app-specific password (not your regular Gmail password)
   - For Gmail, enable "Less secure app access" if using regular password

2. Check MongoDB connection:
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env`

3. Check server logs for errors

### OTP expired

- OTP automatically expires after 10 minutes
- Request a new OTP by clicking "Back" and requesting again

### Max attempts reached

- If you enter wrong OTP 5 times, the OTP is invalidated
- Request a new OTP

### Can't login after signup

1. Ensure email is verified (check spam folder for OTP email)
2. Ensure you entered the correct OTP
3. Check that the backend server is running

## Security Notes

- OTPs are 6-digit random numbers
- OTPs expire after 10 minutes
- Max 5 verification attempts per OTP
- Passwords are hashed using bcryptjs before storage
- JWTs are signed with JWT_SECRET
- Always use HTTPS in production
- Change JWT_SECRET in production to a strong, random value
- Never commit `.env` files to version control

## Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` to a strong random string
2. Use a production MongoDB instance (MongoDB Atlas)
3. Use a production email service (SendGrid, AWS SES, etc.)
4. Set `VITE_API_URL` to your production backend URL
5. Enable HTTPS on your server
6. Add CORS configuration for your domain
7. Set proper environment variables in your hosting platform

## Support

For issues or questions, check:
- Browser console for frontend errors
- Server logs for backend errors
- MongoDB connection status
- Email service credentials
