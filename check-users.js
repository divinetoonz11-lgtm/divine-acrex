const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.log("❌ MONGODB_URI not found in env");
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(); // default DB
  const users = await db.collection("users").find(
    {},
    { projection: { email: 1, phone: 1, role: 1, _id: 0 } }
  ).toArray();

  console.log("TOTAL USERS:", users.length);
  console.table(users);

  await client.close();
}

run().catch(console.error);
