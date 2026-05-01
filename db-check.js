const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'eventsphere';

async function checkDb() {
  const client = new MongoClient(MONGO);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    
    const collections = await db.listCollections().toArray();
    console.log('📦 Collections found:');
    for (const c of collections) {
      const count = await db.collection(c.name).countDocuments();
      console.log(` - ${c.name}: ${count} document(s)`);
    }
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  } finally {
    await client.close();
  }
}

checkDb();
