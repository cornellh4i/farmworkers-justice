import Express from "express";

module.exports = () => {
  const express = require("express");
  const router = express.Router();

  /**** Routes ****/
  router.get('/hello', async (req: Express.Request, res: Express.Response) => {
    res.json({msg: "Hello, world!"});
  });

  router.get('/hello/:name', async (req: Express.Request, res: Express.Response) => {
    res.json({msg: `Hello, ${req.params.name}`});
  });

  return router;
}
