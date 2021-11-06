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

function query_val(filter_key: string, filter_value: string | number, variable: string, db: Db) {
  var query = {}

  // Keeping multiple if statements to add asserts later 
  if (filter_key == "GENDER") {
    query = { GENDER: filter_value }
  }
  else if (filter_key == "FLC") {
    query = { FLC: filter_value }
  }
  else if (filter_key == "REGION6") {
    query = { REGION6: filter_value }
  }
  else if (filter_key == "CURRSTAT") {
    query = { CURRSTAT: filter_value }
  }
  else {
    query = {}
  }
  db.collection('main').find(query).toArray(function (err, result) {
    if (err) throw err;
    // var result = result
    let filtered_array: any[] = []
    function iterateFunc(doc: any) {
      let lst = [doc.FY, doc[variable]]
      // filtered_array.push(lst)
      console.log(lst)
    }
    function errorFunc(error: any) {
      console.log(error);
    }
    if (result != undefined) {
      result.forEach(iterateFunc, errorFunc);
    }
    return filtered_array
    // EXAMPLE OF OUTPUT: [["2010", 2], ["2010", 2]],
  });

}


module.exports = {
  connectToServer: function (callback: Callback) {
    client.connect(function (err: MongoError, db: MC) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("naws");
        console.log("Successfully connected to MongoDB.");
        query_val("REGION6", 3, "FY", _db);
      }
      return callback(err, "Error in connecting to MongoDB");
    });
  },

  getDb: function () {
    return _db;
  },



};