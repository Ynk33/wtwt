import { NextFunction, Request, Response } from 'express';

import * as response from '@utils/response';

export const home = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  return response.success(res, { message: 'Hello World' });
};
