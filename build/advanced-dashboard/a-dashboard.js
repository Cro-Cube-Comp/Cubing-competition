import { tokenValid } from "../Scripts/credentials.js";
import { url, loadingHTML } from "../Scripts/variables.js";
const compResultsSelect = document.querySelector("#comp-results-select");
async function downloadFile(url, fileName) {
  if (!url || !fileName) throw new Error("URL or file name is not defined.");
  const data = await fetch(`${url}`, {
    method: "GET",
    credentials: "include",
  });
  if (!data.ok) {
    console.error("Error fetching data:", data);
    alert("Greška prilikom preuzimanja.");
    return;
  }
  const blob = await data.blob();

  // Create an anchor link
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  // Return a success message or handle any other logic
  return 1;
}

async function getCompetitionById(id) {
  const allCompetitions = await getCompetitions(true);
  const competition = allCompetitions.find(
    (competition) => competition._id === id
  );
  return competition;
}
const getResultsBtn = document.querySelector(".results");
getResultsBtn.addEventListener("click", getResults);
async function getResults() {
  const prevHtml = getResultsBtn.innerHTML;
  getResultsBtn.disabled = true;
  getResultsBtn.innerHTML = loadingHTML;
  const resultsUrl = `${url}/results?competitionId=${compResultsSelect.value}`;
  const competitionName = (await getCompetitionById(compResultsSelect.value))
    .name;
  await downloadFile(resultsUrl, `Rezultati ${competitionName}`);
  getResultsBtn.innerHTML = prevHtml;
  getResultsBtn.disabled = false;
}
const backupsBtn = document.querySelector(".backups");
backupsBtn.addEventListener("click", getBackups);
async function getBackups() {
  const prevHtml = backupsBtn.innerHTML;
  backupsBtn.disabled = true;
  backupsBtn.innerHTML = loadingHTML;
  const backupsUrl = `${url}/backup`;
  await downloadFile(
    backupsUrl,
    `Sigurnosna kopija ${new Date().toLocaleDateString()}`
  );
  backupsBtn.innerHTML = prevHtml;
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
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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
async function getCompetitions(parseAsJson = false) {
  try {
    const allCompetitionsResponse = await fetch(`${url}/competitions`, {
      credentials: "include",
    });
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
sessionValid(true);
