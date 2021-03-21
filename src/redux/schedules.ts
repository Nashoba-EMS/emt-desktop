import { Schedule, ScheduleAvailability } from "../api/schedules.d";
import {
  SchedulesActionTypes,
  GET_ALL_SCHEDULES_START,
  GET_ALL_SCHEDULES_SUCCESS,
  GET_ALL_SCHEDULES_FAILURE,
  CREATE_SCHEDULE_START,
  CREATE_SCHEDULE_SUCCESS,
  CREATE_SCHEDULE_FAILURE,
  UPDATE_SCHEDULE_START,
  UPDATE_SCHEDULE_SUCCESS,
  UPDATE_SCHEDULE_FAILURE,
  DELETE_SCHEDULE_START,
  DELETE_SCHEDULE_SUCCESS,
  GET_AVAILABILITY_START,
  GET_AVAILABILITY_SUCCESS,
  GET_AVAILABILITY_FAILURE,
  CREATE_AVAILABILITY_START,
  CREATE_AVAILABILITY_SUCCESS,
  CREATE_AVAILABILITY_FAILURE
} from "./types/schedules";

export interface SchedulesState {
  isGettingAllSchedules: boolean;
  getAllSchedulesErrorMessage: string;
  isCreatingSchedule: boolean;
  createScheduleErrorMessage: string;
  isUpdatingSchedule: boolean;
  updateScheduleErrorMessage: string;
  isDeletingSchedule: boolean;
  deleteScheduleErrorMessage: string;
  isGettingAvailability: boolean;
  getAvailabilityErrorMessage: string;
  isCreatingAvailability: boolean;
  createAvailabilityErrorMessage: string;
  isUpdatingAvailability: boolean;
  updateAvailabilityErrorMessage: string;

  schedules: Schedule[];
  availability: ScheduleAvailability[];
}

const initialState: SchedulesState = {
  isGettingAllSchedules: false,
  getAllSchedulesErrorMessage: "",
  isCreatingSchedule: false,
  createScheduleErrorMessage: "",
  isUpdatingSchedule: false,
  updateScheduleErrorMessage: "",
  isDeletingSchedule: false,
  deleteScheduleErrorMessage: "",
  isGettingAvailability: false,
  getAvailabilityErrorMessage: "",
  isCreatingAvailability: false,
  createAvailabilityErrorMessage: "",
  isUpdatingAvailability: false,
  updateAvailabilityErrorMessage: "",

  schedules: [],
  availability: []
};

const reducer = (state = initialState, action: SchedulesActionTypes): SchedulesState => {
  switch (action.type) {
    case GET_ALL_SCHEDULES_START:
      return {
        ...state,
        isGettingAllSchedules: true,
        getAllSchedulesErrorMessage: ""
      };
    case GET_ALL_SCHEDULES_SUCCESS:
      return {
        ...state,
        isGettingAllSchedules: false,
        schedules: action.body.schedule
      };
    case GET_ALL_SCHEDULES_FAILURE:
      return {
        ...state,
        isGettingAllSchedules: false,
        getAllSchedulesErrorMessage: action.body.error.message
      };
    case CREATE_SCHEDULE_START:
      return {
        ...state,
        isCreatingSchedule: true,
        createScheduleErrorMessage: ""
      };
    case CREATE_SCHEDULE_SUCCESS:
      return {
        ...state,
        isCreatingSchedule: false,
        schedules: [...state.schedules, action.body.schedule]
      };
    case CREATE_SCHEDULE_FAILURE:
      return {
        ...state,
        isCreatingSchedule: false,
        createScheduleErrorMessage: action.body.error.message
      };
    case UPDATE_SCHEDULE_START:
      return {
        ...state,
        isUpdatingSchedule: true,
        updateScheduleErrorMessage: ""
      };
    case UPDATE_SCHEDULE_SUCCESS:
      return {
        ...state,
        isUpdatingSchedule: false,
        schedules: [
          ...state.schedules.filter((schedule) => schedule._id !== action.body.schedule._id),
          action.body.schedule
        ]
      };
    case UPDATE_SCHEDULE_FAILURE:
      return {
        ...state,
        isUpdatingSchedule: false,
        updateScheduleErrorMessage: action.body.error.message
      };
    case DELETE_SCHEDULE_START:
      return {
        ...state,
        isDeletingSchedule: true,
        deleteScheduleErrorMessage: ""
      };
    case DELETE_SCHEDULE_SUCCESS:
      return {
        ...state,
        isDeletingSchedule: false,
        schedules: state.schedules.filter((schedule) => schedule._id !== action.body.schedule._id)
      };
    case GET_AVAILABILITY_START:
      return {
        ...state,
        isGettingAvailability: true,
        getAvailabilityErrorMessage: ""
      };
    case GET_AVAILABILITY_SUCCESS:
      return {
        ...state,
        isGettingAvailability: false,
        availability: [
          ...state.availability.filter(
            (availability) =>
              (action.searchOptions.schedule_id && availability.schedule_id !== action.searchOptions.schedule_id) ||
              (action.searchOptions.user_id && availability.user_id !== action.searchOptions.user_id)
          ),
          ...action.body.availability
        ]
      };
    case GET_AVAILABILITY_FAILURE:
      return {
        ...state,
        isGettingAvailability: false,
        getAvailabilityErrorMessage: action.body.error.message
      };
    case CREATE_AVAILABILITY_START:
      return {
        ...state,
        isCreatingAvailability: true,
        createScheduleErrorMessage: ""
      };
    case CREATE_AVAILABILITY_SUCCESS:
      return {
        ...state,
        isCreatingAvailability: false,
        availability: [
          ...state.availability.filter(
            (availability) =>
              availability.schedule_id !== action.body.availability.schedule_id ||
              availability.user_id !== action.body.availability.user_id
          ),
          action.body.availability
        ]
      };
    case CREATE_AVAILABILITY_FAILURE:
      return {
        ...state,
        isCreatingAvailability: false,
        createAvailabilityErrorMessage: action.body.error.message
      };
    default:
      return state;
  }
};

export default reducer;
