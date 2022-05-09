import Express from "express";
/**** Node.js libraries *****/
const path = require('path');

/**** External libraries ****/
const express = require('express'); 
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

/**** Configuration ****/
const app = express(); 
app.use(bodyParser({limit: '50mb'}));

function createServer() {
  const routes = require("./routes")();

  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan('combined')); 
  app.use(cors());
  app.use(express.static(path.resolve('..', 'client', 'build'))); 
  
  /**** Add routes ****/
  app.use("/api", routes);

  // "Redirect" all non-API GET requests to React's entry point (index.html)
  app.get('*', (req: Express.Request, res: Express.Response) =>
    res.sendFile(path.resolve('../..', 'client', 'build', 'index.html'))
  );
  
  return app;
}

module.exports = createServer;
