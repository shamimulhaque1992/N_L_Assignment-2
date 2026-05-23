import { issueService } from "./issue.service";
import { sendResponse } from "../../utility/sendResponse";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssue(req);
    sendResponse(res, {
      status: StatusCodes.CREATED,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Issue could not be created",
      error: (error as Error).message,
    });
  }
};
const getIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getIssue(req.params.id as string);
    sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: "Issue retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Issue could not be retrieved",
      error: (error as Error).message,
    });
  }
};
const getIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getIssues(req.query);
    sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Issues could not be retrieved",
      error: (error as Error).message,
    });
  }
};
const updateIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.updateIssue(req);
    sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Issue could not be updated",
      error: (error as Error).message,
    });
  }
};
const deleteIssue = async (req: Request, res: Response) => {
  try {
    await issueService.deleteIssue(req.params.id as string);
    sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    sendResponse(res, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Issue could not be deleted",
      error: (error as Error).message,
    });
  }
};

export const issueController = {
  createIssue,
  getIssue,
  getIssues,
  updateIssue,
  deleteIssue,
};
