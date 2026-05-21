import type { Request, Response } from "express";
import { sendResponse } from "../../utility/sendResponse";
import { authService } from "./auth.service";

const signUp = async (req: Request, res: Response) => {
  try {
    const result = await authService.signUp(req.body);
    sendResponse(res, {
      status: 201,
      success: true,
      message: "User create successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      status: 500,
      success: false,
      message: "User could not be created",
      error: error,
    });
  }
};

const logIn = (req: Request, res: Response) => {};
const refreshToken = (req: Request, res: Response) => {};

export const authController = {
  signUp,
  logIn,
  refreshToken,
};
