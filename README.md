# Safar - Travel Discoveries App

Safar is a modern travel application that helps users discover amazing travel destinations and book travel packages with secure OTP-based authentication powered by Nodemailer.

## Features

- **OTP-Based Authentication**: Secure login and signup with email OTP verification via Nodemailer
- **Travel Packages**: Browse and explore travel packages
- **User Profiles**: Manage personal travel preferences
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Next.js 16**: Modern React framework with App Router
- **Email Verification**: Secure account verification via Nodemailer

## Tech Stack

### Frontend
- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Lucide React Icons

### Backend
- Node.js with Express
- MongoDB
- Nodemailer for email OTP
- JWT for authentication
- bcryptjs for password hashing

## Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email OTP)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB and Gmail credentials
```

### 3. Start Backend Server (Terminal 1)
```bash
cd safar-travelling-app/server
npm install
npm run dev
```

### 4. Start Frontend (Terminal 2)
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (safar-travelling-app/server/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/safar
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
MAIL_SERVICE=gmail
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password_here
```

## Authentication Flow

### Sign Up
1. User enters email, password, and confirms password
2. Click "Get OTP" - OTP is sent to their email via Nodemailer
3. Enter the 6-digit OTP received in email
4. Account is created and user is logged in

### Login
1. User enters email
2. Click "Request OTP" - OTP is sent to their email
3. Enter the 6-digit OTP received in email
4. User is logged in

### Logout
1. Click "Logout" button
2. Session is cleared and user is redirected to login

## Project Structure

```
safar-travelling-app/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Home page (protected)
│   ├── login/page.tsx     # Login page
│   ├── signup/page.tsx    # Signup page
│   └── globals.css        # Global styles
├── lib/
│   └── auth-context.tsx   # Authentication context
├── safar-travelling-app/
│   └── server/            # Express backend
│       ├── src/
│       │   ├── models/    # MongoDB models
│       │   ├── routes/    # API routes
│       │   ├── services/  # Business logic
│       │   └── index.ts   # Server entry point
│       └── package.json
└── .env.example           # Environment variables template
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/signup-request-otp` - Request OTP for signup
- `POST /api/auth/verify-otp-signup` - Verify OTP and create account
- `POST /api/auth/login-request-otp` - Request OTP for login
- `POST /api/auth/verify-otp-login` - Verify OTP and login

### Travel Packages
- `GET /api/packages` - Get all travel packages
- `POST /api/packages` - Create new package (admin)
- `PUT /api/packages/:id` - Update package (admin)
- `DELETE /api/packages/:id` - Delete package (admin)

## Security Features

- 6-digit OTP with 10-minute expiration
- Max 5 verification attempts per OTP
- Password hashing with bcryptjs
- JWT-based session management
- CORS protection
- Input validation and sanitization

## Gmail Configuration for Nodemailer

To use Gmail for sending OTPs:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password at: https://myaccount.google.com/apppasswords
3. Use the 16-character password in `MAIL_PASSWORD`
4. Set `MAIL_USER` to your Gmail email address

## Testing

### Sign Up Test
1. Go to `http://localhost:3000/signup`
2. Enter test email, password
3. Click "Get OTP"
4. Check email for OTP
5. Enter OTP and sign up

### Login Test
1. Go to `http://localhost:3000/login`
2. Enter your registered email
3. Click "Request OTP"
4. Check email for OTP
5. Enter OTP and login

## Troubleshooting

**OTP not received?**
- Check spam folder
- Ensure `MAIL_USER` and `MAIL_PASSWORD` are correct
- For Gmail, use app-specific password, not your regular password

**MongoDB connection error?**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

**Can't login after signup?**
- Ensure correct OTP from email
- Check that backend server is running
- Verify email address is correct

**Next.js error about pages directory?**
- Ensure you're at the root of the project
- All auth pages are in `/app` directory

## Deployment

### Deploy to Vercel (Frontend)
```bash
npm run build
git push  # Will trigger Vercel deployment
```

### Deploy Backend
Backend can be deployed to services like:
- Railway
- Render
- Heroku
- AWS EC2

## Documentation

For detailed setup and configuration, see:
- `safar-travelling-app/AUTH_SETUP.md` - Authentication setup guide
- `safar-travelling-app/QUICK_START.md` - Quick start guide
- `safar-travelling-app/DEVELOPER_GUIDE.md` - Developer guide

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes

## Support

For issues and questions:
- Check the troubleshooting section
- Review backend logs in server terminal
- Check browser console for frontend errors
- Verify all environment variables are set correctly
