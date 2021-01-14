import { CrewAssignment } from "./crews.d";
import { ENDPOINT, request } from "./endpoints";

interface ManageResponse {
  crewAssignment: CrewAssignment[] | CrewAssignment;
}

/**
 * CRUD operations on the crew database
 */
const manage = <Response>(
  token: string,
  payload: {
    action: "GET" | "CREATE" | "UPDATE" | "DELETE";
    targetId?: string;
    crewPayload?: Partial<CrewAssignment>;
  }
) =>
  request<Response>(ENDPOINT.users.manage, {
    token,
    body: payload
  });

export interface GetAllCrewsResponse extends ManageResponse {
  crewAssignment: CrewAssignment[];
}

/**
 * Get a list of all crews
 */
export const getAllCrews = (token: string) => manage<GetAllCrewsResponse>(token, { action: "GET" });

export interface CreateCrewResponse extends ManageResponse {
  crewAssignment: CrewAssignment;
}

/**
 * Create a new crew
 */
export const createCrew = (token: string, payload: { targetId: string; crewPayload: Partial<CrewAssignment> }) =>
  manage<CreateCrewResponse>(token, { action: "CREATE", ...payload });

export interface UpdateCrewResponse extends ManageResponse {
  crewAssignment: CrewAssignment;
}

/**
 * Update a given crew
 */
export const updateCrew = (token: string, payload: { targetId: string; crewPayload: Partial<CrewAssignment> }) =>
  manage<UpdateCrewResponse>(token, { action: "UPDATE", ...payload });

export interface DeleteCrewResponse extends ManageResponse {
  crewAssignment: CrewAssignment;
}

/**
 * Delete a given crew
 */
export const deleteCrew = (token: string, payload: { targetId: string }) =>
  manage<DeleteCrewResponse>(token, { action: "DELETE", ...payload });
