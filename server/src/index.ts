const appName = "Server API"; 
const port = process.env.PORT || 8080;
const serverInit = require("./server");
const server = serverInit();
require("dotenv").config({ path: "./config.env" });
const dbo = require("./db/conn");
const cron = require('node-cron');
const API_URL = process.env.REACT_APP_API;

server.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function (err: Error) {
        if (err) console.error(err);
    });
    console.log(`${appName} running on port ${port}!`)
    cron.schedule('*/20 * * * *', () => { // this runs every 20 minutes to prevent heroku dyno from sleeping
        console.log('running a task every 20 minutes'); 
        fetch(`/`)
            .then(res => console.log(`response-ok: ${res.ok}, status: ${res.status}`))
            .catch(err => console.log(err))
    });
});