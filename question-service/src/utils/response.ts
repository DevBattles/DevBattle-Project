import { Response } from 'express';
import { HttpStatus } from '../constants/httpStatus';

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data?: T;
}

/** Standardised success response envelope. */
export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
): Response => {
  const body: ApiSuccess<T> = { success: true, message, ...(data !== undefined ? { data } : {}) };
  return res.status(statusCode).json(body);
};

/** Alias used by most controllers for a 200 OK. */
export const ok = <T>(res: Response, message: string, data?: T): Response =>
  sendSuccess(res, HttpStatus.OK, message, data);

export const created = <T>(res: Response, message: string, data?: T): Response =>
  sendSuccess(res, HttpStatus.CREATED, message, data);
