import mongoose from "mongoose";
import { config } from "dotenv";
import { writeFile } from "fs/promises";
const { getUsernameById } = require("./functions/getUsernameById");
config();
// Connect to the MongoDB database using mongoose
try {
  console.log("Connecting to mongodb...");
  console.time("Connect to mongodb");
  await mongoose.connect(process.env.MONGO_URI);
  console.timeEnd("Connect to mongodb");
} catch (error) {
  console.error("Database connection failed:", error.message);
  process.exitCode = 1; // Exit with failure status while still letting console output
}
const db = mongoose.connection;
// This function sorts users by their average for the given round and returns their ids in ranking order
function getWinnersFromRound(users, competitionId, eventName, roundIndex) {
  // Initialize an array to store users with their average
  let usersWithAverages = [];

  users.forEach((user) => {
    // Find the specific competition for this user
    const competition = user.competitions.find((comp) =>
      comp.competitionId.equals(competitionId)
    );
    if (!competition) return; // If competition is not found, skip this user

    // Find the specific event within this competition
    const event = competition.events.find((e) => e.event === eventName);
    if (!event) return; // If event is not found, skip this user

    // Get the solves for the current round
    const solves = event.rounds[roundIndex];
    if (!solves) return; // If no solves for this round, skip this user

    // Calculate the average using the getAverageNoFormat function
    const average = getAverageNoFormat(solves);
    if (average === -1 || average === 0) return; // Skip users with invalid averages

    // Push the user with their average to the array
    usersWithAverages.push({
      userId: user._id,
      average: average,
    });
  });

  // Sort users by average in ascending order (lower average is better)
  usersWithAverages.sort((a, b) => a.average - b.average);

  // Extract userIds in the sorted order
  return usersWithAverages.map((user) => user.userId);
}

async function getWinners(competitions, users) {
  console.time("Get winners for all competitions");
  const results = {};
  for (const competition of competitions) {
    const competitionId = competition._id;
    const competitionName = competition.name;
    // Initialize competition result
    results[competitionName] = {};
    for (const event of competition.events) {
      // Initialize event result
      results[competitionName][event.name] = [];

      for (let i = 0; i < event.rounds; i++) {
        // Get winner for each round
        const winners = getWinnersFromRound(
          users,
          competition._id,
          event.name,
          i
        );

        // Append the winners of the round to the event results
        results[competitionName][event.name].push(winners);
      }
    }
  }

  // Convert the results to JSON format
  const jsonResults = JSON.stringify(results, null, 2);

  // Write the JSON results to a file
  await writeFile("competition_results.json", jsonResults);
  console.timeEnd("Get winners for all competitions");
}

// Get competitions from "competitions" collection
const competitions = await db.collection("competitions").find().toArray();
const users = await db.collection("users").find().toArray();
const result = await getWinners(competitions, users);
process.exit(0);
function getAverageNoFormat(solves) {
  if (solves.length !== 5) {
    return -1;
  }

  // Create a copy of the solves array
  let sortedSolves = solves.slice();

  sortedSolves.sort((a, b) => {
    if (a === 0) return 1; // Place 0 at the last element
    if (b === 0) return -1; // Place 0 at the last element
    return a - b; // Regular sorting for other numbers
  });
  // Remove the smallest and largest elements
  let trimmedSolves = sortedSolves.slice(1, sortedSolves.length - 1);

  // Calculate average
  let average =
    trimmedSolves.reduce((acc, val) => acc + val, 0) / trimmedSolves.length;

  // Check if trimmedSolves contains DNF
  if (trimmedSolves.includes(0)) {
    return 0;
  }

  // Return average rounded to 2 decimal places
  return average.toFixed(2);
}
