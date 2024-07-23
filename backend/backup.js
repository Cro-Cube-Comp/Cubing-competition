import { config } from "dotenv";
import mongoose from "mongoose";
import { writeFile } from "fs/promises";
import { exit } from "process";

config();

console.log(`Running ${import.meta.file}`);
try {
  console.time("Connect to mongodb");
  await mongoose.connect(process.env.MONGO_URI);
  console.timeEnd("Connect to mongodb");
} catch (error) {
  console.error("Failed to connect to MongoDB: \n" + error);
  process.exit(1);
}
console.log("Connected to mongodb");
console.time("Backup");
await main();
console.timeEnd("Backup");
console.log("DONE...");
exit();

async function main() {
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  console.log("Connected to the database.");

  const collections = await db.db.listCollections().toArray();

  for (const collectionInfo of collections) {
    const collectionName = collectionInfo.name;
    const collection = db.collection(collectionName);
    const data = JSON.stringify(await collection.find({}).toArray()); // minified json

    try {
      await writeFile(`${collectionName}-backup.json`, data);
      console.log(
        `Backup of the '${collectionName}' collection saved successfully.`
      );
    } catch (err) {
      console.error(
        `Error writing to file for collection '${collectionName}':`,
        err
      );
    }
  }
}
