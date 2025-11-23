import 'tsconfig-paths-bootstrap';

import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';

import { connectToDatabase, stopDatabase } from '@config/database';
import router from '@routes/routes';
import * as response from '@utils/response';

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.use(express.json());

// Initialize routes
app.use('/api', router);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  response.error(res, err);
});

const start = async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

start().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/api`);
  });
});

process.on('SIGINT', async () => {
  await stopDatabase();
  process.exit(0);
});
