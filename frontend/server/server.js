import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5050;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smarthire";
const JWT_SECRET = process.env.JWT_SECRET || "smarthire_jwt_secret_token_key_123";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "users.json");

let useLocalDb = false;

// Local JSON Database Helpers
function readUsers() {
  if (!fs.existsSync(DB_FILE)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch (e) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf-8");
}

// MongoDB Connection with timeout
mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(async () => {
    console.log("Connected to MongoDB successfully");
    await seedHR();
  })
  .catch(async (err) => {
    console.warn("\n⚠️ MongoDB connection failed. Falling back to local file database (users.json)!");
    useLocalDb = true;
    await seedHRLocal();
  });

// Seed default HR account (MongoDB)
async function seedHR() {
  try {
    const hrExists = await User.findOne({ role: "hr" });
    if (!hrExists) {
      console.log("No HR account found. Seeding default HR account...");
      const hashedPassword = await bcrypt.hash("hrpassword123", 10);
      const defaultHR = new User({
        name: "HR Manager",
        email: "hr@smarthire.com",
        password: hashedPassword,
        role: "hr",
      });
      await defaultHR.save();
      console.log("Default HR account seeded successfully!");
      console.log("Email: hr@smarthire.com | Password: hrpassword123");
    } else {
      console.log("HR accounts already exist. Seeding skipped.");
    }
  } catch (error) {
    console.error("Error seeding HR account:", error);
  }
}

// Seed default HR account (Local JSON)
async function seedHRLocal() {
  try {
    const users = readUsers();
    const hrExists = users.some((u) => u.role === "hr");
    if (!hrExists) {
      console.log("No HR account found. Seeding default HR account in local DB...");
      const hashedPassword = await bcrypt.hash("hrpassword123", 10);
      const defaultHR = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "HR Manager",
        email: "hr@smarthire.com",
        password: hashedPassword,
        role: "hr",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(defaultHR);
      writeUsers(users);
      console.log("Default HR account seeded successfully in local DB!");
      console.log("Email: hr@smarthire.com | Password: hrpassword123");
    } else {
      console.log("HR accounts already exist in local DB. Seeding skipped.");
    }
  } catch (error) {
    console.error("Error seeding HR account locally:", error);
  }
}

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (useLocalDb) {
      const users = readUsers();
      const user = users.find((u) => u._id === decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
      return next();
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// API Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const name = `${firstName.trim()} ${lastName.trim()}`;
    const emailLower = email.toLowerCase().trim();

    if (useLocalDb) {
      const users = readUsers();
      const existingUser = users.find((u) => u.email === emailLower);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name,
        email: emailLower,
        password: hashedPassword,
        role: "applicant",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(newUser);
      writeUsers(users);
      return res.status(201).json({ message: "User registered successfully" });
    }

    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: emailLower,
      password: hashedPassword,
      role: "applicant",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const emailLower = email.toLowerCase().trim();
    let user;

    if (useLocalDb) {
      const users = readUsers();
      user = users.find((u) => u.email === emailLower);
    } else {
      user = await User.findOne({ email: emailLower });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const userId = useLocalDb ? user._id : user._id.toString();
    const token = jwt.sign({ id: userId, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const userId = useLocalDb ? req.user._id : req.user._id.toString();
    res.json({
      user: {
        id: userId,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error fetching user profile" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
