import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

import { connectToDatabase, getDatabase } from '@config/database';
import recommendationsService from '@services/recommendationsService';

dotenv.config();

async function generateRecommendations() {
  try {
    await connectToDatabase();
    const db = getDatabase();
    const users = await db.collection('users').find({}).toArray();
    console.log(`Generating recommendations for ${users.length} users...`);

    for (const user of users) {
      console.log(`Generating recommendations for user ${user.username}...`);

      const recommendations =
        await recommendationsService.getNewRecommendationsFor(user._id);

      await db.collection('recommendations').updateOne(
        { userId: user._id },
        {
          $set: {
            recommendations: recommendations.map((recommendedMovie) => {
              return {
                movieId: new ObjectId(recommendedMovie._id),
                reason: recommendedMovie.reason,
              };
            }),
            createdAt: new Date(),
          },
          $setOnInsert: {
            _id: new ObjectId(),
            userId: user._id,
          },
        },
        { upsert: true }
      );
      console.log(`✅ Recommendations generated for user ${user.username}!`);
    }

    console.log('✅ Recommendations generated successfully!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error generating recommendations:', err);
    process.exit(1);
  }
}

generateRecommendations();
