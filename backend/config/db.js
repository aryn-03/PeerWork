import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI || mongoURI.includes('your_mongodb_atlas_connection_string_here')) {
    console.error('\x1b[33m%s\x1b[0m', '==================================================');
    console.error('\x1b[33m%s\x1b[0m', 'WARNING: MONGO_URI is missing or set to placeholder!');
    console.error('\x1b[33m%s\x1b[0m', 'Please update the MONGO_URI in your backend/.env file.');
    console.error('\x1b[33m%s\x1b[0m', 'Database connections will fail until configured.');
    console.error('\x1b[33m%s\x1b[0m', '==================================================');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `MongoDB Connection Error: ${error.message}`);
    console.error('\x1b[33m%s\x1b[0m', 'Please check your MONGO_URI in backend/.env.');
  }
};
