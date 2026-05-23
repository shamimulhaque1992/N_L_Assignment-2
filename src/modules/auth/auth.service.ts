import { pool } from "../../db";
import bcrypt from "bcryptjs";
import type { IUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

type LogInPayload = {
  email: string;
  password: string;
};

const signUp = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  const hasPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *`,
      [name, email, hasPassword, role],
    );
    delete result.rows[0].password;
    return result.rows[0];
  } catch (error) {
    throw new Error("Could not create user");
  }
};

const logIn = async (payload: LogInPayload) => {
  const { email, password } = payload;
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    throw new Error("User not found");
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
    throw new Error("Password is incorrect");
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
  const refresh_token = jwt.sign(
    userPayload,
    config.jwtRefreshSecret as string,
    { expiresIn: "360d" },
  );

  return {
    access_token,
    refresh_token,
    ...userPayload,
    created_at,
    updated_at,
  };
};

const refreshToken = async (payload: IUser) => {};

export const authService = {
  signUp,
  logIn,
  refreshToken,
};
