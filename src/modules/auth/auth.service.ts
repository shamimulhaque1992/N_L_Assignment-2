import { pool } from "../../db";
import bcrypt from "bcryptjs";
import type { IUser } from "./auth.interface";

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

const logIn = async (payload: IUser) => {};

const refreshToken = async (payload: IUser) => {};

export const authService = {
  signUp,
  logIn,
  refreshToken,
};
