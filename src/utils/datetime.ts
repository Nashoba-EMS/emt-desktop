import moment from "moment";

/**
 * Calculate the age in years based on birthdate
 */
export const getAge = (birthdate: string) => {
  return moment().diff(birthdate, "years");
};
