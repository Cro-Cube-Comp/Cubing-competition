import { url } from "./variables";
/**
 * Get all users (no authentication)
 * @returns {Promise<{parsed: any, success: boolean, response: Response, status: number}>}
 */
export async function getUsers() {
  const usersUrl = `${url}/users`;
  const response = await fetch(usersUrl);
  return {
    parsed: await response.json(),
    success: response.ok,
    response,
    status: response.status,
  };
}
/**
 * Get a user by id (no authentication)
 * @param {string} id
 * @returns {Promise<{parsed: any, success: boolean, response: Response, status: number}>}
 */
export async function getUserById(id) {
  const userUrl = `${url}/users/${id}`;
  const response = await fetch(userUrl);
  return {
    parsed: await response.json(),
    success: response.ok,
    response,
    status: response.status,
  };
}
/**
 * Get a user by username (no authentication)
 * @param {string} username
 * @returns {Promise<any | null>} - Returns the user object or null if user does not exist
 */
export async function getUserByUsername(username) {
  try {
    const users = await getUsers();
    const user = users.parsed.find((user) => user.username === username);
    return user ? user : null;
  } catch (error) {
    return null;
  }
}
