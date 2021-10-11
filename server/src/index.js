const appName = "Server API"; 
const port = process.env.PORT || 8080;
const createServer = require("./server");
const server = createServer();
require("dotenv").config({ path: "./config.env" });
const dbo = require("./db/conn");

server.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function (err) {
        if (err) console.error(err);
 
    });
    console.log(`${appName} running on port ${port}!`)
});