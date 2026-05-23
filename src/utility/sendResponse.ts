import type { Response } from "express";

type TResponse<T> = {
  status: number;
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
};

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  return res.status(data.status).json({
    success: data.success,
    message: data.message,
    data: data.data,
    errors: data.errors,
  });
};
