import moment from "moment";

/**
 * Check if a YYYY-MM-DD formated date is valid
 */
export const isDateStringValid = (date: string): boolean => date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) !== null;

/**
 * Calculate the age in years based on birthdate
 */
export const getAge = (birthdate: string) => {
  return moment().diff(birthdate, "years");
};
