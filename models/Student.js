import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  cfHandle: { type: String, unique: true },
  currentRating: Number,
  maxRating: Number,
  lastSynced: Date,
  contestHistory: Array,
  problemStats: {
    mostDifficult: Number,
    totalSolved: Number,
    avgRating: Number,
    avgPerDay: Number,
    buckets: Object,
    recentActivity: Number
  },
  solvedProblems: [{ 
    contestId: Number, 
    index: String, 
    name: String, 
    rating: Number, 
    tags: [String], 
    solvedTime: Date 
  }],
  reminderCount: { type: Number, default: 0 },
  emailOptOut: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);