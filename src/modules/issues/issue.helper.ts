import { createError } from "../../utility/AppError";
import { StatusCodes } from "http-status-codes";

const ISSUE_TYPES = ["bug", "feature_request"];
const ISSUE_STATUSES = ["open", "in_progress", "resolved"];

type IssueBody = {
  title?: string | undefined;
  description?: string | undefined;
  type?: string | undefined;
  status?: string | undefined;
};

export const validateIssueFields = (
  body: IssueBody,
  isCreate = false,
): void => {
  const { title, description, type, status } = body;

  if (isCreate || title !== undefined) {
    if (!title) throw createError(StatusCodes.BAD_REQUEST, "Title is required");
    if (title.length > 150)
      throw createError(StatusCodes.BAD_REQUEST, "Title must be at most 150 characters");
  }

  if (isCreate || description !== undefined) {
    if (!description) throw createError(StatusCodes.BAD_REQUEST, "Description is required");
    if (description.length < 20)
      throw createError(StatusCodes.BAD_REQUEST, "Description must be at least 20 characters");
  }

  if (isCreate || type !== undefined) {
    if (!type) throw createError(StatusCodes.BAD_REQUEST, "Type is required");
    if (!ISSUE_TYPES.includes(type))
      throw createError(StatusCodes.BAD_REQUEST, "Type must be either bug or feature_request");
  }

  if (status !== undefined && !ISSUE_STATUSES.includes(status))
    throw createError(StatusCodes.BAD_REQUEST, "Status must be one of: open, in_progress, resolved");
};
