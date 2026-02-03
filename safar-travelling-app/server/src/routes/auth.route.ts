import express, { Request, Response } from "express";
import { User } from "../models/User";
import { OTP } from "../models/OTP";
import { sendOTPEmail } from "../services/mailService";
import {
  hashPassword,
  comparePassword,
  generateOTP,
  generateToken,
  verifyToken,
} from "../utils/authUtils";

const router = express.Router();

// Request OTP for signup
router.post("/signup-request-otp", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email, purpose: "signup" });

    // Save new OTP
    const newOTP = new OTP({
      email,
      otp,
      purpose: "signup",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await newOTP.save();

    // Send OTP via email
    await sendOTPEmail({ email, otp, purpose: "signup" });

    res.json({ message: "OTP sent to your email", email });
  } catch (error) {
    console.error("[Auth] Signup OTP error:", error);
    res.status(500).json({ error: "Failed to request OTP" });
  }
});

// Verify OTP and register
router.post("/verify-otp-signup", async (req: Request, res: Response) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Find and verify OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: "signup",
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user && user.isEmailVerified) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    if (user) {
      // Update existing unverified user
      user.password = hashedPassword;
      user.isEmailVerified = true;
    } else {
      // Create new user
      user = new User({
        email,
        password: hashedPassword,
        isEmailVerified: true,
      });
    }

    await user.save();

    // Delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    res.json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[Auth] Verify signup OTP error:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

// Request OTP for login
router.post("/login-request-otp", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: "OTP sent to your email if account exists" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email, purpose: "login" });

    // Save new OTP
    const newOTP = new OTP({
      email,
      otp,
      purpose: "login",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await newOTP.save();

    // Send OTP via email
    await sendOTPEmail({ email, otp, purpose: "login" });

    res.json({ message: "OTP sent to your email", email });
  } catch (error) {
    console.error("[Auth] Login OTP error:", error);
    res.status(500).json({ error: "Failed to request OTP" });
  }
});

// Verify OTP for login
router.post("/verify-otp-login", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Find and verify OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: "login",
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      // Increment attempts
      const failedOtp = await OTP.findOne({ email, purpose: "login" });
      if (failedOtp) {
        failedOtp.attempts += 1;
        if (failedOtp.attempts >= 5) {
          await OTP.deleteOne({ _id: failedOtp._id });
          return res.status(400).json({ error: "Max attempts reached. Request new OTP." });
        }
        await failedOtp.save();
      }
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[Auth] Verify login OTP error:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

// Get current user (verify token)
router.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("[Auth] Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

export default router;
