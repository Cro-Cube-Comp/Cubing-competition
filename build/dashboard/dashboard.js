import {
  formatInputToSeconds,
  formatTime,
  getAverage,
} from "../Scripts/solveTime.js";
import {
  getRole,
  getId,
  getToken,
  tokenValid,
  isUser,
  addToken,
} from "../Scripts/credentials.js";
import { url, loadingHTML } from "../Scripts/variables.js";
const usersDiv = document.querySelector(".users");
window.setWinner = async function (winnerId) {
  const winnerButton = document.querySelector(`.set-winner-${winnerId}`);
  const originalHTML = winnerButton.innerHTML;

  try {
    toggleButtonState(winnerButton, true, loadingHTML);
    const response = await announceWinner(winnerId);
    alert(response.message);
  } catch (error) {
    console.error("Error announcing the winner:", error);
    alert("Nije uspjelo postavljanje pobjednika. Molim te pokušaj ponovno.");
  } finally {
    toggleButtonState(winnerButton, false, originalHTML);
  }
};
function toggleButtonState(button, isDisabled, htmlContent) {
  button.disabled = isDisabled;
  button.innerHTML = htmlContent;
}
async function announceWinner(winnerId) {
  const response = await fetch(`${url}/winner/announce`, {
    method: "POST",
    body: JSON.stringify({ id: winnerId }),
    headers: addToken({ "Content-Type": "application/json" }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }

  return response.json();
}
async function getCompetitions(parseAsJson = false) {
  try {
    const allCompetitionsResponse = await fetch(`${url}/competitions/get`);
    if (parseAsJson) {
      return await allCompetitionsResponse.json();
    }
    return allCompetitionsResponse;
  } catch (error) {
    console.error("Error fetching all competitions:\n", error);
    throw new Error("Error fetching all competitions.");
  }
}
async function getCompetitionById(id) {
  try {
    const allCompetitions = await getCompetitions(true);
    const competition = allCompetitions.find(
      (competition) => competition.id === id
    );
    return competition;
  } catch (error) {
    console.error("Error fetching competition data:", error);
    return null;
  }
}
function addAddSolveListenerToInputs() {
  const solveInputs = document.querySelectorAll(".solve-input");
  solveInputs.forEach((input) => {
    const elementValues = input.id.slice("solve-input-".length).split("-");
    const userId = elementValues[0];
    const competitionId = elementValues[1];
    const event = elementValues[2];
    const round = parseInt(elementValues[3]);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const solves = input.value
          .split(" ")
          .map((solve) => {
            return formatInputToSeconds(solve);
          })
          .filter((solve) => Boolean(solve))
          .slice(0, 5);
        if (solves.length === 0) {
          return;
        }
        // 1. Split by spaces
        // 2. Use the formatter to convert each solve to seconds (ex. 1543 = 15.43)
        // 3. Filter the ones that include letters
        // 4. Accept only the first 5 solves
        addSolve(userId, round - 1, solves, event, competitionId);
      }
    });
    const button = document.getElementById(
      `solve-add-btn-${userId}-${event}-${round}`
    );
    button.addEventListener("click", () => {
      addSolve(
        userId,
        round - 1,
        userIndex,
        [formatInputToSeconds(input.value)],
        event,
        competitionId
      );
    });
  });
}
async function createCompetitionsHtml(user) {
  let compHtml = "";
  if (!user.competitions) user.competitions = [];
  const allComps = await getCompetitions(true);
  for (const comp of allComps) {
    const competitionHtml = await createCompetitionHtml(comp, user);
    compHtml += competitionHtml;
  }
  return compHtml;
}
async function createCompetitionHtml(comp, user) {
  const compDate = new Date(comp.date).toLocaleString();
  const compId = comp._id;
  const userId = user._id;
  const userComp =
    user.competitions.find((comp) => comp.competitionId === compId) || null;
  let html = "";
  html += `<div class="competition">`;
  html += `<h2>${comp.name}</h2>`;
  html += `<p>Datum: ${compDate}</p>`;
  comp.events.forEach((event) => {
    const eventName = event.name; // 3x3,4x4,3x3oh...
    const userEvent = userComp
      ? userComp.events.find((event) => event.event === eventName) || null
      : null;
    html += `<div class="event">`;
    html += `<h3>${eventName}</h3>`;
    for (let i = 0; i < event.rounds; i++) {
      const roundNumber = i + 1;
      const solves = userEvent ? userEvent.rounds[i] || [] : [];
      html += `<div class="round round-${roundNumber}">`;
      html += `<h4>Runda ${roundNumber}</h4>`;
      html += `<p>Ao5: ${getAverage(solves)}</p>`;
      html += `<ol class="solves-list">`;
      html += solves
        .map((solve, j) => {
          const solveNumber = j + 1;
          const time = solve === 0 ? "DNF/DNS" : formatTime(solve);
          return `<li class="solve-li solve-li-${solveNumber}">${time}</li> <button type="button" onclick="deleteSolve('${userId}', ${j}, ${i}, '${eventName}', '${compId}')">Izbriši</button>`;
        })
        .join("");
      html += `</ol>`;
      if (solves.length < 5) {
        html += `<input inputmode="numeric" pattern="[0-9 ]*" placeholder="Dodaj slaganje" type="text" class="solve-input" id="solve-input-${userId}-${compId}-${eventName}-${roundNumber}" data-userid=""/>
      <button class="solve-add-btn" id="solve-add-btn-${userId}-${eventName}-${roundNumber}">Dodaj</button>`;
      }
      html += `</div>`; // close .round
    }
    html += `</div>`; // close .event
  });
  html += `</div>`; // close .competition

  return html;
}
window.showCompetition = async function (userId, index) {
  enableAllSolveButtons();
  const userDiv = document.getElementById(`user-${userId}`);
  const showCompBtn = userDiv.querySelector(".showComp-btn");
  const prevHTML = showCompBtn.innerHTML;
  showCompBtn.disabled = true;
  showCompBtn.innerHTML = loadingHTML;

  try {
    const user = await fetch(`${url}/users/${userId}`, {
      headers: addToken({}),
    }).then((response) => response.json());

    if (!user) {
      userDiv.querySelector(
        ".comp"
      ).innerHTML = `<p>Korisnik nije pronađen.</p>`;
      return;
    }
    const compHtml = await createCompetitionsHtml(user);
    userDiv.querySelector(".comp").innerHTML = compHtml;
    addAddSolveListenerToInputs();
  } catch (error) {
    console.error("Error fetching user data:", error);
    userDiv.querySelector(
      ".comp"
    ).innerHTML = `<p>Error loading competition data.</p>`;
  } finally {
    showCompBtn.disabled = false;
    showCompBtn.innerHTML = prevHTML;
  }
}; // Make showCompetition() global by using window.showCompetition = ...

