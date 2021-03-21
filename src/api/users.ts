import { User, UserWithoutPassword } from "./users.d";
import { ENDPOINT, request } from "./endpoints";

export interface LoginResponse {
  token: string;
  user: UserWithoutPassword;
}

/**
 * Login with the given credentials
 */
export const login = (token: string | null, payload?: { email: string; password: string }) =>
  request<LoginResponse>(ENDPOINT.users.login, {
    token,
    body: payload
  });

interface ManageResponse {
  user: UserWithoutPassword[] | UserWithoutPassword | User;
}

/**
 * CRUD operations on the user collection
 */
const manage = <Response>(
  token: string,
  payload: {
    action: "GET" | "CREATE" | "UPDATE" | "DELETE";
    targetEmail?: string;
    userPayload?: Partial<User>;
  }
) =>
  request<Response>(ENDPOINT.users.manage, {
    token,
    body: payload
  });

export interface GetAllUsersResponse extends ManageResponse {
  user: UserWithoutPassword[];
}

/**
 * Get a list of all users
 */
export const getAllUsers = (token: string) => manage<GetAllUsersResponse>(token, { action: "GET" });

export interface CreateUserResponse extends ManageResponse {
  user: User;
}

/**
 * Create a new user
 */
export const createUser = (token: string, payload: { targetEmail: string; userPayload: Partial<User> }) =>
  manage<CreateUserResponse>(token, { action: "CREATE", ...payload });

export interface UpdateUserResponse extends ManageResponse {
  user: UserWithoutPassword;
}

/**
 * Update a given user
 */
export const updateUser = (token: string, payload: { targetEmail: string; userPayload: Partial<User> }) =>
  manage<UpdateUserResponse>(token, { action: "UPDATE", ...payload });

export interface DeleteUserResponse extends ManageResponse {
  user: UserWithoutPassword;
}

/**
 * Delete a given user
 */
export const deleteUser = (token: string, payload: { targetEmail: string }) =>
  manage<DeleteUserResponse>(token, { action: "DELETE", ...payload });
