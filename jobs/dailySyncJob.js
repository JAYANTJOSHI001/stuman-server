import cron from 'node-cron';
import axios from 'axios';

export const startDailySync = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log("Starting daily sync at 2 AM...");
    try {
      await axios.post('http://localhost:5000/api/sync');
      console.log("Daily sync completed.");
    } catch (err) {
      console.error("Sync failed:", err.message);
    }
  });
};
