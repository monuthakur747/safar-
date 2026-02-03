import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import packageRoutes from "./routes/packages.route";
import authRoutes from "./routes/auth.route";
import { testMailConnection } from "./services/mailService";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/safar", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test mail connection on startup
testMailConnection().then((success) => {
  if (success) {
    console.log("Email service is ready");
  } else {
    console.warn("Email service might not be configured properly");
  }
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "Server is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
