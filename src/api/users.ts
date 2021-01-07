import { User, UserWithoutPassword } from "./users.d";
import { ENDPOINT, request } from "./endpoints";

export type LoginResponse = {
  token: string;
  user: UserWithoutPassword;
};

/**
 * Login with the given credentials
 */
export const login = (token: string | null, payload?: { email: string; password: string }) =>
  request<LoginResponse>(ENDPOINT.users.login, {
    token,
    body: payload
  });

/**
 * CRUD operations on the user database
 */
const manage = <Response>(
  token: string,
  payload: { action: string; targetEmail?: string; userPayload?: Partial<User> }
) =>
  request<Response>(ENDPOINT.users.manage, {
    token,
    body: payload
  });

export type GetAllUsersResponse = {
  user: UserWithoutPassword[];
};

/**
 * Get a list of all users
 */
export const getAllUsers = (token: string) => manage<GetAllUsersResponse>(token, { action: "GET" });

export type CreateUserResponse = {
  user: User;
};

/**
 * Create a new user
 */
export const createUser = (token: string, payload: { targetEmail: string; userPayload: Partial<User> }) =>
  manage<CreateUserResponse>(token, { action: "CREATE", ...payload });

export type UpdateUserResponse = {
  user: UserWithoutPassword;
};

/**
 * Update a given user
 */
export const updateUser = (token: string, payload: { targetEmail: string; userPayload: Partial<User> }) =>
  manage<UpdateUserResponse>(token, { action: "UPDATE", ...payload });

export type DeleteUserResponse = {
  user: UserWithoutPassword;
};

/**
 * Delete a given user
 */
export const deleteUser = (token: string, payload: { targetEmail: string }) =>
  manage<DeleteUserResponse>(token, { action: "DELETE", ...payload });
