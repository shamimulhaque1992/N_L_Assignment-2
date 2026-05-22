import { issueService } from "./issue.service";
import { sendResponse } from "../../utility/sendResponse";
import type { Request, Response } from "express";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssue(req);
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
      message: "Issue could not be created",
      error: error,
    });
  }
};
const getIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getIssue(req.params.id);
    sendResponse(res, {
      status: 200,
      success: true,
      message: "Issue retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      status: 500,
      success: false,
      message: "Issue could not be retrieved",
      error: (error as Error).message,
    });
  }
};
const getIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getIssues();
    sendResponse(res, {
      status: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      status: 500,
      success: false,
      message: "Issues could not be retrieved",
      error: (error as Error).message,
    });
  }
};
const updateIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.updateIssue(req);
  } catch (error) {
    
  }
};
const deleteIssue = async (req: Request, res: Response) => {};

export const issueController = {
  createIssue,
  getIssue,
  getIssues,
  updateIssue,
  deleteIssue,
};
