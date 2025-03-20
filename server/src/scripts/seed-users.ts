import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/user.model';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// MongoDB connection
const connectDB = async (): Promise<mongoose.Connection> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

// Test users data
interface TestUser {
  username: string;
  email: string;
  password: string;
}

const users: TestUser[] = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123456' // Daha uzun şifre
  },
  {
    username: 'testuser',
    email: 'test@example.com',
    password: 'test123456' // Daha uzun şifre
  },
  {
    username: 'demo',
    email: 'demo@example.com',
    password: 'demo123456' // Daha uzun şifre
  }
];

// Seed database with users
const seedUsers = async (): Promise<void> => {
  try {
    await connectDB();
    // Clear existing users
    await User.deleteMany({});
    console.log('Users cleared');
    
    // Create new users
    for (const user of users) {
      await User.create({
        ...user,
        // Password will be hashed by the User model pre-save middleware
        password: user.password
      });
      console.log(`Created user: ${user.username} (${user.email})`);
    }
    
    console.log('Database seeded successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

// Run the seeder
seedUsers(); 