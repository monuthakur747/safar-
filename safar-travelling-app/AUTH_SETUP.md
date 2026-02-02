# Email Verification Authentication Setup

This guide explains how to set up and configure the email verification authentication system for the Safar travelling app using Supabase.

## Overview

The authentication system includes:
- User sign-up with email verification
- Email verification via confirmation links
- Secure login with email confirmation check
- Account protection with verified email requirement
- Ability to resend confirmation emails

## Prerequisites

- A Supabase account (https://supabase.com)
- Node.js and npm installed
- The Safar travelling app cloned and ready to run

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in or create an account
2. Click "New Project" to create a new project
3. Enter a project name (e.g., "safar-travelling")
4. Choose a database password (save this securely)
5. Select your preferred region
6. Click "Create new project" and wait for it to initialize

## Step 2: Configure Authentication

1. In your Supabase project dashboard, go to **Authentication** > **Providers**
2. Ensure **Email** provider is enabled
3. Go to **Authentication** > **Email Templates**
4. Update the Confirmation Link email template to use your app's callback URL:
   - Replace the confirmation link URL with: `{{ .ConfirmationURL }}`
   - Make sure it points to `https://yourdomain.com/auth/callback`

## Step 3: Get API Keys

1. Go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** - This is your `VITE_SUPABASE_URL`
   - **anon public** key - This is your `VITE_SUPABASE_ANON_KEY`

## Step 4: Configure Environment Variables

### Frontend (.env.local in client directory)

Create a `.env.local` file in the `/client` directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Backend (.env in server directory)

Create a `.env` file in the `/server` directory:

```env
MONGODB_URI=your_mongodb_uri_here
PORT=5000
```

## Step 5: Install Dependencies

From the root directory, install all dependencies:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

## Step 6: Configure Callback URL

1. In Supabase, go to **Authentication** > **URL Configuration**
2. Add your app's callback URL under "Redirect URLs":
   - For local development: `http://localhost:5173/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`

## Step 7: Test Email Sending (Optional)

By default, Supabase uses a test email service in development. To receive real emails:

1. Go to **Settings** > **Email**
2. Either:
   - Use Supabase's built-in email (comes with limited free quota)
   - Or configure your own SMTP provider

For development, you can use Supabase's test mode which logs emails to the console.

## Running the Application

### Development

```bash
# Terminal 1: Start the frontend (from client directory)
cd client
npm run dev

# Terminal 2: Start the backend (from server directory)
cd server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Production

Build and deploy using your preferred hosting platform (Vercel, Netlify, etc.)

## User Flow

### Sign Up
1. User clicks "Sign Up" on the login page
2. Enters email and password
3. Receives confirmation email with verification link
4. Clicks link in email
5. Email is marked as confirmed in Supabase
6. User can now log in

### Login
1. User enters email and password
2. System checks if email is confirmed
3. If not confirmed, shows "Email not confirmed" error
4. User can click "Resend" to get another confirmation link
5. Once confirmed, login succeeds

### Resend Confirmation
1. User clicks "Resend Confirmation" link
2. Enters their email
3. Receives another confirmation email
4. Follows the verification process again

## File Structure

```
client/src/
├── contexts/
│   └── AuthContext.jsx          # Auth state management
├── lib/
│   └── supabase.js              # Supabase client config
├── pages/
│   ├── Login.jsx                # Login page with email verification check
│   ├── SignUp.jsx               # Sign up page
│   ├── AuthCallback.jsx         # Email verification callback handler
│   ├── ResendConfirmation.jsx   # Resend confirmation page
│   └── Home.jsx                 # Protected home page
└── App.jsx                      # Routes and auth provider setup
```

## Troubleshooting

### "Email not confirmed" Error

This means the user hasn't clicked the confirmation link yet. Solutions:
- Check spam/junk folder for confirmation email
- Click the "Resend Confirmation" link to get a new email
- Check Supabase email templates are configured correctly

### Not Receiving Confirmation Emails

1. Check Supabase email logs in **Auth** > **User Management**
2. Verify callback URL is correct in **Settings** > **URL Configuration**
3. Check email template configuration in **Authentication** > **Email Templates**
4. For development, check browser console for test email logs

### Environment Variables Not Working

- Make sure `.env.local` is in the correct directory (`/client` for frontend)
- Restart the development server after adding env variables
- Environment variables must start with `VITE_` to be accessible in frontend

### Redirect Loop

If you're stuck in a redirect loop:
1. Clear browser cookies for the domain
2. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
3. Check that your Supabase redirect URLs are correctly configured

## Security Notes

- Never commit `.env.local` or `.env` files to git
- The `VITE_SUPABASE_ANON_KEY` is public and safe to expose
- Supabase handles password hashing and storage securely
- All auth tokens are HTTP-only cookies when possible
- Email confirmation is required before account access

## Next Steps

After authentication is working:
1. Connect your existing packages API to the authenticated users
2. Add user profiles and preferences
3. Implement booking system with user verification
4. Add admin dashboard for managing packages

## Support

For Supabase-specific issues:
- Check Supabase documentation: https://supabase.com/docs
- Visit Supabase community: https://discord.supabase.io

For app-specific issues:
- Check the browser console for error messages
- Look at Supabase logs in the dashboard
- Verify all environment variables are set correctly
