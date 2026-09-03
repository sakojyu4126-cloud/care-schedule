import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";

const configPath = path.join(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const app = initializeApp(firebaseConfig);
const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

async function run() {
  console.log("Testing Firestore connection to:", firebaseConfig.projectId, "dbId:", firebaseConfig.firestoreDatabaseId);

  const dataStorePath = path.join(process.cwd(), "data_store.json");
  if (!fs.existsSync(dataStorePath)) {
    console.log("No data_store.json found.");
    return;
  }

  const localData = JSON.parse(fs.readFileSync(dataStorePath, "utf-8"));
  console.log("Local data loaded. Clients:", localData.clients?.length, "Reports:", localData.reports?.length);

  const now = Date.now();

  // 1. Settings
  if (localData.settings) {
    await setDoc(doc(db, "care_system", "settings"), {
      data: localData.settings,
      updatedAt: localData.updatedAt || now
    });
    console.log("Saved care_system/settings to Firestore");
  }

  // 2. Clients
  if (Array.isArray(localData.clients) && localData.clients.length > 0) {
    await setDoc(doc(db, "care_system", "clients"), {
      list: localData.clients,
      updatedAt: localData.updatedAt || now
    });
    console.log("Saved care_system/clients to Firestore");
  }

  // 3. Reports
  if (Array.isArray(localData.reports)) {
    await setDoc(doc(db, "care_system", "reports"), {
      list: localData.reports,
      updatedAt: localData.updatedAt || now
    });
    console.log("Saved care_system/reports to Firestore");
  }

  // 4. Free Stickers
  if (Array.isArray(localData.freeStickers)) {
    await setDoc(doc(db, "care_system", "freeStickers"), {
      list: localData.freeStickers,
      updatedAt: localData.updatedAt || now
    });
    console.log("Saved care_system/freeStickers to Firestore");
  }

  // 5. Metadata
  await setDoc(doc(db, "care_system", "metadata"), {
    updatedAt: localData.updatedAt || now,
    lastUpdatedBy: "initial_migration",
    version: "2.4"
  });
  console.log("Saved care_system/metadata to Firestore");

  // 6. Activities by date
  if (Array.isArray(localData.activities) && localData.activities.length > 0) {
    const dateMap = new Map<string, any[]>();
    for (const act of localData.activities) {
      if (!act.date) continue;
      if (!dateMap.has(act.date)) {
        dateMap.set(act.date, []);
      }
      dateMap.get(act.date)!.push(act);
    }
    console.log(`Migrating ${dateMap.size} dates of activities to care_activities...`);
    let count = 0;
    for (const [dateStr, acts] of dateMap.entries()) {
      await setDoc(doc(db, "care_activities", dateStr), {
        date: dateStr,
        list: acts,
        updatedAt: now
      });
      count++;
      if (count % 20 === 0 || count === dateMap.size) {
        console.log(`Migrated ${count}/${dateMap.size} dates...`);
      }
    }
  }

  console.log("Verifying read from Firestore...");
  const snap = await getDoc(doc(db, "care_system", "settings"));
  if (snap.exists()) {
    console.log("Read verification success! Settings data found:", !!snap.data()?.data);
  } else {
    console.error("Read verification failed!");
  }

  console.log("MIGRATION_COMPLETED_SUCCESSFULLY");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
