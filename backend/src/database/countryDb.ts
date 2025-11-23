import { AnyBulkWriteOperation, ObjectId } from 'mongodb';

import { Country, TMDBCountry } from '@types';
import AbstractModelDb from '@database/abstractModelDb';

class CountryDb extends AbstractModelDb<Country> {
  protected getCollectionName(): string {
    return 'countries';
  }

  public async getCountries() {
    return this.collection.find().toArray();
  }

  public async sync(countries: TMDBCountry[]) {
    const countriesUpsertBulkOperations: Array<AnyBulkWriteOperation<Country>> =
      [];
    countries.forEach((country) => {
      countriesUpsertBulkOperations.push({
        updateOne: {
          filter: { iso_3166_1: country.iso_3166_1 },
          update: {
            $set: {
              ...country,
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

    return this.collection.bulkWrite(countriesUpsertBulkOperations);
  }
}

const instance = new CountryDb();
export default instance;
