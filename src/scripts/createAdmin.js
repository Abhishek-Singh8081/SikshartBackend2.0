import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
import bcrypt from 'bcryptjs';
import Admin from '../models/admin.model.js';

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Current working directory:', process.cwd());
console.log('MONGODB_URI:', MONGODB_URI);

const adminEmail = 'admin@shikshart.com';
const adminPassword = 'admin123';
const adminName = 'Super Admin';

async function createAdmin() {
  await mongoose.connect(MONGODB_URI);
  const existing = await Admin.findOne({ email: adminEmail });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    process.exit(0);
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const admin = new Admin({
    name: adminName,
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
  });
  await admin.save();
  console.log('Admin created:', admin.email);
  process.exit(0);
}

createAdmin(); 