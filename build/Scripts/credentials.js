import { url } from "./variables.js";
/**
 * Gets the username from local storage.
 * @param {boolean} action - If true and username does not exist, log out and alert user to log in again.
 * @returns {string | null} - The username or null if action is true and username does not exist.
 */
function getUsername(action = false) {
  const username = localStorage.getItem("username");
  if (action && !username) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return username;
}
/**
 * Gets the role from local storage.
 * @param {boolean} action - If true and role does not exist, log out and alert user to log in again.
 * @returns {string | null} - The role or null if action is true and role does not exist.
 */
function getRole(action = false) {
  const role = localStorage.getItem("role");
  if (action && !role) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return role;
}
/**
 * Gets the id from local storage.
 * @param {boolean} action - If true and id does not exist, log out and alert user to log in again.
 * @returns {string | null} - The id or null if action is true and id does not exist.
 */
function getId(action = false) {
  const id = localStorage.getItem("id");
  if (action && !id) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return id;
}
/**
 * Logs out the user and clears the local storage for username and role.
 * @param {boolean} refresh - Should browser refresh the page after logging out.
 * @returns {Promise<Response> | void} - Response from the server or void if refresh is true.
 */
async function logOut(refresh = false) {
  const response = await fetch(`${url}/users/logout`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    console.error("There was an error logging out in the response.");
    console.error(response);
    console.error(await response.json());
  }
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("id");
  if (refresh) {
    window.location.reload();
  }
  return response;
}
/**
 * Checks if the session is valid or user is not logged in.
 * @param {boolean} action If true and session is invalid, log out and alert user to log in again.
 * @returns {boolean} True if the session is valid, false if it is invalid or user is not logged in.
 */
async function sessionValid(action = false) {
  const response = await fetch(`${url}/session/validate`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 500) {
    console.error("There was an error validating the session.");
    console.error(await response.json());
    return false;
  }
  const sessionValid = response.status === 200;
  if (action && !sessionValid) {
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
  }
  return sessionValid;
}
/**
 * Checks if the user is logged in.
 * @returns - True if the user is logged in, false if not.
 */
function loggedIn() {
  return Boolean(getUsername()) && Boolean(getRole()) && Boolean(getId());
}
/**
 * Checks if the user is a user.
 * @param {"user" | "admin"} role - The role to check.
 * @returns - True if the role is user, false if it is admin.
 */
function isUser(role) {
  return role.toUpperCase() === "USER";
}
/**
 * Checks if the user is an admin.
 * @param {"user" | "admin"} role - The role to check.
 * @returns - True if the role is admin, false if it is user.
 */
function isAdmin(role) {
  return role.toUpperCase() === "ADMIN";
}
export {
  getUsername,
  getRole,
  getId,
  logOut,
  sessionValid,
  loggedIn,
  isUser,
  isAdmin,
};
