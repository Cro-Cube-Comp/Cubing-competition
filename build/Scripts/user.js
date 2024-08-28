import { url } from "./variables.js";
import { getId } from "./credentials.js";
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
/**
 * Delete a user by id
 * @param {string} id - Id of user to delete
 * @returns {Promise<{success: boolean, data?: any, response?: Response, message?: string}>}
 */
export async function deleteUserById(id) {
  if (id === getId()) {
    return {
      success: false,
      message: "Nedopušteno brisanje vlastitog računa.",
    };
  }
  try {
    const body = {
      method: "DELETE",
      headers: addToken({}),
    };
    const response = await fetch(`${url}/users/${id}`, body);
    const data = await response.json();
    if (data.ok) {
      return { success: true, data, response };
    }
    return {
      success: false,
      data,
      response,
      message: "Greška prilikom brisanja korisnika.",
    };
  } catch (error) {
    console.error(`Error deleting user: \n${error}`);
    return {
      success: false,
    };
  }
}
