import mongoose from "mongoose";

const MONGO_URI = "your_mongodb_connection_string";

async function fixIndex() {
  try {
    await mongoose.connect(MONGO_URI);

    const db = mongoose.connection.db;

    // 🔴 Drop old index
    try {
      await db.collection("users").dropIndex("pan_1");
      console.log("Old index dropped");
    } catch (err) {
      console.log("No old index found");
    }

    // ✅ Create new partial index
    await db.collection("users").createIndex(
      { pan: 1 },
      {
        unique: true,
        partialFilterExpression: { pan: { $exists: true, $ne: null } },
      },
    );

    console.log("New index created ✅");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixIndex();
