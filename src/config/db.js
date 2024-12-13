const mongoose = require('mongoose');
require('dotenv').config();
const { checkAndCompleteEqubs } = require('../services/scheduler')

const MONGO_URL = process.env.MONGO_URL 

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});
async function mongoConnect() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB successfully!');
  await checkAndCompleteEqubs();

}

async function mongoDisconnect() {
  console.log('Disconnecting from MongoDB...');
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB!');
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
