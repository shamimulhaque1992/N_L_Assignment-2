import config from "../../config";
import { pool } from "../../db";
import type { Issue, User } from "./issue.interface";
import { validateIssueFields } from "./issue.helper";
import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { createError } from "../../utility/AppError";
import { StatusCodes } from "http-status-codes";

// create a new issue
const createIssue = async (payload: Request) => {
  const { title, description, type, status }: Issue = payload.body;
  validateIssueFields({ title, description, type, status }, true);
  const { authorization } = payload.headers;
  if (!authorization) {
    throw createError(StatusCodes.UNAUTHORIZED, "Unauthorized");
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

// get a single issue by id
const getIssue = async (payload: string) => {
  const result = await pool.query(`SELECT * FROM issues WHERE id=$1`, [
    payload,
  ]);
  if (result.rows.length === 0) {
    throw createError(StatusCodes.NOT_FOUND, "Issue not found");
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

// get all issues
const getIssues = async (query: Record<string, unknown> = {}) => {
  const { sort = "newest", type, status } = query as Record<string, string>;

  const conditions: string[] = [];
  const params: string[] = [];

  if (type) {
    params.push(type);
    conditions.push(`type = $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const order = sort === "oldest" ? "ASC" : "DESC";

  const issues = (
    await pool.query(
      `SELECT * FROM issues ${where} ORDER BY created_at ${order}`,
      params,
    )
  ).rows;

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

// update issue
const updateIssue = async (payload: Request) => {
  const { id } = payload.params;
  const { authorization } = payload.headers;
  const { title, description, type, status }: Issue = payload.body;
  validateIssueFields({ title, description, type, status });

  if (!authorization) {
    throw createError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const decodedToken = jwt.verify(
    authorization as string,
    config.jwtAccessSecret as string,
  ) as JwtPayload;

  const issue = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id]);
  if (issue.rows.length === 0) {
    throw createError(StatusCodes.NOT_FOUND, "Issue not found");
  }

  const { status: currentStatus, reporter_id } = issue.rows[0];

  if (decodedToken.role === "contributor") {
    if (reporter_id !== decodedToken.id) {
      throw createError(
        StatusCodes.FORBIDDEN,
        "Contributor can only update their own issues",
      );
    }
    if (currentStatus !== "open") {
      throw createError(
        StatusCodes.CONFLICT,
        "Contributor can only update open issues",
      );
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

// delete issue
const deleteIssue = async (payload: string) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id=$1 RETURNING *`,
    [payload],
  );
  if (result.rows.length === 0) {
    throw createError(StatusCodes.NOT_FOUND, "Issue not found");
  }
};

export const issueService = {
  createIssue,
  getIssue,
  getIssues,
  updateIssue,
  deleteIssue,
};
