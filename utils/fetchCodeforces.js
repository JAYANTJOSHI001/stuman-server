import axios from 'axios';

export const fetchCodeforcesData = async (handle) => {
  const userInfo = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
  const contests = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
  const submissions = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&count=10000`);

  const ratings = contests.data.result;
  const allSubs = submissions.data.result;

  const last7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentSubs = allSubs.filter(s => new Date(s.creationTimeSeconds * 1000) > last7);
  const solved = new Map();

  allSubs.forEach(sub => {
    if (sub.verdict === "OK") {
      const key = sub.problem.contestId + "-" + sub.problem.index;
      solved.set(key, sub.problem.rating || 0);
    }
  });

  return {
    currentRating: userInfo.data.result[0].rating || 0,
    maxRating: userInfo.data.result[0].maxRating || 0,
    contestHistory: ratings,
    problemStats: {
      mostDifficult: Math.max(...[...solved.values()]),
      totalSolved: solved.size,
      avgRating: (Array.from(solved.values()).reduce((a, b) => a + b, 0) / solved.size).toFixed(2),
      avgPerDay: (solved.size / (allSubs.length ? 90 : 1)).toFixed(2),
      buckets: countBuckets([...solved.values()]),
      recentActivity: recentSubs.length
    }
  };
};

function countBuckets(arr) {
  const buckets = {};
  arr.forEach(r => {
    const key = Math.floor(r / 100) * 100;
    buckets[key] = (buckets[key] || 0) + 1;
  });
  return buckets;
}
