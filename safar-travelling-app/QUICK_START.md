# Quick Start Guide - OTP Authentication with Nodemailer

This guide will help you get the Safar app running with OTP-based authentication using Nodemailer.

## What Was Changed

The authentication system has been updated from Supabase email verification links to **OTP (One-Time Password) verification using Nodemailer**.

### Key Changes:
- ✅ Removed Supabase dependency
- ✅ Added Nodemailer for sending OTP emails
- ✅ Implemented MongoDB for user and OTP storage
- ✅ Added JWT-based session management
- ✅ Created OTP verification flow (6-digit code, 10-minute expiry)
- ✅ Added bcrypt for password hashing

## Prerequisites

1. **Node.js** v14+ (download from https://nodejs.org/)
2. **MongoDB** (either local or MongoDB Atlas cloud)
3. **Gmail Account** (or another email service)

## Step 1: Get Gmail App Password

1. Go to https://myaccount.google.com/
2. Click "Security" in the left sidebar
3. Enable "2-Step Verification" if not already enabled
4. Click "App passwords"
5. Select Mail and Windows Computer
6. Copy the 16-character password
7. **Keep this safe** - you'll need it in `.env`

## Step 2: Set Up MongoDB

### Option A: Local MongoDB (Recommended for Development)
```bash
# Download from https://www.mongodb.com/try/download/community
# Install and run
mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get connection string: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/safar`

## Step 3: Configure Environment Variables

### Backend (.env file in `server` directory)

```bash
cd server
cp ../.env.example .env
```

Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/safar
JWT_SECRET=your_super_secret_key_here_12345
MAIL_SERVICE=gmail
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_16_char_app_password
```

### Frontend (.env.local file in `client` directory)

```bash
cd ../client
```

Create `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Install Dependencies

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

## Step 5: Start the Application

### Terminal 1: Start Backend Server
```bash
cd server
npm run dev
```

You should see:
```
Server is running on http://localhost:5000
MongoDB connected
Email service is ready
```

### Terminal 2: Start Frontend (in a new terminal)
```bash
cd client
npm run dev
```

The frontend will open at `http://localhost:5173`

## Step 6: Test the Authentication Flow

### Create a New Account

1. Click **"Sign up"** on the login page
2. Enter:
   - Email: `test@example.com`
   - Password: `TestPassword123`
   - Confirm Password: `TestPassword123`
3. Click **"Get OTP"**
4. Check your email for the OTP code
5. Enter the 6-digit code
6. Click **"Verify OTP"**
7. ✅ You're now logged in!

### Login with Your Account

1. Click **"Back"** or refresh and click **"Login"**
2. Enter your email
3. Click **"Request OTP"**
4. Check your email for the OTP
5. Enter the code and click **"Login"**
6. ✅ You're logged in again!

## Troubleshooting

### "OTP not received in email?"

1. ✅ Check SPAM folder
2. ✅ Verify `MAIL_USER` is correct in `.env`
3. ✅ For Gmail, use the 16-character app password (not your regular password)
4. ✅ Check backend logs for errors (Terminal 1)

### "MongoDB connection error?"

1. ✅ Is MongoDB running? 
   - Check: `mongod` process should be running
2. ✅ Verify `MONGODB_URI` in `.env`
3. ✅ If using MongoDB Atlas, check the connection string

### "Can't login after signup?"

1. ✅ Verify you used the correct OTP from email
2. ✅ Is backend server running? (Terminal 1)
3. ✅ Check browser console (F12) for errors

### "Port already in use?"

Change the port in `server/.env`:
```
PORT=5001  # or any available port
```

Then update frontend `.env.local`:
```
VITE_API_URL=http://localhost:5001/api
```

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup-request-otp` - Get OTP for signup
- `POST /api/auth/verify-otp-signup` - Verify and create account
- `POST /api/auth/login-request-otp` - Get OTP for login
- `POST /api/auth/verify-otp-login` - Verify and login
- `GET /api/auth/me` - Get current user (needs token)

### Packages
- `GET /api/packages` - Get all packages
- `POST /api/packages` - Create package
- `GET /api/packages/:id` - Get package details
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package

## Project Structure

```
safar-travelling-app/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx            # OTP login page
│   │   │   ├── SignUp.jsx           # OTP signup page
│   │   │   └── Home.jsx             # Protected home page
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Authentication state
│   │   ├── App.jsx                  # Routing setup
│   │   └── index.jsx                # Entry point
│   ├── .env.local                   # Frontend config
│   └── package.json
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.route.ts        # Auth endpoints
│   │   │   └── packages.route.ts    # Package endpoints
│   │   ├── models/
│   │   │   ├── User.ts              # User schema
│   │   │   └── OTP.ts               # OTP schema
│   │   ├── services/
│   │   │   └── mailService.ts       # Email sending
│   │   ├── utils/
│   │   │   └── authUtils.ts         # Auth functions
│   │   └── index.ts                 # Server entry
│   ├── .env                         # Backend config
│   └── package.json
│
├── .env.example                     # Config template
├── AUTH_SETUP.md                    # Detailed setup guide
├── README.md                        # Project overview
└── QUICK_START.md                   # This file
```

## Next Steps

1. ✅ Test the app locally
2. ✅ Add more travel packages in database
3. ✅ Customize styling in `/client/src/pages/`
4. ✅ Add user profile pages
5. ✅ Deploy to production

## Security Reminders

⚠️ **Before Production:**
- Change `JWT_SECRET` to a long random string
- Use production MongoDB (MongoDB Atlas)
- Use production email service (SendGrid, AWS SES)
- Enable HTTPS
- Add CORS for your domain
- Don't commit `.env` files to git

## Need Help?

1. Check `AUTH_SETUP.md` for detailed configuration
2. Check `README.md` for project overview
3. Look at server logs (Terminal 1) for errors
4. Check browser console (F12) for frontend errors

## Common Commands

```bash
# Start backend
cd server && npm run dev

# Start frontend
cd client && npm run dev

# Build for production
cd client && npm run build
cd ../server && npm run build

# Install new package
npm install package-name

# View server logs
# Just check Terminal 1 output
```

---

Happy coding! ✈️ Safar app is ready to go!
