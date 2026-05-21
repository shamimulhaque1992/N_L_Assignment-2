const createIssue = (payload: any) => {
  const { title, description, type, status } = payload;
};
const getIssue = (payload: any) => {};
const getIssues = (payload: any) => {};
const updateIssue = (payload: any) => {};
const deleteIssue = (payload: any) => {};

export const issueService = {
  createIssue,
  getIssue,
  getIssues,
  updateIssue,
  deleteIssue,
};
