import { loadingHTML, url } from "../Scripts/variables.js";
import { getUserInfoById } from "../Scripts/user.js";
const profileId = getParams(window.location.href).get("id");
const profilePictureElement = document.querySelector(".profile-picture");
const usernameElement = document.querySelector(".username");
const groupElement = document.querySelector(".group");
const roleElement = document.querySelector(".role");
/**
 * Get parameters from URL
 * @param {string} url - URL to get params from
 */
function getParams(url) {
  try {
    // Create a URL object
    const urlObject = new URL(url);

    // Extract the query parameters using URLSearchParams
    const params = new URLSearchParams(urlObject.search);

    return params;
  } catch (error) {
    console.error(`There was an error getting parameters from url:\n${error}`);
    return null;
  }
}
async function getUserProfilePicture(id) {
  const profilePictureUrl = `${url}/profile/picture/${id}`;
  const response = await fetch(profilePictureUrl);
  if (response.ok) {
    const profilePicture = await response.blob();
    return profilePicture;
  }
  if (await response.json().userNotFound) {
    return null;
  }
  console.error(response);
  throw new Error("Failed to get profile picture for user.");
}
/**
 * Display the profile picture ( blob) in .profile-picture <img> element
 * @param {Blob} profilePicture - The profile picture blob
 */
function displayProfilePicture(profilePicture) {
  try {
    if (!profilePicture) {
      return;
    }
    const profilePictureUrl = URL.createObjectURL(profilePicture);
    profilePictureElement.src = profilePictureUrl;
  } catch (error) {
    throw new Error("Failed to display profile picture.");
  }
}
function displayUserInfo(userInfo) {
  const { username, group, role } = userInfo.parsed;
  usernameElement.textContent = username;
  groupElement.textContent = `Grupa ${group}`;
  roleElement.textContent = role;
}
async function main() {
  createLoadingModal();
  if (!profileId) {
    window.location.href = "./me";
  }
  try {
    const profilePicture = await getUserProfilePicture(profileId);
    displayProfilePicture(profilePicture);
    const userInfo = await getUserInfoById(profileId);
    displayUserInfo(userInfo);
  } catch (error) {
    console.error(error);
    alert(error);
  } finally {
    removeLoadingModal();
  }
}
function createLoadingModal() {
  const loadingModal = document.createElement("div");
  loadingModal.classList.add("loading-modal");
  loadingModal.innerHTML = loadingHTML;
  document.body.appendChild(loadingModal);
}
function removeLoadingModal() {
  const loadingModal = document.querySelector(".loading-modal");
  loadingModal.remove();
}
main();
