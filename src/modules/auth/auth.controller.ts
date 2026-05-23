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
      message: "User create successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "User could not be created",
      error: (error as Error).message,
    });
  }
};

const logIn = async (req: Request, res: Response) => {
  try {
    const result = await authService.logIn(req.body);
    const { refresh_token } = result || {};

    res.cookie("refresh_token", refresh_token, {
      secure: config.env === "production",
      httpOnly: true,
      sameSite: "lax",
    });

    const response = prepareAuthSuccessResponse(result);
    sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: "User logged in successfully",
      data: response,
    });
  } catch (error) {
    sendResponse(res, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "User could not be logged in",
      error: (error as Error).message,
    });
  }
};
const refreshToken = (req: Request, res: Response) => {};

export const authController = {
  signUp,
  logIn,
  refreshToken,
};
