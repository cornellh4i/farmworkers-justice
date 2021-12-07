import Express from "express";
import { utimes } from "fs";
import { Db } from "mongodb";
import { getOutputFileNames, OutputFileType } from "typescript";

interface encodingProp {
  _id: Object;
  Variable: string;
  Encoding: number;
  Description: string
}

/**
 * Takes an array and a string variable
 * @param variable is the variable being used to filter the data. EX: GENDER, FLC, REGION6 
 * @param db is the database instance being used to filter data 
 * @param filter_key is a selected filter option. EX: GENDER, FLC, REGION6
 * @param filter_value is the selected filter value corresponding to filter_key
 * @returns a nested array where each element corresponds to each document of 
 *          the query result and is in the form [FY, value of the variable key]. 
 *          EX: [[2010, 2], [2010, 2]]
 */

async function queryVal(variable: string, db: Db, filter_key1?: string, filter_value1?: string | number) {
  var query = {}
  if (typeof filter_key1 !== 'undefined' && typeof filter_value1 !== 'undefined') {
    query = { [filter_key1]: filter_value1 }
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

async function queryTwoVals(variable: string, db: Db, filter_key1?: string, filter_value1?: string | number,
  filter_key2?: string, filter_value2?: string | number) {
  var query = {}
  if (typeof filter_key1 !== 'undefined' && typeof filter_value1 !== 'undefined'
    && typeof filter_key2 !== 'undefined' && typeof filter_value2 !== 'undefined') {
    query = { $and: [{ filter_key1: filter_value1 }, { filter_key2: filter_value2 }] }
  }
  var filtered_array: any[] = []
  var result = await db.collection('naws_main').find(query).toArray();
  console.log(result);
  function iterateFunc(doc: any) {
    let lst = [doc.FY, doc[variable]];
    filtered_array.push(lst)
  }
  function errorFunc(error: any) {
    console.log(error);
  }
  result.forEach(iterateFunc, errorFunc);
  console.log(filtered_array)
  return filtered_array
}

/**
 * Takes an array and a string variable
 * @param arr is a nested array of lists that look like: [year, value]. EX: [[2008, 0], [2009, 1]]
 * @param variable is a that is being aggregated. EX: GENDER
 * @returns an array of dictionaries where each dictionary element is formatted
 *          as {year: 2009, value: 0.54}. The value represents the percentage
 *          of how often a variable appears in that year. 
 *          An average value is returned for variables: B11, FWRDays, 
 *          and NUMFEMPL. 
 *          The dictionaries are arranged in ascending order based on year
 */
function aggregateTimeSeries(arr: [number, number][], variable: string) {
  const minYear: number = Math.min.apply(Math, arr.map(function (a) { return a[0]; }))
  const maxYear: number = Math.max.apply(Math, arr.map(function (a) { return a[0]; }))
  let output = new Array<{ year: number, value: number }>();
  let totalEachYear = new Map<number, number>();
  let i;
  for (i = 0; i < maxYear - minYear + 1; i++) {
    output[i] = { year: minYear + i, value: 0 };
    totalEachYear.set(minYear + i, 0)
  }

  function iterateFunc(v: [number, number]) {
    const yr: number = v[0];
    const value: number = v[1];
    const yrIdx: number = yr - minYear;

    if (!isNaN(value)) {
      if (variable === "B11" || variable === "FWRDays" || variable === "NUMFEMPL") {
        output[yrIdx].value += value;
        totalEachYear.set(yr, totalEachYear.get(yr)! + 1);
      }
      // Only consider Yes & No answers for the rest of the variables 
      else if (value === 1 || value === 0) {
        output[yrIdx].value += value;
        totalEachYear.set(yr, totalEachYear.get(yr)! + 1);
      }
    }
  }

  function errorFunc(error: any) {
    console.log(error);
  }

  arr.forEach(iterateFunc, errorFunc)
  output.forEach((d) => {
    d.value = d.value / totalEachYear.get(d.year)!
  })
  return output
}

const LATEST_YEAR = 2018;

/**
 * Takes an array and a string variable
 * @param arr is a nested array of lists that look like: [year, value]. EX: [[2008, 0], [2009, 1]]
 * @param variable is a that is being aggregated. EX: GENDER
 * @returns a dictionary where the keys are encoding descriptions and the values are the 
 *          percentage of times that encoding appears in the LATEST_YEAR. 
 *          EX. {"By the hour": 0.25, "By the piece": 0, "Combination hourly wage and piece rate": 0.5, "Salary or other": 0.25}
 */
function aggregateHistogram(arr: [number, number][]) {
  let recentVals: Array<number> = [];

  function iterateFunc(v: [number, number]) {
    let year = v[0]
    if (year == LATEST_YEAR) {
      recentVals.push(v[1])
    }
  }
  function errorFunc(error: any) {
    console.log(error);
  }
  arr.forEach(iterateFunc, errorFunc)
  return recentVals
}

async function aggregateDonutChart(arr: [number, number][], variable: string, db: Db) {
  // This is a list with the number of times each encoding shows up in arr. 
  // The index of the value in the list corresponds to the encoding value. 
  // let aggregate_encodings: Array<number> = [];

  let output = new Map<string, number>();
  let n = 0;

  var encodingDescrp: any;
  async function allEncoding() {
    let query = { Variable: variable }
    try {
      encodingDescrp = await db.collection('description-code').find(query).toArray()
      console.log("encoding description type: ", typeof encodingDescrp)
      console.log("encoding descrp: ", encodingDescrp)
      return encodingDescrp;
    } catch (error) {
      console.log(error);
    };
  }

  await allEncoding()
  .then( function() {
    for (let i = 0; i < arr.length; i++) {
      const value = arr[i][1];
      let description;
      if (!isNaN(value)) {
        let j = 0;
        while (typeof description == 'undefined') {
          if (encodingDescrp[j].Encoding == value) {
            description = encodingDescrp[j].Description;
          }
          j++;
        }
        if (output.has(description)) {
          output.set(description, output.get(description)! + 1)
        }
        else {
          output.set(description, 0);
        }
        n++;
      }
    }
    output.forEach((v, d) => {
      output.set(d, v/n);
    })
  });
  return output;
}

async function aggregateTable(arr: [number, number][], variable: string, db: Db) {
  let sum = new Map<string, number>();
  let output = new Map<string, [number, number]>();
  let n = 0;

  var encodingDescrp: any;
  async function allEncoding() {
    let query = { Variable: variable }
    try {
      encodingDescrp = await db.collection('description-code').find(query).toArray()
      return encodingDescrp;
    } catch (error) {
      console.log(error);
    };
  }

  await allEncoding()
  .then( function() {
    for (let i = 0; i < arr.length; i++) {
      const value = arr[i][1];
      let description;
      if (!isNaN(value)) {
        let j = 0;
        while (typeof description == 'undefined') {
          if (encodingDescrp[j].Encoding == value) {
            description = encodingDescrp[j].Description;
          }
          j++;
        }
        if (sum.has(description)) {
          sum.set(description, sum.get(description)! + 1)
        }
        else {
          sum.set(description, 0);
        }
        n++;
      }
    }
    sum.forEach((v, d) => {
      output.set(d, [v/n, v]);
    })
  });
  return output;

}

module.exports = () => {
  const express = require("express");
  const router = express.Router();

  /**** Routes ****/
  router.get('/hello', async (req: Express.Request, res: Express.Response) => {
    res.json({msg: "Hello, world!"});
  });

  router.get('/filterTwo/:variable/:filterKey1/:filterVal1/:filterKey2/:filterVal2', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    const queryResult = await queryTwoVals(req.params.variable, dbo.getDb(),
      req.params.filterKey1, req.params.filterVal1, req.params.filterKey2, req.params.filterVal2);
    // console.log("query result: ", queryResult);
    const output = await aggregateTimeSeries(queryResult, req.params.variable);
    // console.log("aggregated result: ", Object.fromEntries(output));
    // res.json({ msg: Object.fromEntries(output) });
    console.log("aggregated result: ", output);
    res.json({ msg: output });
  });

  router.get('/timeSeries/:variable', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    const queryResult = await queryVal(req.params.variable, dbo.getDb())
    // console.log("query result: ", queryResult);
    const output = await aggregateTimeSeries(queryResult, req.params.variable);
    console.log("timeseries aggregated result: ", output);
    res.json({ msg: output });
  });

  router.get('/timeSeries/:variable/:filterKey/:filterVal', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    const queryResult = await queryVal(req.params.variable, dbo.getDb(), req.params.filterKey, req.params.filterVal);
    // console.log("query result: ", queryResult);
    const output = await aggregateTimeSeries(queryResult, req.params.variable);
    console.log("timeseries aggregated result: ", output);
    res.json({ msg: output });
  });

  router.get('/histogram/:variable', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    const queryResult = await queryVal(req.params.variable, dbo.getDb())
    // console.log("query result: ", queryResult);
    const output = await aggregateHistogram(queryResult);
    console.log("histogram aggregated result: ", output);
    res.json({ msg: output });
  });

  router.get('/donut/:variable', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    const queryResult = await queryVal(req.params.variable, dbo.getDb(), "FY", LATEST_YEAR)
    // console.log("query result: ", queryResult);
    const output = await aggregateDonutChart(queryResult, req.params.variable, dbo.getDb());
    console.log("donut aggregated result: ", output);
    res.json({ msg: Object.fromEntries(output) });
  });

  router.get('/table/:variable', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    const queryResult = await queryVal(req.params.variable, dbo.getDb(), "FY", LATEST_YEAR)
    // console.log("query result: ", queryResult);
    const output = await aggregateTable(queryResult, req.params.variable, dbo.getDb());
    console.log("table aggregated result: ", output);
    res.json({ msg: Object.fromEntries(output) });
  });
  return router;
}
