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
function createSolvesArrayFromInput(input) {
  // 1. Split by spaces
  // 2. Use the formatter to convert each solve to seconds (ex. 1543 = 15.43)
  // 3. Filter the ones that include letters
  // 4. Accept only the first 5 solves
  return input.value
    .split(" ")
    .map((solve) => {
      return formatInputToSeconds(solve);
    })
    .filter((solve) => Boolean(solve))
    .slice(0, 5);
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
      if (e.key !== "Enter") return;
      const solves = createSolvesArrayFromInput(input);
      if (solves.length === 0) {
        return;
      }
      addSolve(userId, round - 1, solves, event, competitionId);
    });
    const button = document.getElementById(
      `solve-add-btn-${userId}-${event}-${round}`
    );
    button.addEventListener("click", () => {
      const solves = createSolvesArrayFromInput(input);
      if (solves.length === 0) {
        return;
      }
      addSolve(userId, round - 1, solves, event, competitionId);
    });
  });
}
function createSelectCompetitionTag(allComps, userId, selectedCompId) {
  const select = document.createElement("select");
  select.classList.add("select-comp");
  select.id = `select-comp-${userId}`;
  select.addEventListener("change", (e) => {
    const compId = e.target.value;
    showCompetition(userId, compId);
  });
  allComps.forEach((comp) => {
    const compId = comp._id;
    const compName = comp.name;

    const option = document.createElement("option");
    option.value = compId;
    option.innerHTML = compName;
    option.classList.add("select-comp-option");
    select.appendChild(option);
    if (selectedCompId && selectedCompId === compId) {
      // Select option which is the competition the user is currently viewing
      // Unless, it will be the first option, which is the default
      option.setAttribute("selected", "selected");
    }
  });
  return select;
}
function addSwitchCompetitionListeners() {
  const selectComps = document.querySelectorAll(".select-comp");
  selectComps.forEach((select) => {
    select.addEventListener("change", (e) => {
      const compId = e.target.value;
      const userId = e.target.id.slice("select-comp-".length);
      showCompetition(userId, compId);
    });
  });
}
async function createCompetitionsHtml(user, compId = undefined) {
  // Inner html of .comp div will be html this function returns
  const competitionsElement = document.createElement("div");
  if (!user.competitions) user.competitions = [];
  const allComps = await getCompetitions(true);
  const selectCompElement = createSelectCompetitionTag(
    allComps,
    user._id,
    compId
  );
  competitionsElement.appendChild(selectCompElement);

  const comp = allComps.find((comp) => comp._id === compId);
  const competition = comp ? comp : allComps[0]; // Default to first comp
  const competitionElement = await createCompetitionElement(competition, user);
  competitionsElement.appendChild(competitionElement);

  return competitionsElement;
}
async function createCompetitionElement(comp, user) {
  const compDate = new Date(comp.date).toLocaleString();
  const compId = comp._id;
  const userId = user._id;
  const userComp =
    user.competitions.find((comp) => comp.competitionId === compId) || null;
  const competitionElement = document.createElement("div");
  competitionElement.classList.add("competition");
  // Competition title
  const compTitleElement = document.createElement("h2");
  compTitleElement.textContent = comp.name;
  competitionElement.appendChild(compTitleElement);
  // Competition date
  const compDateElement = document.createElement("p");
  compDateElement.textContent = `Datum: ${compDate}`;
  competitionElement.appendChild(compDateElement);
  comp.events.forEach((event) => {
    // Event element
    const eventElement = document.createElement("div");
    competitionElement.appendChild(eventElement);

    eventElement.classList.add("event");

    const eventName = event.name; // 3x3,4x4,3x3oh...
    const userEvent = userComp
      ? userComp.events.find((event) => event.event === eventName) || null
      : null;
    const eventNameElement = document.createElement("h3");
    eventNameElement.textContent = eventName;
    eventElement.appendChild(eventNameElement);
    for (let i = 0; i < event.rounds; i++) {
      const roundNumber = i + 1;
      const roundElement = document.createElement("div");
      eventElement.appendChild(roundElement);
      roundElement.classList.add("round");
      roundElement.classList.add(`round-${roundNumber}`);

      const solves = userEvent ? userEvent.rounds[i] || [] : [];
      // Round title
      const roundTitleElement = document.createElement("h4");
      roundTitleElement.textContent = `Runda ${roundNumber}`;
      roundElement.appendChild(roundTitleElement);
      // Round average time
      const roundAverageTimeElement = document.createElement("p");
      roundAverageTimeElement.textContent = `Ao5: ${getAverage(solves)}`;
      roundElement.appendChild(roundAverageTimeElement);
      // Round solves list
      const solvesListElement = document.createElement("ol");
      solvesListElement.classList.add("solves-list");

      // Round solves
      solves.forEach((solve, j) => {
        const solveNumber = j + 1;
        // Solve element
        const solveElement = document.createElement("li");
        solveElement.classList.add("solve-li");
        solveElement.classList.add(`solve-li-${solveNumber}`);
        const time = solve === 0 ? "DNF/DNS" : formatTime(solve);
        solveElement.textContent = time;
        // Delete solve button
        const deleteSolveButton = document.createElement("button");
        deleteSolveButton.textContent = "Izbriši";
        deleteSolveButton.addEventListener("click", () =>
          deleteSolve(userId, j, i, eventName, compId)
        );
        // Add elements
        solvesListElement.appendChild(solveElement);
        solvesListElement.appendChild(deleteSolveButton);
      });
      roundElement.appendChild(solvesListElement);
      if (solves.length < 5) {
        // Add solve input
        const addSolveInput = document.createElement("input");
        addSolveInput.inputMode = "numeric";
        addSolveInput.pattern = "[0-9 ]*";
        addSolveInput.placeholder = "Dodaj slaganje";
        addSolveInput.type = "text";
        addSolveInput.classList.add("solve-input");
        // addSolveInput.id = `solve-input-${userId}-${compId}-${eventName}-${roundNumber}`;
        addSolveInput.addEventListener("keydown", (e) => {
          if (e.key !== "Enter") return;
          const solves = createSolvesArrayFromInput(addSolveInput);
          if (solves.length === 0) {
            return;
          }
          addSolve(userId, roundNumber - 1, solves, eventName, compId);
        });
        // Add solve button
        const addSolveButton = document.createElement("button");
        addSolveButton.classList.add("solve-add-btn");
        addSolveButton.textContent = "Dodaj";
        addSolveButton.addEventListener("click", () => {
          const solves = createSolvesArrayFromInput(addSolveInput);
          if (solves.length === 0) {
            return;
          }
          addSolve(userId, roundNumber - 1, solves, eventName, compId);
        });
        // Append elements
        roundElement.appendChild(addSolveInput);
        roundElement.appendChild(addSolveButton);
      }
    }
  });
  return competitionElement;
}
window.showCompetition = async function (userId, compId = undefined) {
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
      const notFoundElement = document.createElement("p");
      notFoundElement.textContent = "Korisnik nije pronađen.";
      userDiv.querySelector(".comp").innerHTML = "";
      userDiv.querySelector(".comp").appendChild(notFoundElement);
      return;
    }
    const competitionsElement = await createCompetitionsHtml(user, compId);
    const userCompElement = userDiv.querySelector(".comp");
    userCompElement.innerHTML = "";
    userCompElement.appendChild(competitionsElement);
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
    await showCompetition(userId, competitionId);
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

