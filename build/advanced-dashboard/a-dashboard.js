import { tokenValid, addToken } from "../Scripts/credentials.js";
import { url, loadingHTML } from "../Scripts/variables.js";

const compResultsSelect = document.querySelector("#comp-results-select");

const backupsBtn = document.querySelector(".backups");
const getResultsBtn = document.querySelector(".results");

const changePasswordSubmitBtn = document.querySelector(
  ".change-password-submit-btn"
);
const newPasswordInput = document.querySelector(".new-password");
const usernameSelect = document.querySelector(".username");

async function getCompetitionById(id) {
  const allCompetitions = await getCompetitions(true);
  return allCompetitions.find((competition) => competition._id === id);
}
async function downloadFile(url, fileName) {
  if (!url || !fileName) return -1;
  const anchor = document.createElement("a");
  const data = await fetch(url, {
    headers: addToken({}),
  });
  const blob = await data.blob();
  anchor.href = URL.createObjectURL(blob);
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  return 1;
}

getResultsBtn.addEventListener("click", getResults);
async function getResults() {
  const previousHtml = getResultsBtn.innerHTML;
  getResultsBtn.disabled = true;
  getResultsBtn.innerHTML = loadingHTML;
  const competition = await getCompetitionById(compResultsSelect.value);
  const competitionName = competition.name;
  const resultsUrl = `${url}/results?competitionId=${compResultsSelect.value}`;
  await downloadFile(resultsUrl, `${competitionName} - rezultati`);
  getResultsBtn.innerHTML = previousHtml;
  getResultsBtn.disabled = false;
}

backupsBtn.addEventListener("click", getBackups);
async function getBackups() {
  const previousHtml = backupsBtn.innerHTML;
  backupsBtn.disabled = true;
  backupsBtn.innerHTML = loadingHTML;
  const backupsUrl = `${url}/backup`;
  await downloadFile(backupsUrl, "backups");
  backupsBtn.innerHTML = previousHtml;
  backupsBtn.disabled = false;
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

changePasswordSubmitBtn.addEventListener("click", async () => {
  changePasswordSubmitBtn.disabled = true;
  const prevHtml = changePasswordSubmitBtn.innerHTML;
  changePasswordSubmitBtn.innerHTML = loadingHTML;
  const username = usernameSelect.value;
  const password = newPasswordInput.value;
  const changePasswordOutput = await changePassword(username, password);
  changePasswordSubmitBtn.innerHTML = prevHtml;
  changePasswordSubmitBtn.disabled = false;
  document.querySelector(".message").innerText = changePasswordOutput.message;
});
async function getCompetitions(parseAsJson = false) {
  try {
    const allCompetitionsResponse = await fetch(`${url}/competitions`);
    if (parseAsJson) {
      return await allCompetitionsResponse.json();
    }
    return allCompetitionsResponse;
  } catch (error) {
    console.error("Error fetching all competitions:\n", error);
    throw new Error("Error fetching all competitions.");
  }
}
compResultsSelect.innerHTML = "";
const competitions = await getCompetitions(true);
competitions.forEach((competition) => {
  const option = document.createElement("option");
  option.value = competition._id;
  option.innerText = competition.name;
  compResultsSelect.appendChild(option);
});
async function getUsers() {
  const usersURL = `${url}/users`;
  const data = await fetch(usersURL);
  return await data.json();
}
const users = await getUsers();
users.sort((a, b) => {
  // sort alphabetically
  if (a.username < b.username) {
    return -1;
  }
  if (a.username > b.username) {
    return 1;
  }
  return 0;
});
users.forEach((user) => {
  const option = document.createElement("option");
  option.value = user.username;
  option.textContent = user.username;
  usernameSelect.appendChild(option);
});
tokenValid(true);
