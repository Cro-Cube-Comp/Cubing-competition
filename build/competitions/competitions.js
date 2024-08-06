import { url } from "../Scripts/variables.js";
import {
  getAverage,
  formatTime,
  getAverageNoFormat,
} from "../Scripts/solveTime.js";
const competitionsDiv = document.querySelector(".competitions");
async function getResults() {
  try {
    const data = await fetch(`${url}/competitions/results`);
    const parsedJSON = await data.json();
    return {
      parsed: parsedJSON,
      success: data.ok,
      status: data.status,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
function handleFail(retry) {
  if (retry <= 0) {
    alert("Greška prilikom dohvaćanja rezultata.");
    console.error("Failed to get results.");
    const retryBtn = document.createElement("button");
    retryBtn.textContent = "Pokušaj ponovo";
    retryBtn.addEventListener("click", () => {
      main(5);
    });
    competitionsDiv.innerHTML = "";
    competitionsDiv.appendChild(retryBtn);
    return;
  }
  console.error(`Failed to get results. Retrying... (${retry} retries left)`);
  const errorMsgP = document.createElement("p");
  errorMsgP.textContent = `Greška prilikom dohvaćanja rezultata. ${retry} pokušaj/a preostalo.`;
  competitionsDiv.innerHTML = "";
  competitionsDiv.appendChild(errorMsgP);
  main(retry - 1);
}
function createCompetitionDateElement(competition) {
  const dateP = document.createElement("p");
  dateP.classList.add("comp-date-p");
  const compDate = new Date(competition.date);
  dateP.textContent = `${compDate.toLocaleDateString()} ${compDate.toLocaleTimeString()}`;
  return dateP;
}
/**
 * Creates a heading for an event
 * @param {string} eventName
 * @returns  {HTMLHeadingElement}
 */
function createEventNameElement(eventName) {
  const nameH3 = document.createElement("h3");
  nameH3.classList.add("event-name");
  nameH3.textContent = eventName;
  return nameH3;
}
function seperateResultsByGroup(round) {
  const groups = [[], []];
  round.forEach((result) => {
    groups[result.group - 1].push(result);
  });
  return groups;
}
function createEmptyRoundResultsElement(roundIndex) {
  const roundDiv = document.createElement("div");
  roundDiv.classList.add("round-results");
  roundDiv.classList.add("hidden");
  roundDiv.id = `round-results-${roundIndex}`;
  const msgP = document.createElement("p");
  msgP.textContent = `Nema natjecatelja u ${roundIndex + 1}. rundi.`;
  roundDiv.appendChild(msgP);
  return roundDiv;
}
function createRoundResultsElement(round, roundIndex) {
  if (round.length === 0) {
    return createEmptyRoundResultsElement(roundIndex);
  }
  const roundDiv = document.createElement("div");
  roundDiv.classList.add("round-results");
  roundDiv.id = `round-results-${roundIndex}`;
  roundDiv.classList.add("hidden");
  round.forEach((solver, solveIndex) => {
    const solveNumber = solveIndex + 1;
    const solverDiv = document.createElement("div");
    solverDiv.classList.add("solver");
    const solvesP = document.createElement("p");
    solvesP.classList.add("solve");
    const solves = solver.solves.map((solve) => formatTime(solve)).join(", ");
    const average = solver.average > 0 ? formatTime(solver.average) : "Nema";
    solvesP.textContent = `${solveNumber}. ${solver.username}: ${solves} ( Ao5 ${average})`;
    solverDiv.appendChild(solvesP);
    roundDiv.appendChild(solverDiv);
  });
  return roundDiv;
}
/**
 * Creates a round title container with a heading and a show/hide button
 * @param {number} roundIndex - Index of the round for which title is being created
 * @returns {HTMLDivElement} .round-title-container div element with heading and show/hide button
 */
function createRoundTitleContainer(roundIndex) {
  // Define the image sources for show/hide button
  const hideImgSrc = "../Images/hide.svg";
  const showImgSrc = "../Images/show.svg";

  const roundTitleContainerElement = document.createElement("div");
  roundTitleContainerElement.classList.add("round-title-container");
  // Create a round title heading with class .round-title
  const roundTitleElement = document.createElement("h4");
  roundTitleElement.classList.add("round-title");
  roundTitleElement.textContent = `Runda ${roundIndex + 1}`;
  // Create show/hide button with class .show-hide-round-button and .show-hide
  const showHideButton = document.createElement("button");
  showHideButton.classList.add("show-hide-round-button");
  showHideButton.classList.add("show-hide");
  // Create a show/hide image with class .show-hide-round-button-img and append it to the button
  const showHideImage = document.createElement("img");
  showHideImage.src = hideImgSrc;
  showHideButton.appendChild(showHideImage);
  // Append the title and the button to the round title container
  roundTitleContainerElement.appendChild(roundTitleElement);
  roundTitleContainerElement.appendChild(showHideButton);

  showHideButton.addEventListener("click", (e) => {
    // Use 3 parent element because user might click on the show/hide image
    const roundResultsElement =
      e.target.parentElement.parentElement.parentElement.querySelector(
        `#round-results-${roundIndex}`
      );

    showHideRound(roundResultsElement, e);
  });
  /**
   * Shows/hides a round and updates the show/hide button
   * @param {HTMLDivElement} roundResultsElement
   * @param {MouseEvent} e
   * @returns {void}
   */
  function showHideRound(roundResultsElement, e) {
    roundResultsElement.classList.toggle("hidden");
    showHideButton.classList.toggle("hidden");
    // Update the image so it shows current state
    const showHideImage = showHideButton.querySelector("img");
    if (roundResultsElement.classList.contains("hidden")) {
      showHideImage.src = hideImgSrc;
      return;
    }
    showHideImage.src = showImgSrc;
  }
  // Return the round title container
  return roundTitleContainerElement;
}
/**
 * Returns a .group div element
 * @param {any[]} rounds - An array of 3 rounds
 * @param {1 | 2} groupNumber - The group number (1 or 2)
 * @returns {HTMLDivElement}
 */
function createGroupResultsElement(rounds, groupNumber) {
  const groupDiv = document.createElement("div");
  groupDiv.classList.add("group");
  groupDiv.id = `group-${groupNumber}`;
  // Group title container and group title
  const groupTitleContainerElement = document.createElement("div");
  groupTitleContainerElement.classList.add("group-title-container");

  const groupTitleElement = document.createElement("h4");
  groupTitleElement.classList.add("group-title");
  groupTitleElement.textContent = `Grupa ${groupNumber}`;
  groupTitleContainerElement.appendChild(groupTitleElement);
  // TODO: Add show/hide button
  groupDiv.appendChild(groupTitleContainerElement);
  // Create results for all 3 rounds
  const groupResultsDiv = document.createElement("div");
  groupResultsDiv.classList.add("group-results");
  groupDiv.appendChild(groupResultsDiv);
  // Loop through all rounds and create a .round div for each
  rounds.forEach((round, roundIndex) => {
    const roundNumber = roundIndex + 1;
    const roundDiv = document.createElement("div");
    roundDiv.classList.add("round");
    roundDiv.classList.add(`round-${roundNumber}`);
    // Title container, results container
    roundDiv.appendChild(createRoundTitleContainer(roundIndex));
    roundDiv.appendChild(createRoundResultsElement(round, roundIndex));
    groupResultsDiv.appendChild(roundDiv);
  });
  groupDiv.appendChild(groupResultsDiv);
  return groupDiv;
}
function createGroupsResultsElement(event) {
  const groupsDiv = document.createElement("div");
  groupsDiv.classList.add("groups");
  const roundsSeperateByGroup = [[], []];
  event.forEach((round) => {
    const solversSeperatedByGroup = seperateResultsByGroup(round);
    // We could use a for loop here but it would be less readable
    roundsSeperateByGroup[0].push(solversSeperatedByGroup[0]);
    roundsSeperateByGroup[1].push(solversSeperatedByGroup[1]);
  });
  roundsSeperateByGroup.forEach((group, groupIndex) => {
    // group: an array of 3 rounds
    const groupNumber = groupIndex + 1;
    groupsDiv.appendChild(createGroupResultsElement(group, groupNumber));
  });
  return groupsDiv;
}
/**
 * Returns a .event-results div element
 * @param {*} event
 * @returns {HTMLDivElement}
 */
function createEventResultsElement(event) {
  const eventResults = document.createElement("div");
  eventResults.classList.add("event-results");

  eventResults.appendChild(createGroupsResultsElement(event));
  return eventResults;
}
/**
 * Creates results for all events in a competition
 * @param {*} competition
 * @returns {HTMLDivElement}
 */
function createEventsResultsElement(competition) {
  const eventNames = Object.keys(competition);
  const eventsDiv = document.createElement("div");
  eventNames.forEach((eventName) => {
    const event = competition[eventName];
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("event");
    eventDiv.appendChild(createEventNameElement(eventName));
    eventDiv.appendChild(createEventResultsElement(event));
    eventsDiv.appendChild(eventDiv);
  });
  return eventsDiv;
}
function createCompetitionResultsElement(competition) {
  const resultsDiv = document.createElement("div");
  resultsDiv.classList.add("comp-results");
  resultsDiv.appendChild(createEventsResultsElement(competition.events));
  return resultsDiv;
}
function createCompetitionNameElement(competitionName) {
  const nameH2 = document.createElement("h2");
  nameH2.classList.add("comp-name-p");
  nameH2.textContent = competitionName;
  return nameH2;
}
function createCompetitionInfoElement(competition, competitionName) {
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("comp-info");
  infoDiv.appendChild(createCompetitionNameElement(competitionName));
  infoDiv.appendChild(createCompetitionDateElement(competition));
  return infoDiv;
}
function createCompetitionElement(competition, competitionName) {
  const competitionDiv = document.createElement("div");
  competitionDiv.classList.add("competition");
  competitionDiv.appendChild(
    createCompetitionInfoElement(competition, competitionName)
  );
  competitionDiv.appendChild(createCompetitionResultsElement(competition));
  competitionsDiv.appendChild(competitionDiv);
}
function displayResults(results) {
  console.log("Displaying results...");
  console.time("displayResults");
  const competitionNames = Object.keys(results);
  competitionNames.forEach((competitionName) => {
    const competition = results[competitionName];
    createCompetitionElement(competition, competitionName);
  });
  console.timeEnd("displayResults");
}
/**
 * Main function that gets the results from the server and displays them
 * @param {number} retry - Number of times to retry if the request fails
 */
async function main(retry = 5) {
  const results = await getResults();
  if (!results.success) {
    handleFail(retry);
    return;
  }
  displayResults(results.parsed);
}
main();
