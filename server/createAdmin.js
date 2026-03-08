// Create a default admin user for the Pharmacy System
// Run this ONCE: node server/createAdmin.js

import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existing = await User.findOne({ email: "admin@pharmacy.pk" });
    if (existing) {
      console.log("Admin user already exists!");
      console.log("Email: admin@pharmacy.pk");
      console.log("Password: admin123");
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const hashedPassword = bcryptjs.hashSync("admin123", 10);
    const admin = new User({
      username: "PharmaCare Admin",
      email: "admin@pharmacy.pk",
      phonenumber: "03001234567",
      address: "Hayatabad Phase 4, Peshawar",
      password: hashedPassword,
      avatar:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    });

    await admin.save();
    console.log("");
    console.log("========================================");
    console.log("  Admin User Created Successfully!");
    console.log("========================================");
    console.log("");
    console.log("  Email:    admin@pharmacy.pk");
    console.log("  Password: admin123");
    console.log("");
    console.log("  Use these credentials to login at the portal.");
    console.log("");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
