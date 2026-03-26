import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Demo user data (for testing without MongoDB)
const DEMO_USER = {
  id: "demo-user",
  email: "john.doe@example.com",
  password: "password123",
  name: "John Doe",
};

// Export demo user getter
export function getDemoUser() {
  return {
    id: DEMO_USER.id,
    email: DEMO_USER.email,
    name: DEMO_USER.name,
    password: DEMO_USER.password,
  };
}

// Register user in MongoDB
export async function registerUser(email, password, name) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = new User({
    email,
    password,
    name,
    isDemo: false,
  });

  await user.save();

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
}

// Authenticate user from MongoDB
export async function authenticateUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  return user;
}

export function generateToken(userId) {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET || "your_secret_key",
    { expiresIn: process.env.JWT_EXPIRE || "7d" },
  );
  return token;
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key",
    );
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
