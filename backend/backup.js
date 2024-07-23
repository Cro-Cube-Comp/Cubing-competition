import { config } from "dotenv";
import mongoose from "mongoose";
import { writeFile, mkdir } from "fs/promises";
import { exit } from "process";
import { join } from "path";

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
  const backupDir = "backups";

  // Create the backups directory if it doesn't exist
  await mkdir(backupDir, { recursive: true });

  for (const collectionInfo of collections) {
    const collectionName = collectionInfo.name;
    const collection = db.collection(collectionName);
    const data = JSON.stringify(await collection.find({}).toArray());

    try {
      const filePath = join(backupDir, `${collectionName}-backup.json`);
      await writeFile(filePath, data);
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
