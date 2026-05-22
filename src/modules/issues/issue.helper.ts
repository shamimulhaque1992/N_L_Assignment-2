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
    if (!title) throw new Error("Title is required");
    if (title.length > 150)
      throw new Error("Title must be at most 150 characters");
  }

  if (isCreate || description !== undefined) {
    if (!description) throw new Error("Description is required");
    if (description.length < 20)
      throw new Error("Description must be at least 20 characters");
  }

  if (isCreate || type !== undefined) {
    if (!type) throw new Error("Type is required");
    if (!ISSUE_TYPES.includes(type))
      throw new Error("Type must be either bug or feature_request");
  }

  if (status !== undefined && !ISSUE_STATUSES.includes(status))
    throw new Error("Status must be one of: open, in_progress, resolved");
};
