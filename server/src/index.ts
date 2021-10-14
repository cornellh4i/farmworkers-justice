const appName = "Server API"; 
const port = process.env.PORT || 8080;
const serverInit = require("./server");
const server = serverInit();
require("dotenv").config({ path: "./config.env" });
const dbo = require("./db/conn");

server.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function (err: Error) {
        if (err) console.error(err);
 
    });
    console.log(`${appName} running on port ${port}!`)
});