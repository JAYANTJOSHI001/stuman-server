import Student from '../models/Student.js';
import axios from 'axios';
import { fetchCodeforcesData } from '../utils/fetchCodeforces.js';
import { sendReminderEmail } from '../utils/emailer.js';

export const getAllStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

export const addStudent = async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.status(201).json(student);
};


export const updateStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(student);
};

export const deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};


export const getStudentPro = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) return res.status(404).json({ error: "Student not found" });

    const cfHandle = student.cfHandle;
    let ratingHistory = [];
    let recentContests = [];
    let problemBuckets = [];
    let heatmap = [];
    let originalData = {};

    if (cfHandle) {
      try {
        const [ratingRes, statusRes] = await Promise.all([
          axios.get(`https://codeforces.com/api/user.rating?handle=${cfHandle}`),
          axios.get(`https://codeforces.com/api/user.status?handle=${cfHandle}`)
        ]);

        const now = new Date();
        const submissions = statusRes.data.result;

        if (ratingRes.data.status === "OK") {
          const ratingData = ratingRes.data.result;

          ratingHistory = ratingData.map(item => ({
            date: new Date(item.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
            rating: item.newRating,
            contestId: item.contestId,
            contestName: item.contestName
          }));

          recentContests = ratingData
            .slice(-5)
            .reverse()
            .map(item => ({
              name: item.contestName,
              change: item.newRating - item.oldRating,
              rank: item.rank,
              contestId: item.contestId,
              date: new Date(item.ratingUpdateTimeSeconds * 1000).toLocaleDateString()
            }));

          originalData.ratingData = ratingData;
        }

        const problemMap = new Map();
        const bucketMap = new Map();
        heatmap = Array(30).fill(0);

        submissions.forEach(sub => {
          if (
            sub.verdict === "OK" &&
            sub.problem &&
            sub.problem.rating &&
            !problemMap.has(sub.problem.name)
          ) {
            problemMap.set(sub.problem.name, true);

            const rating = sub.problem.rating;
            bucketMap.set(rating, (bucketMap.get(rating) || 0) + 1);

            const subDate = new Date(sub.creationTimeSeconds * 1000);
            const diff = Math.floor((now - subDate) / (1000 * 60 * 60 * 24));
            if (diff < 30) {
              heatmap[29 - diff]++;
            }
          }
        });

        problemBuckets = Array.from(bucketMap.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([rating, count]) => ({ rating, count }));

        originalData.statusData = submissions;
      } catch (cfError) {
        console.error("Codeforces API error:", cfError.message);
        return res.status(502).json({ error: "Failed to fetch Codeforces data" });
      }
    }

    res.json({
      profile: student,
      ratingHistory,
      contests: recentContests,
      heatmap,
      problemBuckets,
      originalData,
    });
  } catch (err) {
    console.error("Error fetching student profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const syncStudentData = async (req, res) => {
  const students = await Student.find();
  for (const student of students) {
    try {
      const data = await fetchCodeforcesData(student.cfHandle);
      student.currentRating = data.currentRating;
      student.maxRating = data.maxRating;
      student.contestHistory = data.contestHistory;
      student.problemStats = data.problemStats;
      student.lastSynced = new Date();

      if (data.problemStats.recentActivity === 0 && !student.emailOptOut) {
        await sendReminderEmail(student.email, student.name);
        student.reminderCount += 1;
      }

      await student.save();
    } catch (err) {
      console.error(`Failed syncing ${student.cfHandle}:`, err.message);
    }
  }
  res.json({ message: 'Sync complete' });
};
