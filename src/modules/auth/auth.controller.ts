import type { Request, Response } from "express";
import { sendResponse } from "../../utility/sendResponse";
import { authService } from "./auth.service";
import { prepareAuthSuccessResponse } from "./auth.helper";
import config from "../../config";
import { StatusCodes } from "http-status-codes";

const signUp = async (req: Request, res: Response) => {
  try {
    const result = await authService.signUp(req.body);
    sendResponse(res, {
      status: StatusCodes.CREATED,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      status: (error as any).statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Could not create user",
      errors: (error as Error).message,
    });
  }
};

const logIn = async (req: Request, res: Response) => {
  try {
    const result = await authService.logIn(req.body);

    const response = prepareAuthSuccessResponse(result);
    sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: "Login successful",
      data: response,
    });
  } catch (error) {
    sendResponse(res, {
      status: (error as any).statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Login failed",
      errors: (error as Error).message,
    });
  }
};
const refreshToken = (req: Request, res: Response) => {};

export const authController = {
  signUp,
  logIn,
  refreshToken,
};
