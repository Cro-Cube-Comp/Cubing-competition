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
function logOut(refresh = false) {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  if (refresh) {
    window.location.reload();
  }
}
async function tokenValid(action = false) {
  return true;
}
function loggedIn() {
  return Boolean(getRole()) && Boolean(getId());
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
