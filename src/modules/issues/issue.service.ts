import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import { Request } from "express";

type Issue = {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
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
