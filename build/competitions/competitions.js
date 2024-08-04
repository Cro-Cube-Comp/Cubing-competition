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
function createEventNameElement(eventName) {
  const nameH3 = document.createElement("h3");
  nameH3.classList.add("event-name");
  nameH3.textContent = eventName;
  return nameH3;
}
function createEmptyRoundResultsElement(roundNumber) {
  return document.createElement("div");
}
function seperateResultsByGroup(round) {
  const groups = [[], []];
  round.forEach((result) => {
    groups[result.group - 1].push(result);
  });
  return groups;
}
function createRoundResultsElement(round, roundNumber) {
  if (round.length === 0) {
    return createEmptyRoundResultsElement(roundNumber);
  }
  const roundElement = document.createElement("div");
  roundElement.classList.add("round");
  roundElement.id = `round-${roundNumber}`;
  const roundTitleContainerElement = document.createElement("div");
  roundTitleContainerElement.classList.add("round-title-container");

  const roundTitleElement = document.createElement("h4");
  roundTitleElement.classList.add("round-title");
  roundTitleElement.textContent = `Runda ${roundNumber}`;
  const showHideButton = document.createElement("button");
  showHideButton.classList.add("show-hide-round-button");
  const showHideImage = document.createElement("img");
  showHideImage.src = "../Images/show.svg";
  showHideButton.appendChild(showHideImage);
  roundTitleContainerElement.appendChild(roundTitleElement);
  roundTitleContainerElement.appendChild(showHideButton);
  roundElement.appendChild(roundTitleContainerElement);
  const groups = seperateResultsByGroup(round);
  const roundResultsElement = document.createElement("div");
  showHideButton.addEventListener("click", (e) => {
    roundResultsElement.classList.toggle("hidden");
    showHideButton.classList.toggle("hidden");
    // Update the image
    if (roundResultsElement.classList.contains("hidden")) {
      showHideButton.querySelector("img").src = "../Images/show.svg";
      return;
    }
    showHideButton.querySelector("img").src = "../Images/hide.svg";
  });
  roundElement.appendChild(roundResultsElement);
  roundResultsElement.classList.add("round-results");
  roundResultsElement.id = `round-results-${roundNumber}`;
  groups.forEach((group, index) => {
    if (group.length === 0) {
      // TODO: handle empty groups
      return;
    }
    const groupDiv = document.createElement("div");
    groupDiv.classList.add("group");
    groupDiv.id = `group-${index + 1}`;
    // Create container for the group title
    const groupTitleContainerElement = document.createElement("div");
    groupTitleContainerElement.classList.add("group-title-container");
    // Create the group title
    const groupTitleElement = document.createElement("h4");
    groupTitleElement.classList.add("group-title");
    groupTitleElement.textContent = `Grupa ${index + 1}`;
    // Append the group title to the container
    groupTitleContainerElement.appendChild(groupTitleElement);
    // Append show/hide button to the container
    const showHideButton = document.createElement("button");
    showHideButton.classList.add("show-hide-group-button");
    showHideButton.classList.add("hidden");
    const hideImage = document.createElement("img");
    hideImage.src = "../Images/hide.svg";
    showHideButton.appendChild(hideImage);
    groupTitleContainerElement.appendChild(showHideButton);
    // Append the container to the group element
    groupDiv.appendChild(groupTitleContainerElement);
    const groupResultsElement = document.createElement("div");
    groupResultsElement.classList.add("hidden");
    showHideButton.addEventListener("click", (e) => {
      groupResultsElement.classList.toggle("hidden");
      showHideButton.classList.toggle("hidden");
      // Update the image
      if (groupResultsElement.classList.contains("hidden")) {
        showHideButton.querySelector("img").src = "../Images/hide.svg";
      } else {
        showHideButton.querySelector("img").src = "../Images/show.svg";
      }
    });
    groupResultsElement.classList.add("group-results");
    groupResultsElement.id = `group-results-${index + 1}`;
    groupDiv.appendChild(groupResultsElement);
    group.forEach((result, index) => {
      const resultP = document.createElement("p");
      resultP.classList.add("event-result");
      resultP.textContent = `${index + 1}. ${result.username}: ${result.solves
        .map((solve) => formatTime(solve))
        .join(", ")} (Prosjek: ${formatTime(result.average)})`;
      groupResultsElement.appendChild(resultP);
    });
    roundResultsElement.appendChild(groupDiv);
  });

  return roundElement;
}
function createEventResultsElement(event) {
  const eventResults = document.createElement("div");
  eventResults.classList.add("event-results");
  event.forEach((round, index) => {
    const roundNumber = index + 1;
    eventResults.appendChild(createRoundResultsElement(round, roundNumber));
  });
  return eventResults;
}
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
function createCompetitionElement(competition, competitionName) {
  const competitionDiv = document.createElement("div");
  competitionDiv.classList.add("competition");
  competitionDiv.appendChild(createCompetitionNameElement(competitionName));
  competitionDiv.appendChild(createCompetitionDateElement(competition));
  competitionDiv.appendChild(createCompetitionResultsElement(competition));
  competitionsDiv.appendChild(competitionDiv);
}
function displayResults(results) {
  console.log("Displaying results...");
  const competitionNames = Object.keys(results);
  competitionNames.forEach((competitionName) => {
    const competition = results[competitionName];
    createCompetitionElement(competition, competitionName);
  });
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
