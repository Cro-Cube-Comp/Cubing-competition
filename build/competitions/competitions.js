import { url } from "../Scripts/variables.js";
import {
  getAverage,
  formatTime,
  getAverageNoFormat,
} from "../Scripts/solveTime.js";
async function getCompetitions() {
  const data = await fetch(`${url}/competitions`);
  const parsedJSON = await data.json();
  return {
    parsed: parsedJSON,
    success: data.ok,
    status: data.status,
  };
}
function seperateUsersByGroup(users) {
  const groups = [[], []];
  users.forEach((user) => {
    const groupIndex = user.group - 1;
    groups[groupIndex].push(user);
  });
  return groups;
}
function createUsersHtml(usersInGroup, compId, compEvent, roundIndex) {
  let html = "";
  usersInGroup.forEach((user) => {
    if (!user.competitions) return;
    const comp = user.competitions.find(
      (comp) => comp.competitionId === compId
    );
    if (!comp) return;
    const event = comp.events.find(
      (userEvent) => userEvent.event === compEvent
    );
    if (!event) return;
    const round = event.rounds[roundIndex];
    if (!round) return;
    html += createUserHtml(user, round);
  });
  return html;
}
function createUserHtml(user, round) {
  let html = "";
  html += `<div class="user">`;
  html += `<h4>${user.username}</h4>`;
  html += `<p>Prosjek: ${getAverage(round)}</p>`;
  html += `<ol class="solves">`;
  for (
    let i = 0;
    i < 5; // 5 is the number of solves in a round
    i++
  ) {
    const solve = !round[i]
      ? "X"
      : round[i] !== 0
      ? formatTime(round[i])
      : "DNF/DNS";
    html += `<li>${solve}</li>`;
  }
  html += `</ol>`; // Close .solves ol
  html += `</div>`; // Close .user div
  return html;
}
function createGroupHtml(usersInGroup, groupIndex, competition) {
  const groupNumber = groupIndex + 1;
  let html = "";
  html += `<div class="group">`;
  html += `<div class="group-number-container">`;
  html += `<h2 class="group-number">Grupa ${groupNumber}</h2>`;
  html += `</div>`; // .group-number-container div
  competition.events.forEach((event) => {
    html += `<div class="event-name-container">`;
    html += `<h3 class="event-name">${event.name}</h3>`;
    html += `</div>`; // .event-name-container div
    html += `<div class="event">`;
    for (let i = 0; i < event.rounds; i++) {
      const roundNumber = i + 1;
      const roundIndex = i;
      html += `<div class="round-number-container">`;
      html += `<h4 class="round-number">Runda ${roundNumber}</h4>`;
      html += `</div>`; // .round-number-container div
      html += `<div class="round">`;

      html += createUsersHtml(
        usersInGroup,
        competition._id,
        event.name,
        roundIndex
      );
      html += `</div>`; // Close .round div
    }
    html += `</div>`; // Close .event div
  });
  html += `</div>`; // Close .group div
  return html;
}
function makeCompetitionHtml(response, competitions) {
  let html = "";
  html += `<p class="last-updated">Posljednja izmjena: ${response.lastUpdated}</p>`;
  const groups = seperateUsersByGroup(response.users);
  competitions.forEach((competition) => {
    html += `<div class="competition">`;
    html += `<h2 class="comp-name">${competition.name}</h2>`;
    groups.forEach((group, groupIndex) => {
      html += createGroupHtml(group, groupIndex, competition);
    });
    html += `</div>`; // Close .competition div
  });
  return html;
}
async function getSolves() {
  const data = await fetch(`${url}/solves/get`);
  const parsedJSON = await data.json();
  return {
    parsed: parsedJSON,
    success: data.ok,
    status: data.status,
  };
}
async function main() {
  const solves = await getSolves();
  const competitions = await getCompetitions();
  if (!solves.success) {
    console.error(solves.parsed);
    alert("Greška prilikom dohvaćanja slaganja.");
    return;
  }
  if (!competitions.success) {
    console.error(competitions.parsed);
    alert("Greška prilikom dohvaćanja natjecanja.");
    return;
  }
  const html = makeCompetitionHtml(solves.parsed, competitions.parsed);
  document.querySelector(".competitions").innerHTML = html;
}
main();
