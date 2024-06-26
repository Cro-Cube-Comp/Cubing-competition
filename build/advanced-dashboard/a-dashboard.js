import { tokenValid, addToken } from "../Scripts/credentials.js";
import { url, loadingHTML } from "../Scripts/variables.js";
function downloadFile(url, fileName) {
  if (!url || !fileName) return -1;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  return 1;
}

const getResultsBtn = document.querySelector(".results");
getResultsBtn.addEventListener("click", getResults);
function getResults() {
  getResultsBtn.disabled = true;
  const resultsUrl = addToken(`${url}/results`);
  downloadFile(resultsUrl, "results"); // You can specify the desired file name
  getResultsBtn.disabled = false;
}

async function changePassword(username, newPassword) {
  const body = {
    username,
    newPassword,
  };
  const request = {
    method: "POST",
    body: JSON.stringify(body),
    headers: addToken({ "Content-Type": "application/json" }),
  };
  const data = await fetch(`${url}/users/change-password`, request);
  const response = await data.json();
  console.log(response.message);
  console.log(data.status);
  return response;
}
const changePasswordSubmitBtn = document.querySelector(
  ".change-password-submit-btn"
);
const newPasswordInput = document.querySelector(".new-password");
const usernameInput = document.querySelector(".username");
changePasswordSubmitBtn.addEventListener("click", async () => {
  changePasswordSubmitBtn.disabled = true;
  const prevHtml = changePasswordSubmitBtn.innerHTML;
  changePasswordSubmitBtn.innerHTML = loadingHTML;
  const username = usernameInput.value;
  const password = newPasswordInput.value;
  const changePasswordOutput = await changePassword(username, password);
  changePasswordSubmitBtn.innerHTML = prevHtml;
  changePasswordSubmitBtn.disabled = false;
  document.querySelector(".message").innerText = changePasswordOutput.message;
});
tokenValid(true);
