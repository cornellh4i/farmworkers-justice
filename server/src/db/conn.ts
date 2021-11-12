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

function pre_process(db: Db) {

  db.collection('main').deleteMany({ FY: { $lt: "2008" } })
    .then(function () {
      console.log("processed!")
    })
}

// EXAMPLE OF OUTPUT: [["2010", 2], ["2010", 2]],
function query_val(filter_key: string, filter_value: string | number, variable: string, db: Db) {
  var query = {}
  query = { [filter_key]: filter_value }

  db.collection('main').find(query).toArray(function (err, result) {
    if (err) throw err;
    let filtered_array: any[] = []
    function iterateFunc(doc: any) {
      let lst = [doc.FY, doc[variable]];
      filtered_array.push(lst)
    }
    function errorFunc(error: any) {
      console.log(error);
    }
    if (result != undefined) {
      result.forEach(iterateFunc, errorFunc);
    }
    filtered_array.forEach(iterateFunc, errorFunc)
    // console.log(filtered_array)
    return filtered_array

  });
}

// CODE FOR AGGREGATING: INCOMPLETE
// let x: [string, number]
// let final_result: Array<typeof x> = [filtered_array[0][0], 0];
// for (let [FY, val] of filtered_array) {
//   if (final_result.find(elem => elem[0] == FY)) {
//     let felem[1] =
//   }
// }

module.exports = {
  connectToServer: function (callback: Callback) {
    client.connect(function (err: MongoError, db: MC) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("naws");
        console.log("Successfully connected to MongoDB.");
        // SAMPLE QUERY 
        query_val("GENDER", 0, "REGION6", _db);
      }
      return callback(err, "Error in connecting to MongoDB");
    });
  },

  getDb: function () {
    return _db;
  },



};