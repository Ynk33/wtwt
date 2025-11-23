import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

let db: Db;
let mongoServer: MongoMemoryServer | null = null;

export const connectToDatabase = async () => {
  let mongoUri: string;
  const dbName = process.env.MONGODB_DB || 'wtwt2';

  if (process.env.MONGODB_URI) {
    mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to real MongoDB...');
  } else {
    console.log('Starting MongoDB Memory Server...');
    mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    console.log('MongoDB Memory Server started on:', mongoUri);
  }

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to database:', dbName);
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};

export const stopDatabase = async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
};
