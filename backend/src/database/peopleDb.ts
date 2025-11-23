import { AnyBulkWriteOperation, ObjectId } from 'mongodb';

import { People, PeopleResponse } from '@types';
import AbstractModelDb from '@database/abstractModelDb';

class PeopleDb extends AbstractModelDb<People> {
  protected getCollectionName(): string {
    return 'people';
  }

  public async findWithIds(ids: ObjectId[]) {
    return this.collection.find({ _id: { $in: ids } }).toArray();
  }

  public async findWithTmdbIds(tmdbIds: number[]) {
    return this.collection
      .find({
        'externalIds.tmdbId': { $in: tmdbIds },
      })
      .toArray();
  }

  public async sync(people: PeopleResponse[]) {
    const peopleUpsertBulkOperations: Array<AnyBulkWriteOperation<People>> = [];

    people.forEach((person) => {
      peopleUpsertBulkOperations.push({
        updateOne: {
          filter: { externalIds: person.externalIds },
          update: {
            $set: {
              externalIds: person.externalIds,
              name: person.name,
              photoUrl: person.photoUrl,
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

    return this.collection.bulkWrite(peopleUpsertBulkOperations);
  }
}

const instance = new PeopleDb();
export default instance;
