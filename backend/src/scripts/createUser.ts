import 'tsconfig-paths-bootstrap';

import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

import { connectToDatabase, getDatabase } from '@config/database';
import { hashPassword, question } from '@scripts/utils';

dotenv.config();

async function createUser() {
  try {
    await connectToDatabase();
    const db = getDatabase();

    const username = await question('Enter username:');
    const email = await question('Enter email:');
    const password = await question('Enter password:');

    const hashedPassword = await hashPassword(password);

    const user = {
      _id: new ObjectId(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(user);

    console.log('✅ User created successfully!');
    console.log('User ID:', result.insertedId);
    console.log('Username:', username);
    console.log('Email:', email);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    process.exit(1);
  }
}

createUser();
