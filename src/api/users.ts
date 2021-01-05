import { User, UserWithoutPassword } from "./users.d";
import { ENDPOINT, request } from "./endpoints";

export type LoginResponse = {
  token: string;
  user: UserWithoutPassword;
};

/**
 * Login with the given credentials
 */
export const login = (payload: { email: string; password: string }) =>
  request<LoginResponse>(ENDPOINT.users.login, {
    body: payload
  });

export type ManageResponse = {
  user: UserWithoutPassword[] | UserWithoutPassword | null;
};

/**
 * CRUD operations on the user database
 */
const manage = (token: string, payload: { action: string; targetEmail?: string; userPayload?: Partial<User> }) =>
  request<ManageResponse>(ENDPOINT.users.manage, {
    token,
    body: payload
  });

/**
 * Get a list of all users
 */
export const getAllUsers = (token: string) => manage(token, { action: "GET" });

/**
 * Create a new user
 */
export const createUser = (token: string, payload: { targetEmail: string; userPayload: Partial<User> }) =>
  manage(token, { action: "CREATE", ...payload });

/**
 * Update a given user
 */
export const updateUser = (token: string, payload: { targetEmail: string; userPayload: Partial<User> }) =>
  manage(token, { action: "UPDATE", ...payload });

/**
 * Delete a given user
 */
export const deleteUser = (token: string, payload: { targetEmail: string }) =>
  manage(token, { action: "DELETE", ...payload });
