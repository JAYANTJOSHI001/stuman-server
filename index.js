import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes.js';
import { startDailySync } from './jobs/dailySyncJob.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', studentRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => console.log('Server running on port 5000'));
  startDailySync();
}).catch(console.error);
