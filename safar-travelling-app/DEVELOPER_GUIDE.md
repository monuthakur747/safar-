# Developer Guide - Extending the Authentication System

This guide explains how to extend or modify the OTP-based authentication system.

## Project Structure Overview

```
server/src/
├── models/              # MongoDB schemas
│   ├── User.ts         # User data model
│   └── OTP.ts          # OTP data model
├── routes/             # API endpoints
│   ├── auth.route.ts   # Authentication endpoints
│   └── packages.route.ts # Travel packages endpoints
├── services/           # Business logic
│   └── mailService.ts  # Email sending logic
├── utils/              # Utility functions
│   └── authUtils.ts    # Auth helper functions
└── index.ts            # Server entry point

client/src/
├── contexts/           # State management
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── SignUp.jsx      # Sign up page
│   └── Home.jsx        # Protected home page
├── App.jsx             # Router setup
└── index.jsx           # Entry point
```

## Common Tasks

### 1. Adding a New Authentication Route

Example: Add password reset functionality

**Step 1:** Create endpoint in `server/src/routes/auth.route.ts`

```typescript
// Request OTP for password reset
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: "If email exists, OTP will be sent" });
    }

    // Generate and save OTP
    const otp = generateOTP();
    await OTP.deleteMany({ email, purpose: "password-reset" });
    
    const newOTP = new OTP({
      email,
      otp,
      purpose: "password-reset",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
    });
    
    await newOTP.save();
    await sendOTPEmail({ email, otp, purpose: "password-reset" });

    res.json({ message: "Password reset OTP sent to email", email });
  } catch (error) {
    console.error("[Auth] Reset password error:", error);
    res.status(500).json({ error: "Failed to process password reset" });
  }
});

// Verify reset password OTP and set new password
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    // Validate passwords
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Find and verify OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: "password-reset",
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Update user password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    user.password = await hashPassword(newPassword);
    await user.save();
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("[Auth] Reset password verify error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});
```

**Step 2:** Add corresponding frontend functions to `client/src/contexts/AuthContext.jsx`

```typescript
const requestPasswordResetOTP = async (email) => {
  try {
    setError(null);
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return { data, error: null };
  } catch (err) {
    const errorMsg = err.message || "Failed to request OTP";
    setError(errorMsg);
    return { data: null, error: err };
  }
};

const verifyPasswordResetOTP = async (email, otp, newPassword, confirmPassword) => {
  try {
    setError(null);
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return { data, error: null };
  } catch (err) {
    const errorMsg = err.message || "Failed to reset password";
    setError(errorMsg);
    return { data: null, error: err };
  }
};
```

### 2. Modifying OTP Settings

Change OTP expiration time in `server/src/models/OTP.ts`:

```typescript
expiresAt: {
  type: Date,
  required: true,
  default: () => new Date(Date.now() + 15 * 60 * 1000), // Change to 15 minutes
},
```

Change max attempts in `server/src/models/OTP.ts`:

```typescript
attempts: {
  type: Number,
  default: 0,
  max: 10, // Change to 10 attempts
},
```

### 3. Customizing Email Templates

Edit `server/src/services/mailService.ts` function `getEmailTemplate()`:

```typescript
function getEmailTemplate(
  otp: string,
  purpose: "signup" | "login" | "password-reset"
): string {
  // Customize HTML template here
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Your custom styles */
        </style>
      </head>
      <body>
        <!-- Your custom template -->
      </body>
    </html>
  `;
}
```

### 4. Adding User Profile Data

Extend User model in `server/src/models/User.ts`:

```typescript
export interface IUser extends Document {
  email: string;
  password: string;
  isEmailVerified: boolean;
  firstName?: string;      // Add new fields
  lastName?: string;
  phoneNumber?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { /* ... */ },
    password: { /* ... */ },
    isEmailVerified: { /* ... */ },
    firstName: String,     // Add to schema
    lastName: String,
    phoneNumber: String,
    profilePicture: String,
  },
  { timestamps: true }
);
```

### 5. Adding Role-Based Access Control

Add role field to User model:

```typescript
interface IUser extends Document {
  email: string;
  password: string;
  role: "user" | "admin" | "moderator"; // Add role
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  // ... existing fields
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user",
  },
});
```

Create middleware in `server/src/routes/auth.route.ts`:

```typescript
function authRequired(req: Request, res: Response, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = decoded;
  next();
}

