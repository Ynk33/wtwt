import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

import { connectToDatabase } from '@config/database';
import { LLM_LATEST_WATCHED_MOVIES_LIMIT } from '@config/llm.conf';
import movieService from '@services/movieService';

dotenv.config();

async function getFavoriteMovies() {
  try {
    await connectToDatabase();
    const userId = process.env.USER_ID;
    const favoriteMovies = await movieService.getFavoriteMovies({
      userId: new ObjectId(userId),
      limit: LLM_LATEST_WATCHED_MOVIES_LIMIT,
    });
    console.log('✅ Favorite movies:', favoriteMovies);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error getting favorite movies:', error);
    process.exit(1);
  }
}

getFavoriteMovies();
