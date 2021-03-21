export const GetMethod = "GET";
export const PostMethod = "POST";

export type Method = typeof GetMethod | typeof PostMethod;

export interface Endpoint {
  url: string;
  method: Method;
}

/**
 * Create an endpoint with proper typing
 */
const endpoint = (method: Method, url: string): Endpoint => ({
  url,
  method
});

/**
 * Endpoint object for building requests
 */
export const ENDPOINT = {
  users: {
    login: endpoint(PostMethod, "users/login"),
    manage: endpoint(PostMethod, "users/manage")
  },
  crews: {
    manage: endpoint(PostMethod, "crews/manage")
  },
  schedules: {
    manage: endpoint(PostMethod, "schedules/manage")
  },
  availability: {
    manage: endpoint(PostMethod, "availability/manage")
  }
};

export const BASE_URL = process.env.REACT_APP_API_URL ?? "";

export type SuccessResponse<Body> = {
  code: 200;
  body: Body;
};

export type FailureResponse = {
  code: 0 | 400 | 401 | 404 | 500;
  body: {
    error: {
      message: string;
    };
  };
};

export type Response<Body> = SuccessResponse<Body> | FailureResponse;

/**
 * Make a request to the given endpoint which returns the specified response or an error
 */
export const request = async <ResponseBody>(
  endpoint: Endpoint,
  args: {
    token: string | null;
    body?: any;
  }
): Promise<Response<ResponseBody>> => {
  const url = `${BASE_URL}/${endpoint.url}`;
  const method = endpoint.method;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  if (args.token) {
    // Attach authorization
    headers["Authorization"] = `Bearer ${args.token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      mode: "cors",
      cache: "no-store",
      headers,
      body: args.body && JSON.stringify(args.body)
    });

    const responseBody = await response.json();

    if (response.status === 200) {
      return {
        code: response.status,
        body: responseBody as ResponseBody
      };
    } else {
      return {
        code: response.status as FailureResponse["code"],
        body: responseBody as FailureResponse["body"]
      };
    }
  } catch (error) {
    console.error(error);

    return {
      code: 0,
      body: {
        error: {
          message: error.message
        }
      }
    };
  }
};
