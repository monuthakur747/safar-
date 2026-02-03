# Safar - Travel Discoveries App

Safar is a modern travel application that helps users discover amazing travel destinations and book travel packages with secure OTP-based authentication.

## Features

- **OTP-Based Authentication**: Secure login and signup with email OTP verification
- **Travel Packages**: Browse and explore travel packages
- **User Profiles**: Manage personal travel preferences
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Email Verification**: Secure account verification via Nodemailer

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Vite

### Backend
- Node.js with Express
- MongoDB
- Nodemailer for email OTP
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
safar-travelling-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components (Login, SignUp, Home, etc.)
│   │   ├── contexts/      # React contexts (AuthContext)
│   │   ├── lib/           # Utilities (Supabase client, etc.)
│   │   ├── App.jsx        # Main app component with routing
│   │   └── index.jsx      # Entry point
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes (auth.route.ts, packages.route.ts)
│   │   ├── models/        # MongoDB models (User.ts, OTP.ts)
│   │   ├── services/      # Business logic (mailService.ts)
│   │   ├── utils/         # Utilities (authUtils.ts)
│   │   └── index.ts       # Server entry point
│   ├── prisma/            # Database schema
│   └── package.json
├── .env.example           # Environment variables template
├── AUTH_SETUP.md          # Detailed authentication setup guide
└── README.md
```

## Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email OTP)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd safar-travelling-app
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp ../.env.example .env
   # Edit .env with your MongoDB URI and email credentials
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## Environment Variables

### Backend (.env in server directory)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/safar
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
MAIL_SERVICE=gmail
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password_here
```

### Frontend (.env.local in client directory)
```
VITE_API_URL=http://localhost:5000/api
```

See `AUTH_SETUP.md` for detailed configuration instructions.

## Authentication Flow

### Sign Up
1. User enters email, password, and confirms password
2. Click "Get OTP" - OTP is sent to their email
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

## API Endpoints

### Authentication Routes
- `POST /api/auth/signup-request-otp` - Request OTP for signup
- `POST /api/auth/verify-otp-signup` - Verify OTP and create account
- `POST /api/auth/login-request-otp` - Request OTP for login
- `POST /api/auth/verify-otp-login` - Verify OTP and login
- `GET /api/auth/me` - Get current user (requires Bearer token)

### Travel Packages
- `GET /api/packages` - Get all travel packages
- `POST /api/packages` - Create new package (admin)
- `GET /api/packages/:id` - Get package details
- `PUT /api/packages/:id` - Update package (admin)
- `DELETE /api/packages/:id` - Delete package (admin)

## Security Features

- 6-digit OTP with 10-minute expiration
- Max 5 verification attempts per OTP
- Password hashing with bcryptjs
- JWT-based session management
- CORS protection
- Input validation and sanitization

## Running the Application

### Terminal 1: Start Backend
```bash
cd server
npm run dev
```

### Terminal 2: Start Frontend
```bash
cd client
npm run dev
```

## Testing

### Sign Up Test
1. Go to `http://localhost:5173`
2. Click "Sign up"
3. Enter test email: `test@example.com`
4. Enter password: `Test@123`
5. Click "Get OTP"
6. Check your email for OTP
7. Enter OTP and click "Verify OTP"

### Login Test
1. Enter the same email used during signup
2. Click "Request OTP"
3. Check email for OTP
4. Enter OTP and click "Login"

## Troubleshooting

For detailed troubleshooting, see the **Troubleshooting** section in `AUTH_SETUP.md`.

### Common Issues

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

## Building for Production

### Frontend
```bash
cd client
npm run build
```

### Backend
```bash
cd server
npm run build
```

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For issues and questions:
- Check `AUTH_SETUP.md` for authentication setup help
- Review server logs for backend errors
- Check browser console for frontend errors
- Verify all environment variables are set correctly

---

Happy travels with Safar! ✈️
