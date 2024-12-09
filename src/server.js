require("dotenv").config()
const app = require('./app')
const http = require('http')
const {
    mongoConnect,
    mongoDisconnect,
  } = require('./config/db')

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

async function dbConnect(){
    await mongoConnect()
}

server.listen(PORT, console.log(`server is listening on port ${PORT}`))
dbConnect()



