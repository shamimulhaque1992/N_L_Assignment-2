import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import { Request } from "express";
import { Issue, User } from "./issue.interface";
import { validateIssueFields } from "./issue.helper";

const createIssue = async (payload: Request) => {
  const { title, description, type, status }: Issue = payload.body;
  validateIssueFields({ title, description, type, status }, true);
  const { authorization } = payload.headers;
  if (!authorization) {
    throw new Error("Unauthorized");
  }

  const decodedToken = jwt.verify(
    authorization as string,
    config.jwtAccessSecret as string,
  ) as JwtPayload;

  const result = await pool.query(
    `INSERT INTO issues(title, description, type,status, reporter_id) VALUES($1, $2, $3, COALESCE($4, 'open'), $5) RETURNING *`,
    [title, description, type, status, decodedToken.id],
  );
  return result.rows[0];
};
const getIssue = async (payload: string) => {
  const result = await pool.query(`SELECT * FROM issues WHERE id=$1`, [
    payload,
  ]);
  if (result.rows.length === 0) {
    throw new Error("No issues found");
  }

  const { reporter_id } = result.rows[0];
  const userData = await pool.query(
    `SELECT id, role, name FROM users WHERE id=$1`,
    [reporter_id],
  );
  delete result.rows[0].reporter_id;
  const formattedResult = { ...result.rows[0], reporter: userData.rows[0] };
  return formattedResult;
};
const getIssues = async () => {
  const issues = (await pool.query(`SELECT * FROM issues`)).rows;
  // Collect unique reporter ids
  const reporterIds: string[] = [];
  issues.forEach((issue) => {
    if (!reporterIds.includes(issue.reporter_id)) {
      reporterIds.push(issue.reporter_id);
    }
  });

  // Fetch reporters
  const users = (
    await pool.query(
      `SELECT id, name, email, role FROM users WHERE id = ANY($1)`,
      [reporterIds],
    )
  ).rows;

  // Build lookup object
  const usersById: Record<string, User> = {};
  users.forEach((user) => {
    usersById[user.id] = user;
  });

  // Inject reporter into each issue
  issues.forEach((issue) => {
    issue.reporter = usersById[issue.reporter_id];
    delete issue.reporter_id;
  });

  return issues;
};
const updateIssue = async (payload: Request) => {
  const { id } = payload.params;
  const { authorization } = payload.headers;
  const { title, description, type, status }: Issue = payload.body;
  validateIssueFields({ title, description, type, status });

  if (!authorization) {
    throw new Error("Unauthorized");
  }

  const decodedToken = jwt.verify(
    authorization as string,
    config.jwtAccessSecret as string,
  ) as JwtPayload;

  const issue = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id]);
  if (issue.rows.length === 0) {
    throw new Error("No issues found");
  }

  const { status: currentStatus, reporter_id } = issue.rows[0];

  if (decodedToken.role === "contributor") {
    if (reporter_id !== decodedToken.id) {
      throw new Error("Contributor can only update their own issues");
    }
    if (currentStatus !== "open") {
      throw new Error("Contributor can only update open issues");
    }
    const result = await pool.query(
      `UPDATE issues SET title = COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type) WHERE id = $4 RETURNING *`,
      [title, description, type, id],
    );
    return result.rows[0];
  }

  const result = await pool.query(
    `UPDATE issues SET title = COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type), status = COALESCE($4, status) WHERE id = $5 RETURNING *`,
    [title, description, type, status, id],
  );
  return result.rows[0];
};
const deleteIssue = async (payload: string) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id=$1 RETURNING *`,
    [payload],
  );
  if (result.rows.length === 0) {
    throw new Error("No issues found");
  }
};

export const issueService = {
  createIssue,
  getIssue,
  getIssues,
  updateIssue,
  deleteIssue,
};
