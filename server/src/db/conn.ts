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
async function query_val(filter_key: string, filter_value: string | number, variable: string, db: Db) {
  var query = {}
  query = { [filter_key]: filter_value }
  var filtered_array: any[] = []
  var result = await db.collection('main').find(query).toArray();
  function iterateFunc(doc: any) {
    let lst = [doc.FY, doc[variable]];
    filtered_array.push(lst)
  }
  function errorFunc(error: any) {
    console.log(error);
  }
  result.forEach(iterateFunc, errorFunc);
  return filtered_array
}

function aggregate_data(arr: [string, number][], filter_value: number) {
  let a_dict = new Map<string, number>();
  let total_each_year = new Map<string, number>();
  // Initializing map to have all 0s
  function get_fy(v: [string, number]) {
    let yr: string
    yr = v[0]
    a_dict.set(yr, 0)
    total_each_year.set(yr, 0)
  }

  arr.forEach(get_fy, errorFunc)

  function iterateFunc(v: [string, number]) {
    let yr: string
    yr = v[0]
    if (v[1] === filter_value && a_dict.get(yr) != undefined) {
      a_dict.set(yr, a_dict.get(yr)! + 1)
    }
    if (total_each_year.get(yr) != undefined) {
      total_each_year.set(yr, total_each_year.get(yr)! + 1)
    }
  }
  function errorFunc(error: any) {
    console.log(error);
  }
  arr.forEach(iterateFunc, errorFunc)
  a_dict.forEach((data, yr) => a_dict.set(yr, data / total_each_year.get(yr)!))
  return a_dict
}

module.exports = {
  connectToServer: function (callback: Callback) {
    client.connect(function (err: MongoError, db: MC) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("naws");
        console.log("Successfully connected to MongoDB.");
        // SAMPLE QUERY: need .then since it is an ASYNC function
        query_val("GENDER", 0, "REGION6", _db).then(data => {
          console.log(aggregate_data(data, 1))
        });
      }
      return callback(err, "Error in connecting to MongoDB");
    });
  },

  getDb: function () {
    return _db;
  },



};