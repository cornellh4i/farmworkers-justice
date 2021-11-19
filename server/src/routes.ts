import Express from "express";
import { Db } from "mongodb";

// EXAMPLE OF OUTPUT: [["2010", 2], ["2010", 2]],
async function query_val(variable: string, db: Db, filter_key?: string, filter_value?: string | number) {
  var query = {}
  if (typeof filter_key !== 'undefined' && typeof filter_value !== 'undefined') {
    query = { [filter_key]: filter_value }
  }
  var filtered_array: any[] = []
  var result = await db.collection('naws_main').find(query).toArray();
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

function aggregate_time_series_data(arr: [string, number][], variable: string) {
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


    if (a_dict.get(yr) != undefined && v[1] != NaN) {
      if (variable === "B11" || variable === "FWRDays" || variable === "NUMFEMPL") {
        a_dict.set(yr, a_dict.get(yr)! + v[1])
        total_each_year.set(yr, total_each_year.get(yr)! + 1)
      }
      else if (v[1] === 1 || v[1] === 0) {
        a_dict.set(yr, a_dict.get(yr)! + v[1])
        total_each_year.set(yr, total_each_year.get(yr)! + 1)
      }
    }
  }
  function errorFunc(error: any) {
    console.log(error);
  }
  arr.forEach(iterateFunc, errorFunc)
  a_dict.forEach((data, yr) => a_dict.set(yr, data / total_each_year.get(yr)!))
  return a_dict
}

const RECENT_YEAR = "2018";

function aggregate_histogram_data(arr: [string, number][]) {
  let recent_vals: Array<number> = [];

  function iterateFunc(v: [string, number]) {
    let year = v[0]
    if (year == RECENT_YEAR) {
      recent_vals.push(v[1])
    }
  }

  function errorFunc(error: any) {
    console.log(error);
  }

  arr.forEach(iterateFunc, errorFunc)
  return recent_vals
}


module.exports = () => {
  const express = require("express");
  const router = express.Router();

  /**** Routes ****/
  router.get('/hello', async (req: Express.Request, res: Express.Response) => {
    res.json({ msg: "Hello, world!" });
  });

  router.get('/hello/:name', async (req: Express.Request, res: Express.Response) => {
    res.json({ msg: `Hello, ${req.params.name}` });
  });

  router.get('/timeSeries/:variable', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    const query_result = await query_val(req.params.variable, dbo.getDb())
    console.log("query result: ", query_result);
    const output = await aggregate_time_series_data(query_result, req.params.variable);
    console.log("aggregated result: ", Object.fromEntries(output));
    res.json({ msg: Object.fromEntries(output) });
  });

  router.get('/timeSeries/:variable/:filterKey/:filterVal', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    const query_result = await query_val(req.params.variable, dbo.getDb(), req.params.filterKey, req.params.filterVal);
    console.log("query result: ", query_result);
    const output = await aggregate_time_series_data(query_result, req.params.variable);
    console.log("aggregated result: ", Object.fromEntries(output));
    res.json({ msg: Object.fromEntries(output) });
  });

  router.get('/histogram/:variable', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    const query_result = await query_val(req.params.variable, dbo.getDb())
    console.log("query result: ", query_result);
    const output = await aggregate_histogram_data(query_result);
    console.log("aggregated result: ", output);
    res.json({ msg: output });
  });

  return router;
}
