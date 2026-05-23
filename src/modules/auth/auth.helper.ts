// Prepare auth success object
import { createError } from "../../utility/AppError";
import { StatusCodes } from "http-status-codes";

// validate the signup fields check the availability of name, email and password and type of role
export const validateSignUpFields = (payload: {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
}) => {
  const { name, email, password, role } = payload;
  if (!name || !email || !password)
    throw createError(
      StatusCodes.BAD_REQUEST,
      "name, email, and password are required",
    );
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw createError(StatusCodes.BAD_REQUEST, "Invalid email format");
  if (role && !["contributor", "maintainer"].includes(role))
    throw createError(
      StatusCodes.BAD_REQUEST,
      "role must be contributor or maintainer",
    );
};

export const prepareAuthSuccessResponse = (payload: any) => {
  const { id, name, email, role, created_at, updated_at, access_token } =
    payload || {};

  return {
    token: access_token,
    user: {
      id,
      name,
      email,
      role,
      created_at,
      updated_at,
    },
  };
};
