import e from "express";
import { Db, MongoClient as MC, MongoError } from "mongodb";
import { Callback } from "mongoose";
import { cursorTo } from "readline";

const { MongoClient } = require("mongodb");
const ATLAS_URI = process.env.ATLAS_URI;
const client = new MongoClient(ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db: Db;

// Used to preprocess data by deleting documents before 2008
function pre_process(db: Db) {
  db.collection('naws_main').deleteMany({ FY: { $lt: "2008" } })
    .then(function () {
      console.log("processed!")
    })
}

// Used to preprocess data by deleting the NFWEEKS column
function deleteCol(db: Db) {
  db.collection('naws_main').updateMany(
    {},
    { $unset: { NFWEEKS: "" } })
    .then(function () {
      console.log("processed!")
    })
}

module.exports = {
  connectToServer: function (callback: Callback) {
    client.connect(function (err: MongoError, db: MC) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("naws");
        console.log("Successfully connected to MongoDB.");
      }
      return callback(err, "Error in connecting to MongoDB");
    });
  },

  getDb: function () {
    return _db;
  },

};