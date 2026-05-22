import type { Issue } from "./issue.interface";


const ISSUE_TYPE = {
  bug: "bug",
  feature_request: "feature_request",
} as const;

const ISSUE_STATUS = {
  open: "open",
  in_progress: "in_progress",
  resolved: "resolved",
} as const;

type IssueType = (typeof ISSUE_TYPE)[keyof typeof ISSUE_TYPE];
type IssueStatus = (typeof ISSUE_STATUS)[keyof typeof ISSUE_STATUS];

export const validateIssueFields = (
  body: { [K in keyof Issue]?: Issue[K] | undefined },
  isCreate = false,
): void => {
  const { title, description, type, status } = body;

  if (isCreate || title !== undefined) {
    if (!title) throw new Error("Title is required");
    if (title.length > 150) throw new Error("Title must be at most 150 characters");
  }

  if (isCreate || description !== undefined) {
    if (!description) throw new Error("Description is required");
    if (description.length < 20) throw new Error("Description must be at least 20 characters");
  }

  if (isCreate || type !== undefined) {
    if (!type) throw new Error("Type is required");
    if (!Object.values(ISSUE_TYPE).includes(type as IssueType))
      throw new Error("Type must be either bug or feature_request");
  }

  if (status !== undefined && !Object.values(ISSUE_STATUS).includes(status as IssueStatus))
    throw new Error("Status must be one of: open, in_progress, resolved");
};
