/**
 * Generate a random password
 */
export const generateRandomPassword = (len = 6) => {
  return ([...Array(len)].map(() => (~~(Math.random() * 36)).toString(36)).join("") + new Array(len + 1).join("0")) // Safety in case string is too short
    .replace(/[^a-z0-9]+/g, "")
    .substr(0, len)
    .toUpperCase();
};
