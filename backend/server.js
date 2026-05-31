import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import bidRoutes from './routes/bids.js';

dotenv.config();

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
const allowedOrigins = [
  'https://peer-work-ycq7.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/bids', bidRoutes);

app.get('/', (req, res) => {
  res.send('Freelance Portal API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));