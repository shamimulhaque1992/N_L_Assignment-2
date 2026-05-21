import { NextFunction, Request, Response } from "express";
import { APP_ROLES } from "../type";

const authMiddleware = (...roles: APP_ROLES[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        
    }
  };
};
