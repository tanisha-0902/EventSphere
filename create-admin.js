const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'eventsphere';

const admin = {
  username: 'tanisha',
  password: 'tanisha123',
};

async function run() {
  const client = new MongoClient(MONGO);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const admins = db.collection('admins');

    const existing = await admins.findOne({ username: admin.username });
    if (existing) {
      console.log(`Admin user already exists: ${admin.username}`);
      console.log(existing);
    } else {
      const res = await admins.insertOne(admin);
      console.log('Inserted admin:', res.insertedId.toString());
    }
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