function displayUsers(users) {
  const allUsersElement = document.createElement("div");
  allUsersElement.classList.add("all-users");
  users.forEach((user, index) => {
    const username = user.username;
    const id = user.id;
    const role = user.role;
    const group = user.group;
    const userElement = document.createElement("div");
    userElement.classList.add("user");
    userElement.id = `user-${id}`;
    // Username div
    const usernameDiv = document.createElement("div");
    usernameDiv.classList.add("username-div");
    // Username element
    const usernameP = document.createElement("p");
    usernameP.classList.add("username");
    usernameP.textContent = username;
    // Manage accounts image
    const manageAccountsImg = document.createElement("img");
    manageAccountsImg.classList.add("manage-accounts");
    manageAccountsImg.src = "../Images/manage_accounts.svg";
    // Add elements to the user element
    usernameDiv.appendChild(usernameP);
    usernameDiv.appendChild(manageAccountsImg);
    userElement.appendChild(usernameDiv);
    // Role element
    const roleP = document.createElement("p");
    roleP.classList.add("role");
    roleP.textContent = `Uloga: ${role}`;
    userElement.appendChild(roleP);
    // Group element
    const groupP = document.createElement("p");
    groupP.classList.add("group");
    groupP.textContent = `Grupa ${group}`;
    userElement.appendChild(groupP);

    // Delete user button
    const deleteUserButton = document.createElement("button");
    deleteUserButton.textContent = "Izbriši";
    deleteUserButton.addEventListener("click", () => deleteUser(id));
    userElement.appendChild(deleteUserButton);
    // Assign admin button
    const assignAdminButton = document.createElement("button");
    assignAdminButton.textContent = "Postavi za admina";
    assignAdminButton.addEventListener("click", () =>
      assignAdmin(id, username)
    );
    userElement.appendChild(assignAdminButton);
    // Show competition button
    const showCompetitionButton = document.createElement("button");
    showCompetitionButton.classList.add("showComp-btn");
    showCompetitionButton.textContent = "Natjecanje";
    showCompetitionButton.addEventListener("click", () => showCompetition(id));
    userElement.appendChild(showCompetitionButton);
    // Set winner button
    const setWinnerButton = document.createElement("button");
    setWinnerButton.classList.add(`set-winner-${id}`);
    setWinnerButton.textContent = "Pobjednik";
    setWinnerButton.addEventListener("click", () => setWinner(id));
    userElement.appendChild(setWinnerButton);
    // Competition element
    const compElement = document.createElement("div");
    compElement.classList.add("comp");
    userElement.appendChild(compElement);
    allUsersElement.appendChild(userElement);
  });
  usersDiv.innerHTML = "";
  usersDiv.appendChild(allUsersElement);
}
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
    showCompetition(userId, compId);
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
