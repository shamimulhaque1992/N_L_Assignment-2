import type { Request, Response } from "express";
import { sendResponse } from "../utility/sendResponse";

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
) => {
  sendResponse(res, {
    success: false,
    message: error.message || "Something went wrong",
    status: 500,
    error: error,
  });
};
