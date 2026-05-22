import type { APP_ROLES } from "../type";
import { sendResponse } from "../utility/sendResponse";
import config from "../config";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import type { Request, Response, NextFunction } from "express";

export const authMiddleware = (...roles: APP_ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return sendResponse(res, {
          success: false,
          message: "Unauthorized",
          status: 401,
        });
      }

      const decodedToken = jwt.verify(
        token as string,
        config.jwtAccessSecret as string,
      ) as JwtPayload;

      const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        decodedToken.email,
      ]);

      if (userData.rows.length === 0) {
        return sendResponse(res, {
          success: false,
          message: "User not found",
          status: 401,
        });
      }

      if (roles.length && !roles.includes(userData.rows[0].role)) {
        return sendResponse(res, {
          success: false,
          message: "Forbidden",
          status: 403,
        });
      }
      req.user = decodedToken;
      next();
    } catch (error) {
      sendResponse(res, {
        success: false,
        message: "Unauthorized",
        status: 401,
      });
    }
  };
};
