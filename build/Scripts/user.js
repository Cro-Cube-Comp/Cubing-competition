import { url } from "./variables.js";
import { getId, addToken } from "./credentials.js";
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
/**
 * Assign admin role to a user
 * @param {string} id - Id of user to which the admin role will be assigned
 * @returns {Promise<{success: boolean, data?: any, response?: Response, message?: string}>} Returns a success message if the admin role was assigned successfullys
 */
export async function assignUserToAdmin(id) {
  const body = {
    method: "POST",
    headers: addToken({}),
  };
  try {
    const response = await fetch(`${url}/admin/assign/${id}`, body);
    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    }
    return {
      success: false,
      message: data.message,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
}
/**
 *
 * @param {string} username - Username of the user to be registered
 * @param {string} password - Password of the user to be registered
 * @param {1 | 2} group - Group of the user to be registered
 * @returns {Promise<>}
 */
export async function registerUser(username, password, group) {
  try {
    const response = await fetch(`${url}/register`, {
      method: "POST",
      headers: addToken({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ username, password, group }),
    });
    const data = await response.json();
    return {
      success: response.ok,
      user: data.registeredUser,
      message: data.message,
    };
  } catch (error) {
    console.error("Error:\n", error);
    return {
      success: false,
    };
  }
}
