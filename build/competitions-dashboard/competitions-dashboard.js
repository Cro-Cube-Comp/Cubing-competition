import { url, loadingHTML } from "../Scripts/variables.js";
import {
  addToken,
  tokenValid,
  isAdmin,
  getRole,
} from "../Scripts/credentials.js";
const createCompBtn = document.querySelector(".create-comp-btn");
const createCompDateInput = document.querySelector(".comp-date");
const createCompNameInput = document.querySelector(".create-comp-name");
function getEvents(competition) {
  return competition.events;
}
async function getCompetitions() {
  const response = await fetch(`${url}/competitions/get`);
  const data = await response.json();

  return data;
}
async function createCompetitionHtml(competition) {
  const events = getEvents(competition);
  const eventsHtml = events
    .map((event) => `<li class="event">${event.name}</li>`)
    .join("\n");
  const html = `<div class="competition">
    <h2>${competition.name}</h2>
    <p>Datum: ${new Date(competition.date).toLocaleString()}</p>
    <h2>Eventovi</h2>
    <ul class="events-list">
    ${eventsHtml}
    </ul>
    <button id="edit-btn-${competition._id}" class="edit-button">Uredi</button>
    <button id="delete-btn-${
      competition._id
    }" class="delete-button ">Obriši</button>
  </div>`;
  return html;
}
async function deleteCompetition(id) {
  const response = await fetch(`${url}/competitions/delete/${id}`, {
    method: "DELETE",
    headers: addToken({
      "Content-Type": "application/json",
    }),
  });
  return {
    status: response.status,
    success: response.ok,
    parsed: await response.json(),
  };
}
async function editCompetition(id, name, date) {
  console.log(id, name, date);
  const response = await fetch(`${url}/competitions/edit/${id}`, {
    method: "PUT",
    headers: addToken({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      name,
      date,
    }),
  });
  return {
    status: response.status,
    success: response.ok,
    parsed: await response.json(),
  };
}
function add2HoursToDate(date) {
  const date2 = new Date(date);
  date2.setHours(date2.getHours() + 2);
  return date2;
}
function createEditCompModal(id, comp) {
  const compName = comp.name;
  // Offset it by 2 hours since Croatia is GMT+2
  const compDate = add2HoursToDate(new Date(comp.date))
    .toISOString()
    .split(".")[0];
  console.log();
  const modal = document.createElement("dialog");
  modal.classList.add("edit-comp-modal");
  modal.innerHTML = `<form class="edit-comp-form">
  <h2>Uredi natjecanje</h2>
  <label for="comp-name">Ime natjecanja</label>
  <input type="text" id="comp-name" name="name" required>
  <label for="comp-date">Datum natjecanja</label>
  <input type="datetime-local" id="comp-date" name="date" required>
  <button type="submit" class="edit-comp-submit">Potvrdi</button>
</form>`;
  document.body.appendChild(modal);
  modal.showModal();
  const form = modal.querySelector(".edit-comp-form");
  form.querySelector("#comp-name").value = compName;
  form.querySelector("#comp-date").value = compDate;
  const submitBtn = modal.querySelector(".edit-comp-submit");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.innerHTML = loadingHTML;
    const result = await editCompetition(
      id,
      form.querySelector("#comp-name").value,
      form.querySelector("#comp-date").value
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
      createEditCompModal(compId, competition);
    });
    const deleteButton = document.getElementById(`delete-btn-${compId}`);
    deleteButton.addEventListener("click", async () => {
      await deleteCompetition(compId);
      main();
    });
  });
  console.log(competitions);
}
async function createCompetition(name, date, events) {
  if (typeof name !== "string" || typeof date !== "string") {
    return;
  }
  const response = await fetch(`${url}/competitions/create`, {
    method: "POST",
    headers: addToken({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      name,
      date,
      events,
    }),
  });
  const data = await response.json();
  return data;
}
async function main() {
  if (!isAdmin(getRole())) {
    window.location.href = "../";
  }
  tokenValid(true);
  await makeAndInsertCompetitions();
}
createCompBtn.addEventListener("click", () => {
  const name = createCompNameInput.value;
  const date = new Date(createCompDateInput.value).toISOString();
  const event = {
    name: "3x3",
    rounds: 3,
  };

  if (name && date) {
    createCompetition(name, date, [event]);
  } else {
    console.error("Name and date are required.");
    alert("Ime i datum natjecanja su obavezni.");
  }
});

main();
