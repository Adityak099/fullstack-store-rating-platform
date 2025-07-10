import { listen } from './app.js';
import { syncDatabase } from './models/index.js';

const PORT = process.env.PORT || 5000;

syncDatabase()
  .then(() => {
    console.log('Database synced successfully');
    listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database sync failed:', err.message);
    console.log('Starting server without database connection...');
    listen(PORT, () => {
      console.log(`Server running on port ${PORT} (Database connection failed)`);
    });
  });