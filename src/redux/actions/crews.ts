import { CrewsApi } from "../../api";
import { FailureResponse, SuccessResponse } from "../../api/endpoints";
import { CrewAssignment } from "../../api/crews.d";
import {
  CrewsActionTypes,
  AsyncCrewsActionTypes,
  GET_ALL_CREWS_START,
  GET_ALL_CREWS_SUCCESS,
  GET_ALL_CREWS_FAILURE,
  CREATE_CREW_START,
  CREATE_CREW_SUCCESS,
  CREATE_CREW_FAILURE,
  UPDATE_CREW_START,
  UPDATE_CREW_SUCCESS,
  UPDATE_CREW_FAILURE,
  DELETE_CREW_START,
  DELETE_CREW_SUCCESS,
  DELETE_CREW_FAILURE,
  CLEAR_CREWS_SUCCESS_MESSAGE
} from "../types/crews";

/**
 * Create a default start action
 */
const defaultStart = (type: CrewsActionTypes["type"]) => (): CrewsActionTypes =>
  ({
    type
  } as CrewsActionTypes);

/**
 * Create a default success action
 */
const defaultSuccess = <Response>(type: CrewsActionTypes["type"]) => (
  response: SuccessResponse<Response>
): CrewsActionTypes =>
  ({
    type,
    ...response
  } as CrewsActionTypes);

/**
 * Create a default failure action
 */
const defaultFailure = (type: CrewsActionTypes["type"]) => (response: FailureResponse): CrewsActionTypes =>
  ({
    type,
    ...response
  } as CrewsActionTypes);

/**
 * Clear the crews success message
 */
export const clearCrewsSuccessMessage = (): CrewsActionTypes => ({
  type: CLEAR_CREWS_SUCCESS_MESSAGE
});

const getAllCrewsStart = defaultStart(GET_ALL_CREWS_START);
const getAllCrewsSuccess = defaultSuccess<CrewsApi.GetAllCrewsResponse>(GET_ALL_CREWS_SUCCESS);
const getAllCrewsFailure = defaultFailure(GET_ALL_CREWS_FAILURE);

/**
 * Get a list of all crews
 */
export const getAllCrews = (token: string): AsyncCrewsActionTypes => async (dispatch) => {
  dispatch(getAllCrewsStart());

  const response = await CrewsApi.getAllCrews(token);

  if (response.code === 200) {
    dispatch(getAllCrewsSuccess(response));
  } else {
    dispatch(getAllCrewsFailure(response));
  }
};

const createCrewStart = defaultStart(CREATE_CREW_START);
const createCrewSuccess = defaultSuccess<CrewsApi.CreateCrewResponse>(CREATE_CREW_SUCCESS);
const createCrewFailure = defaultFailure(CREATE_CREW_FAILURE);

/**
 * Create a new crew
 */
export const createCrew = (token: string, crewPayload: Partial<CrewAssignment>): AsyncCrewsActionTypes => async (
  dispatch
) => {
  dispatch(createCrewStart());

  const response = await CrewsApi.createCrew(token, { crewPayload });

  if (response.code === 200) {
    dispatch(createCrewSuccess(response));
  } else {
    dispatch(createCrewFailure(response));
  }
};

const updateCrewStart = defaultStart(UPDATE_CREW_START);
const updateCrewSuccess = defaultSuccess<CrewsApi.UpdateCrewResponse>(UPDATE_CREW_SUCCESS);
const updateCrewFailure = defaultFailure(UPDATE_CREW_FAILURE);

/**
 * Update a crew
 */
export const updateCrew = (
  token: string,
  targetId: string,
  crewPayload: Partial<CrewAssignment>
): AsyncCrewsActionTypes => async (dispatch) => {
  dispatch(updateCrewStart());

  const response = await CrewsApi.updateCrew(token, { targetId, crewPayload });

  if (response.code === 200) {
    dispatch(updateCrewSuccess(response));
  } else {
    dispatch(updateCrewFailure(response));
  }
};

const deleteCrewStart = defaultStart(DELETE_CREW_START);
const deleteCrewSuccess = defaultSuccess<CrewsApi.DeleteCrewResponse>(DELETE_CREW_SUCCESS);
const deleteCrewFailure = defaultFailure(DELETE_CREW_FAILURE);

/**
 * Delete a crew
 */
export const deleteCrew = (token: string, targetId: string): AsyncCrewsActionTypes => async (dispatch) => {
  dispatch(deleteCrewStart());

  const response = await CrewsApi.deleteCrew(token, { targetId });

  if (response.code === 200) {
    dispatch(deleteCrewSuccess(response));
  } else {
    dispatch(deleteCrewFailure(response));
  }
};
