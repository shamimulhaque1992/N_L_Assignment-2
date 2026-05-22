import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import { Request } from "express";
import { sendResponse } from "../../utility/sendResponse";

type Issue = {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const createIssue = async (payload: Request) => {
  try {
    const { title, description, type, status }: Issue = payload.body;
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
  } catch (error: any) {
    throw new Error(error.message || "Issue could not be created");
  }
};
const getIssue = async (payload: any) => {
  try {
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
  } catch (error: any) {
    throw new Error(error.message || "Issue could not be retrieved");
  }
};
const getIssues = async () => {
  try {
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
  } catch (error) {}
};
const updateIssue = (payload: Request) => {
  try {
    const { id } = payload.params;
    const { authorization } = payload.headers;
    const { title, description, type, status } = payload.body;

    const decodedToken = jwt.verify(
      authorization as string,
      config.jwtAccessSecret as string,
    ) as JwtPayload;
    if (!authorization) {
      throw new Error("Unauthorized");
    }

    if(decodedToken.role==="contributor"){
      
    }
  } catch (error) {}
};
const deleteIssue = (payload: any) => {};

export const issueService = {
  createIssue,
  getIssue,
  getIssues,
  updateIssue,
  deleteIssue,
};
