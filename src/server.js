require("dotenv").config();
const app = require('./app');
const http = require('http');

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
    dbConnect();
    console.log(`Server is listening on port ${PORT}`);
    
});
