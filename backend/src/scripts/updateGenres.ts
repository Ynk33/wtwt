import dotenv from 'dotenv';

import { connectToDatabase } from '@config/database';
import movieService from '@services/movieService';

dotenv.config();

async function updateGenres() {
  try {
    await connectToDatabase();
    await movieService.syncGenres();
    console.log('✅ Genres updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating genres:', error);
    process.exit(1);
  }
}

updateGenres();