async function addSolve(userId, roundIndex, solves, event, competitionId) {
  const roundNumber = roundIndex + 1;
  const solveData = {
    round: roundNumber,
    solves: {
      event: event,
      rounds: solves,
    },
    competitionId,
  };

  // Šalje podatke na server
  const response = await fetch(`${url}/solves/add/${userId}`, {
    method: "POST",
    headers: addToken({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(solveData),
  });

  const data = await response.json();

  // Ažurira prikaz natjecanja nakon uspješnog dodavanja
  if (response.ok) {
    await showCompetition(userId);
    return response.status;
  }

  // Prikazuje poruku o grešci ako postoji
  if (data.message) {
    alert(data.message);
    return response.status;
  }

  alert("Greška prilikom dodavanja slaganja. Pokušaj ponovno.");
  return response.status;
}
window.getUsers = async function () {
  const body = {
    method: "GET",
    headers: addToken({}),
  };
  try {
    const data = await fetch(`${url}/users/all`, body);
    const result = await data.json();
    return result;
  } catch (error) {
    console.error(error);
    alert("Greška prilikom povezivanja.");
  }
};

window.deleteUser = async function (id) {
  if (id === getId()) {
    alert("Nedopušteno brisanje vlastitog računa.");
    return;
  }
  try {
    const body = {
      method: "DELETE",
      headers: addToken({}),
    };
    const data = await fetch(`${url}/users/${id}`, body);
    const result = await data.json();
    if (data.ok) {
      main();
      return;
    }
    console.error("Greška prilikom brisanja korisnika.\n", result.message);
    alert("Greška prilikom brisanja korisnika.");
  } catch (error) {
    console.error(error);
    alert(error);
  }
};

window.assignAdmin = async function (id, username) {
  const body = {
    method: "POST",
    headers: addToken({}),
  };
  try {
    const data = await fetch(`${url}/admin/assign/${id}`, body);
    const response = await data.json();
    alert(response.message);
    if (data.ok) {
      main();
      return;
    }
  } catch (error) {
    console.error(error);
    alert(error);
  }
};

window.displayUsers = function (users) {
  let html = "";
  usersDiv.innerHTML = "";
  users.forEach((user, index) => {
    const username = user.username;
    const id = user.id;
    const role = user.role;
    const group = user.group;
    html += `<div class="user" id="user-${id}">`;
    html += `<div class="username-div">`;
    html += `<p class="username">${username}</p>`;
    html += `<img class="manage-accounts" src="../Images/manage_accounts.svg"/>`;
    html += `</div>`; // close .username-div
    html += `<p class="role">Uloga: ${role}</p>`;
    html += `<p class="group">Grupa ${group}</p>`;
    // Add a delete button for each user
    html += `<button onclick="deleteUser('${id}')">Izbriši</button>`;
    html += `<button onclick="assignAdmin('${id}', '${username}')">Postavi za admina</button>`;
    html += `<button class="showComp-btn" onclick="showCompetition('${id}', ${index})">Natjecanje</button>`;
    html += `<button class="set-winner-${id}" onclick="setWinner('${id}')">Pobjednik</button>`;
    html += `<div class="comp">`;
    html += `</div>`;
    html += `</div>`; // end user div
  });
  usersDiv.innerHTML = html;
};

window.deleteSolve = async function (
  userId,
  solveIndex,
  roundIndex,
  eventName,
  compId
) {
  const roundNumber = roundIndex + 1;
  const solveNumber = solveIndex + 1;
  // Call the backend to delete the solve
  disableAllSolveButtons();
  const response = await fetch(`${url}/solves/delete/${userId}`, {
    method: "DELETE",
    headers: addToken({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      round: roundNumber,
      solve: solveNumber,
      event: eventName,
      competitionId: compId,
    }),
  });

  if (response.ok) {
    showCompetition(userId);
    return;
  }
  // Handle errors
  const error = await response.json();
  alert(error.message);
  enableAllSolveButtons();
};
function disableAllSolveButtons() {
  const solveButtons = document.querySelectorAll(".solve-add-btn");
  solveButtons.forEach((button) => {
    button.disabled = true;
  });
}
function enableAllSolveButtons() {
  const solveButtons = document.querySelectorAll(".solve-add-btn");
  solveButtons.forEach((button) => {
    button.disabled = false;
  });
}

async function main() {
  tokenValid(true);
  if (isUser(getRole())) {
    alert("Samo administratori");
    location.href = "../";
  }
  getToken();

  const users = await getUsers();
  displayUsers(users);
}
main();

setInterval(() => tokenValid(true), 1000 * 60 * 10); // Every 10 minutes
