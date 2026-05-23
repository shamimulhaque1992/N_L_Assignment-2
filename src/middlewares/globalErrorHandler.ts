import type { Request, Response } from "express";
import { sendResponse } from "../utility/sendResponse";

export const globalErrorHandler = (
  error: Error & { statusCode?: number },
  req: Request,
  res: Response,
) => {
  sendResponse(res, {
    success: false,
    message: error.message || "Something went wrong",
    status: error.statusCode ?? 500,
    errors: { message: error.message, stack: error.stack },
  });
};