function adminOnly(req: Request, res: Response, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
```

### 6. Adding Rate Limiting

Install package:
```bash
npm install express-rate-limit
```

Add to `server/src/index.ts`:

```typescript
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many attempts, try again later",
});

app.post("/api/auth/signup-request-otp", authLimiter, ...);
app.post("/api/auth/login-request-otp", authLimiter, ...);
```

### 7. Adding Audit Logging

Create model in `server/src/models/AuditLog.ts`:

```typescript
import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  userId: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failure";
  details: any;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: String,
    action: String,
    ipAddress: String,
    userAgent: String,
    status: { type: String, enum: ["success", "failure"] },
    details: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
```

### 8. Testing Authentication Endpoints

Use cURL or Postman:

```bash
# Request signup OTP
curl -X POST http://localhost:5000/api/auth/signup-request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify signup OTP
curl -X POST http://localhost:5000/api/auth/verify-otp-signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456","password":"Pass123","confirmPassword":"Pass123"}'

# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Best Practices

1. **Always validate input:**
   ```typescript
   if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
     return res.status(400).json({ error: "Invalid email" });
   }
   ```

2. **Hash sensitive data:**
   ```typescript
   const hashedPassword = await hashPassword(password);
   ```

3. **Use async/await for clarity:**
   ```typescript
   try {
     const result = await operation();
     // Handle result
   } catch (error) {
     // Handle error
   }
   ```

4. **Don't expose sensitive information:**
   ```typescript
   // Bad: reveals if user exists
   res.status(400).json({ error: "User not found" });
   
   // Good: generic message
   res.json({ message: "If email exists, OTP will be sent" });
   ```

5. **Log important events:**
   ```typescript
   console.log("[Auth] User signed up:", email);
   console.log("[Auth] Login attempt failed:", email);
   ```

6. **Use environment variables for config:**
   ```typescript
   const jwtSecret = process.env.JWT_SECRET;
   const mailService = process.env.MAIL_SERVICE;
   ```

## Testing Checklist

- [ ] New endpoint works in Postman
- [ ] Error messages are user-friendly
- [ ] Database operations are atomic
- [ ] Sensitive data is hashed/encrypted
- [ ] Rate limiting is applied if needed
- [ ] CORS is properly configured
- [ ] Input validation is comprehensive
- [ ] Logging is adequate for debugging
- [ ] Tests pass locally
- [ ] Documentation is updated

## Debugging Tips

1. **Check backend logs:**
   - Look at Terminal 1 output
   - Search for "[v0]" prefix for debug statements

2. **Check frontend console:**
   - Press F12 in browser
   - Look for console.log and error messages

3. **Database inspection:**
   ```bash
   # Using MongoDB CLI
   mongosh
   use safar
   db.users.find()
   db.otps.find()
   ```

4. **API testing:**
   ```bash
   curl http://localhost:5000/health
   ```

## Performance Optimization

1. **Database indexing:**
   - Email unique index speeds lookups
   - TTL index auto-deletes old OTPs

2. **Caching:**
   - Cache user data in Redis for frequently accessed users
   - Reduce database queries

3. **Query optimization:**
   - Only fetch needed fields
   - Use pagination for large result sets

## Security Hardening

1. **Input validation:**
   ```typescript
   const sanitize = (input: string) => input.trim().toLowerCase();
   ```

2. **SQL injection prevention:**
   - Use MongoDB's native driver (already safe)
   - Validate all inputs

3. **CSRF protection:**
   ```typescript
   app.use(csrf());
   ```

4. **HTTPS enforcement:**
   - Use in production
   - Redirect HTTP to HTTPS

---

For more help, check:
- `AUTH_SETUP.md` - Setup documentation
- `QUICK_START.md` - Quick reference
- Server logs for debugging
- Browser console for frontend issues
