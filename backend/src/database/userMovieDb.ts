import { ObjectId } from 'mongodb';

import { UserMovie } from '@types';
import AbstractModelDb from '@database/abstractModelDb';

class UserMovieDb extends AbstractModelDb<UserMovie> {
  protected getCollectionName(): string {
    return 'userMovies';
  }

  public async getFavoriteMovies(userId: ObjectId, limit: number) {
    return this.collection
      .find({
        userId,
        isWatched: true,
      })
      .sort({ rating: -1 })
      .limit(limit)
      .project({
        movieId: 1,
        rating: 1,
        review: 1,
      })
      .toArray();
  }

  public async getRating(userId: ObjectId, movieId: ObjectId) {
    return this.collection.findOne({ userId, movieId });
  }

  public async rateMovie(
    userId: ObjectId,
    movieId: ObjectId,
    rating?: number,
    review?: string
  ) {
    return this.collection.updateOne(
      { userId, movieId },
      {
        $set: { isWatched: true, rating, review, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
  }

  public async removeReview(userId: ObjectId, movieId: ObjectId) {
    return this.collection.deleteOne({ userId, movieId });
  }
}

const instance = new UserMovieDb();
export default instance;
