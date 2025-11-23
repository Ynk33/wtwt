import dotenv from 'dotenv';

import { connectToDatabase } from '@config/database';
import movieService from '@services/movieService';

dotenv.config();

async function updateGenres() {
  try {
    await connectToDatabase();
    await movieService.syncCountries();
    console.log('✅ Countries updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating countries:', error);
    process.exit(1);
  }
}

updateGenres();
