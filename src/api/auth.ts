import { ApiResponse } from "./backend";

export const login = async (payload: {
  email: string;
  password: string;
}): Promise<
  ApiResponse<{
    user: {};
    token: string;
  }>
> => {
  return {
    success: true,
    data: {
      user: {},
      token: ""
    }
  };
};
