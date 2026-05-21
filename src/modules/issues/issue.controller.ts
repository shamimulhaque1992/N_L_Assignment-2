import { issueService } from "./issue.service";
import { sendResponse } from "../../utility/sendResponse";
import type { Request, Response } from "express";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssue(req.body);
    sendResponse(res, {
      status: 200,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      status: 500,
      success: false,
      message: "Issue created successfully",
      error: error,
    });
  }
};
const getIssue = async (req: Request, res: Response) => {
  
};
const getIssues = async (req: Request, res: Response) => {};
const updateIssue = async (req: Request, res: Response) => {};
const deleteIssue = async (req: Request, res: Response) => {};

export const issueController = {
  createIssue,
  getIssue,
  getIssues,
  updateIssue,
  deleteIssue,
};
