import { AnyBulkWriteOperation, ObjectId } from 'mongodb';

import { Genre, GenreResponse } from '@types';
import AbstractModelDb from '@database/abstractModelDb';

class GenreDb extends AbstractModelDb<Genre> {
  protected getCollectionName(): string {
    return 'genres';
  }

  public async getGenres() {
    return this.collection.find().toArray();
  }

  public async sync(genres: GenreResponse[]) {
    const genresUpsertBulkOperations: Array<AnyBulkWriteOperation<Genre>> = [];
    genres.forEach((genre) => {
      genresUpsertBulkOperations.push({
        updateOne: {
          filter: { externalIds: genre.externalIds },
          update: {
            $set: {
              name: genre.name,
              updatedAt: new Date(),
            },
            $setOnInsert: {
              _id: new ObjectId(),
              createdAt: new Date(),
            },
          },
          upsert: true,
        },
      });
    });

    return this.collection.bulkWrite(genresUpsertBulkOperations);
  }
}

const instance = new GenreDb();
export default instance;
