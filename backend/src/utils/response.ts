import { Response } from 'express';

export const success = (res: Response, data: object, status: number = 200) => {
  res.status(status).json({ status: 'ok', data });
};

export const error = (
  res: Response,
  error: Error | string,
  status: number = 500
) => {
  res.status(status).json({
    status: 'error',
    error: error instanceof Error ? error.message : error,
  });
};
