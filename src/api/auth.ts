import { UserWithoutPassword } from "./auth.d";
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
    body: {
      email: payload.email,
      password: payload.password
    }
  });
