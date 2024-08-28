import { getId, addToken, tokenValid } from "../../Scripts/credentials.js";
import { loadingHTML, url } from "../../Scripts/variables.js";
const profileId = getId();
const profilePictureElement = document.querySelector(".profile-picture");
const pfpFileInput = document.querySelector(".pfp-fileinput");
if (!profileId) {
  window.location.href = "../../Login";
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
async function main() {
  try {
    createLoadingModal();
    const tokenValidity = await tokenValid();
    if (!tokenValidity) {
      window.location.href = "../../Login";
    }
    const profilePicture = await getUserProfilePicture(profileId);
    displayProfilePicture(profilePicture);
  } catch (error) {
    console.error(error);
    alert(error);
  } finally {
    removeLoadingModal();
  }
}
main();
profilePictureElement.addEventListener("click", async () => {
  pfpFileInput.click();
});
pfpFileInput.addEventListener("change", async () => {
  const file = pfpFileInput.files[0];
  if (!file) {
    return;
  }
  const formData = new FormData();
  formData.append("profilePicture", file);
  const response = await fetch(`${url}/profile/picture/`, {
    method: "POST",
    body: formData,
    headers: addToken({}),
  });
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    main();
  }
});
