import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Check each collection for data
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`${collection.name}: ${count} documents`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabase(); 