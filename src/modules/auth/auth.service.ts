import { pool } from "../../db";
import bcrypt from "bcryptjs";
import type { IUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";
import { createError } from "../../utility/AppError";
import { StatusCodes } from "http-status-codes";
import { validateSignUpFields } from "./auth.helper";

type LogInPayload = {
  email: string;
  password: string;
};

const signUp = async (payload: IUser) => {
  const { name, email, password, role }: IUser = payload;
  validateSignUpFields({ name, email, password, ...(role && { role }) });
  const hasPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *`,
      [name, email, hasPassword, role],
    );
    delete result.rows[0].password;
    return result.rows[0];
  } catch (error) {
    throw createError(StatusCodes.BAD_REQUEST, (error as Error).message);
  }
};

const logIn = async (payload: LogInPayload) => {
  const { email, password } = payload;
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    throw createError(StatusCodes.NOT_FOUND, "User not found");
  }
  const {
    id,
    name,
    email: responseEmail,
    password: responsePassword,
    role,
    created_at,
    updated_at,
  } = result.rows[0];

  // check password matches or not
  const passwordMatched = await bcrypt.compare(password, responsePassword);
  if (!passwordMatched) {
    throw createError(StatusCodes.UNAUTHORIZED, "Password is incorrect");
  }

  // generate jwt token
  const userPayload = {
    id: id,
    name: name,
    email: responseEmail,
    role: role,
  };
  const access_token = jwt.sign(userPayload, config.jwtAccessSecret as string, {
    expiresIn: "1d",
  });

  return {
    access_token,
    ...userPayload,
    created_at,
    updated_at,
  };
};

export const authService = {
  signUp,
  logIn,
};
