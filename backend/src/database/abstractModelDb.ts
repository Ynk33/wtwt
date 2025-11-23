import { Collection, Db } from 'mongodb';

import { getDatabase } from '@config/database';

abstract class AbstractModelDb<T extends Document> {
  private _db: Db | null = null;
  private _collection: Collection<T> | null = null;

  protected abstract getCollectionName(): string;

  protected get db(): Db {
    if (!this._db) {
      this._db = getDatabase();
    }
    return this._db;
  }

  protected get collection(): Collection<T> {
    if (!this._collection) {
      this._collection = this.db.collection<T>(this.getCollectionName());
    }

    return this._collection;
  }
}

export default AbstractModelDb;
