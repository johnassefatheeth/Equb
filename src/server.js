require("dotenv").config();
const app = require('./app');
const http = require('http');
// Enable CORS for all sources

const {
    mongoConnect,
    mongoDisconnect,
} = require('./config/db');
require('./services/scheduler');

const PORT = process.env.PORT || 5000;


const server = http.createServer(app);

async function dbConnect() {
    await mongoConnect();
}

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    dbConnect();
});
