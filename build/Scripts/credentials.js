import { url } from "./variables.js";
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
async function tokenValid(action = false) {
  return true;
}
function loggedIn() {
  return Boolean(getUsername()) && Boolean(getRole()) && Boolean(getId());
}
function isUser(role) {
  return role.toUpperCase() === "USER";
}
function isAdmin(role) {
  return role.toUpperCase() === "ADMIN";
}
export {
  getUsername,
  getRole,
  getId,
  logOut,
  tokenValid,
  loggedIn,
  isUser,
  isAdmin,
};
