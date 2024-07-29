import { url, loadingHTML } from "../Scripts/variables.js";
import { tokenValid, isAdmin, getRole } from "../Scripts/credentials.js";
const createCompBtn = document.querySelector(".create-comp-btn");
function getEvents(competition) {
  return competition.events;
}
async function getCompetitions() {
  const response = await fetch(`${url}/competitions`, {
    credentials: "include",
  });
  const data = await response.json();

  return data;
}
function offsetDate(date, offset) {
  const date2 = new Date(date);
  date2.setHours(date2.getHours() + offset);
  return date2;
}
async function createCompetitionHtml(competition) {
  const events = getEvents(competition);
  const offsetInHours = new Date(competition.date).getTimezoneOffset() / 60;
  const compDate = offsetDate(new Date(competition.date), offsetInHours);

  const eventsHtml = events
    .map((event) => `<li class="event">${event.name}</li>`)
    .join("\n");
  const lockedClass = competition.isLocked ? "locked" : "";
  const html = `<div class="competition">
    <h2>${competition.name}</h2>
    <p>Datum: ${compDate.toLocaleString()}</p>
    <h2>Eventovi</h2>
    <ul class="events-list">
    ${eventsHtml}
    </ul>
    <button id="edit-btn-${
      competition._id
    }" class="edit-button ${lockedClass}"><img src="../Images/edit.svg"></button>
    <button id="delete-btn-${
      competition._id
    }" class="delete-button ${lockedClass}"><img src="../Images/delete.svg"></button>
    <button id="lock-btn-${
      competition._id
    }" class="lock-button ${lockedClass}"><img src="${
    competition.isLocked ? "../Images/unlocked.svg" : "../Images/locked.svg"
  }"></button>
  </div>`;
  return html;
}
async function deleteCompetition(id) {
  const response = await fetch(`${url}/competitions/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return {
    status: response.status,
    success: response.ok,
    parsed: await response.json(),
  };
}
async function editCompetition(id, name, date, events) {
  const response = await fetch(`${url}/competitions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      date,
      events,
    }),
    credentials: "include",
  });
  return {
    status: response.status,
    success: response.ok,
    parsed: await response.json(),
  };
}
function createEditCompModal(id, comp) {
  const compName = comp.name;
  // Offset it by 2 hours since Croatia is GMT+2
  const compDate = new Date(comp.date).toISOString().split(".")[0];
  const events = comp.events.map((event) => event.name).join(" ");
  const modal = document.createElement("dialog");
  modal.classList.add("edit-comp-modal");
  modal.innerHTML = `<form class="edit-comp-form">
  <h2>Uredi natjecanje</h2>
  <label for="comp-name">Ime natjecanja</label>
  <br />
  <input type="text" id="comp-name" name="name" required>
   <br />
  <label for="comp-date">Datum natjecanja</label>
  <br />
  <input type="datetime-local" id="comp-date" name="date" required>
  <br />
  <label for="comp-events">Eventovi</label>
  <br />
  <input id="comp-events" name="events" type="text" required>
  <button type="submit" class="edit-comp-submit">Potvrdi</button>
</form>`;
  document.body.appendChild(modal);
  modal.showModal();
  const form = modal.querySelector(".edit-comp-form");
  form.querySelector("#comp-name").value = compName;
  form.querySelector("#comp-date").value = compDate;
  form.querySelector("#comp-events").value = events;
  const submitBtn = modal.querySelector(".edit-comp-submit");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.innerHTML = loadingHTML;
    const result = await editCompetition(
      id,
      form.querySelector("#comp-name").value,
      form.querySelector("#comp-date").value,
      form
        .querySelector("#comp-events")
        .value.toLowerCase()
        .split(" ")
        .map((event) => {
          return { name: event.trim(), rounds: 3 };
        })
        .filter((event) => event.name) // Remove empty strings which show up after using 2 spaces
    );
    modal.close();
    if (result.success) {
      main();
      return;
    }
    console.error(result.parsed.message);
    alert("Greška prilikom mijenjanja natjecanja");
  });
}
async function makeAndInsertCompetitions() {
  const competitions = await getCompetitions();
  document.querySelector(".competitions").innerHTML = "";
  competitions.forEach(async (competition) => {
    const compId = competition._id;
    const competitionHtml = await createCompetitionHtml(competition);
    document
      .querySelector(".competitions")
      .insertAdjacentHTML("beforeend", competitionHtml);
    const editButton = document.getElementById(`edit-btn-${compId}`);
    editButton.addEventListener("click", async () => {
      if (competition.isLocked) {
        alert("Natjecanje je zaključano. Ne možete ga urediti.");
        return;
      }
      createEditCompModal(compId, competition);
    });
    const deleteButton = document.getElementById(`delete-btn-${compId}`);
    deleteButton.addEventListener("click", async () => {
      if (competition.isLocked) {
        alert("Natjecanje je zaključano. Ne možete ga obrisati.");
        return;
      }
      await deleteCompetition(compId);
      main();
    });
    const lockButton = document.getElementById(`lock-btn-${compId}`);
    lockButton.addEventListener("click", async () => {
      const result = await lockCompetition(compId);
      if (result.success) {
        main();
        return;
      }
      console.error(
        `Error locking competition: ${result.parsed.message}
        
        Status: ${result.status}`
      );
      alert("Greška prilikom zaključavanja natjecanja");
    });
  });
}
async function createCompetition(name, date, events) {
  if (typeof name !== "string" || typeof date !== "string") {
    return;
  }
  const response = await fetch(`${url}/competitions/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      date,
      events,
    }),
    credentials: "include",
  });
  const parsedData = await response.json();
  return {
    status: response.status,
    success: response.ok,
    parsed: parsedData,
  };
}
function createMakeCompModalAndAppendToBody() {
  const modal = document.createElement("dialog");
  modal.classList.add("make-comp-modal");
  modal.innerHTML = `<form class="make-comp-form">
  <h2>Kreiraj natjecanje</h2>
  <label for="comp-name">Ime natjecanja</label>
  <br />
  <input type="text" id="comp-name" name="name" required>
  <br />
  <label for="comp-date">Datum natjecanja</label>
  <br />
  <input type="datetime-local" id="comp-date" name="date" required>
  <br />
  <label for="comp-events">Eventovi</label>
  <p>Prihvaća se: 3x3 ,4x4, 3x3oh, 2x2. Razdvoji ih razmakom.</p>
  <br />
  <input name="events" type="text" id="comp-events" required>
  <br />
  <button type="submit" class="make-comp-submit">Kreiraj</button>
</form>`;
  document.body.appendChild(modal);
  return modal;
}
function addListenerToCreateComp(modal) {
  const submitBtn = modal.querySelector(".make-comp-submit");
  const date = modal.querySelector("#comp-date");
  const title = modal.querySelector("#comp-name");
  const eventsInput = modal.querySelector("#comp-events");
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent page reload
    submitBtn.innerHTML = loadingHTML;
    const result = await createCompetition(
      title.value,
      date.value,
      eventsInput.value
        .toLowerCase()
        .split(" ")
        .map((event) => {
          return { name: event.trim(), rounds: 3 };
        })
        .filter((event) => event.name) // Remove empty strings which show up after using 2 spaces
    );
    modal.close();
    if (result.success) {
      main();
      return;
    }
    console.error(result.parsed.message);
    alert("Greška prilikom izrade natjecanja");
  });
}
function createMakeCompModal() {
  const modal = createMakeCompModalAndAppendToBody();
  addListenerToCreateComp(modal);
  modal.showModal();
}
async function lockCompetition(id) {
  const response = await fetch(`${url}/competitions/${id}/lock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return {
    status: response.status,
    success: response.ok,
    parsed: await response.json(),
  };
}
createCompBtn.addEventListener("click", () => {
  createMakeCompModal();
});

main();
async function main() {
  if (!isAdmin(getRole())) {
    window.location.href = "../";
  }
  tokenValid(true);
  await makeAndInsertCompetitions();
}
