// Prepare auth success object

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
