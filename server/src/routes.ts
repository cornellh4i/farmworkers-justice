import Express from "express";
import { Db } from "mongodb";
import { find } from "tslint/lib/utils";

interface encodingProp {
  _id: Object;
  Variable: string;
  Encoding: number;
  Description: string
}

enum VizType {
  Donut = "donut",
  Histogram = "histogram",
  Table = "table",
  Data = 'data'
}

const timeSeriesEncodings = require('./local-json/timeSeriesEncodings.json')

interface timeSeriesRangesProp {
  encoding: number,
  start: null | number, 
  end: null | number
}

interface timeSeriesEncodingsProp {
  "variable-encoding": string, 
  "variable-description": string, 
  "ranges": timeSeriesRangesProp[]
}

/**
 * Takes an array and a string variable
 * @param variable is the variable being used to filter the data. EX: GENDER, FLC, REGION6 
 * @param db is the database instance being used to filter data 
 * @param filter_key1, @param filter_key2, @param filter_key3 are selected filter option. EX: GENDER, FLC, REGION6
 * @param filter_value1, @param filter_value2, @param filter_value3 are the selected filter value corresponding to filter_key
 * @returns a nested array where each element corresponds to each document of 
 *          the query result and is in the form [FY, value of the variable key]. 
 *          EX: [[2010, 2], [2010, 2]]
 */
async function queryVal(variable: string, db: Db, filter_key1?: string, filter_value1?: number, filter_key2?: string, filter_value2?: number, filter_key3?: string, filter_value3?: number) {
  var query = {}
  if (typeof filter_key3 !== 'undefined' && typeof filter_key2 !== 'undefined' && typeof filter_key1 !== 'undefined') {
    query = { $and: [{ [filter_key1]: filter_value1 }, { [filter_key2]: filter_value2 }, { [filter_key3]: filter_value3 }] }
  }
  else if ( typeof filter_key2 !== 'undefined' && typeof filter_key1 !== 'undefined') {
    query = { $and: [{ [filter_key1]: filter_value1 }, { [filter_key2]: filter_value2 }] }
  }
  else if (typeof filter_key1 !== 'undefined') {
    query = { [filter_key1]: filter_value1 }
  }
  else {
    query = {}
  }
  var filtered_array: Array<[number, number]> = []
  // TODO: USE PROJECTION
  var result = await db.collection('naws_main').find(query).toArray();
  function iterateFunc(doc: any) {
    let lst : [number, number] = [doc.FY, doc[variable]];
    filtered_array.push(lst)
  }
  function errorFunc(error: any) {
    console.log(error);
  }
  result.forEach(iterateFunc, errorFunc);
  return filtered_array
}


/**
 * Takes an array and a string variable
 * @param arr is a nested array of lists that look like: [year, value]. EX: [[2008, 0], [2009, 1]]
 * @param variable is the variable that is being aggregated. EX: GENDER
 * @returns an array of dictionaries where each dictionary element is formatted
 *          as {year: 2009, value: 0.54}. The value represents the percentage
 *          of how often a variable appears in that year. 
 *          An average value is returned for variables: B11, G01, G03, FWRDays, 
 *          and NUMFEMPL. 
 *          The dictionaries are arranged in ascending order based on year
 */
function aggregateTimeSeries(arr: [number, number][], variable: string) {
  const minYear: number = Math.min(...arr.map(function (a) { return a[0]; }))
  const maxYear: number = Math.max(...arr.map(function (a) { return a[0]; }))
  let output = new Array<{ year: number, value: number }>();
  let totalEachYear = new Map<number, number>();
  let i;
  for (i = 0; i < maxYear - minYear + 1; i++) {
    output[i] = { year: minYear + i, value: 0 };
    totalEachYear.set(minYear + i, 0)
  }

  if (variable === "B11" || variable === "FWRDays" || variable === "NUMFEMPL") {
    arr.forEach((v) => {
      const yr: number = v[0];
      const value: number = v[1];
      const yrIdx: number = yr - minYear;
      if (!isNaN(value)) {
        output[yrIdx].value += value;
        totalEachYear.set(yr, totalEachYear.get(yr)! + 1);
      }
    })
  } else if (variable === "G01" || variable === "G03") {
    arr.forEach((v) => {
      const yr: number = v[0];
      const value: number = v[1];
      const yrIdx: number = yr - minYear;
      const ranges = timeSeriesEncodings.find((e: timeSeriesEncodingsProp) =>
        e["variable-encoding"] === variable);
      
      if (!isNaN(value)) {
        let range = ranges.ranges.find((e: timeSeriesRangesProp) =>
            e["encoding"] === value );
        if (value !== 0 && typeof(range) !== 'undefined') { // Responses with encoding 0, 97 are excluded
          let midValue = (range.start + range.end + 1) / 2
          output[yrIdx].value += midValue;
          totalEachYear.set(yr, totalEachYear.get(yr)! + 1);
        }
      }
    }) 
  } else {
    arr.forEach((v) => {
      const yr: number = v[0];
      const value: number = v[1];
      const yrIdx: number = yr - minYear;
      if (!isNaN(value)) {
        if (value === 1 || value === 0) { // Only consider Yes & No answers for the rest of the variables 
          output[yrIdx].value += value;
          totalEachYear.set(yr, totalEachYear.get(yr)! + 1);
        }
      }
    })
  }

  output.forEach((d) => {
    d.value = Math.round(d.value / totalEachYear.get(d.year)! * 100) / 100
  })
  return output
}

const LATEST_YEAR = 2018;


/**
 * Takes an array and a string variable
 * @param arr is a nested array of lists that look like: [year, value]. EX: [[2008, 0], [2009, 1]]
 * @param variable is the variable that is being aggregated. EX: GENDER
 * @returns an array of all values from the LATEST_YEAR
 */
function aggregateHistogram(arr: [number, number][]) {
  let recentVals: Array<number> = [];

  function iterateFunc(v: [number, number]) {
    recentVals.push(v[1])
  }
  function errorFunc(error: any) {
    console.log(error);
  }
  arr.forEach(iterateFunc, errorFunc)
  return recentVals
}


/**
 * Takes an array and a string variable
 * @param arr is a nested array of lists that look like: [year, value]. EX: [[2008, 0], [2009, 1]]
 * @param variable is the variable that is being aggregated. EX: GENDER
 * @returns a dictionary where the keys are encoding descriptions and the values are the 
 *          percentage of times that encoding appears in the LATEST_YEAR. 
 *          EX. {"By the hour": 0.25, "By the piece": 0, "Combination hourly wage and piece rate": 0.5, "Salary or other": 0.25}
 */
async function aggregateDonutChart(arr: [number, number][], variable: string, db: Db) {
  let output = new Map<string, number>();
  let n = 0;

  var encodingDescrp: any;
  // TODO: FACTORIZE INTO A FUNCTION OUTSIDE 
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
        try {
          while (typeof description == 'undefined') {
            if (encodingDescrp[j].Encoding == value) {
              description = encodingDescrp[j].Description;
            }
            j++;
          }
        } catch(e) {
          console.log(e);
        }
        if (output.has(description)) {
          output.set(description, output.get(description)! + 1)
        }
        else {
          output.set(description, 1);
        }
        n++;
      }
    }
    output.forEach((v, d) => {
      output.set(d, Math.round(v/n * 100) / 100);
    })
  });
  return output;
}

/**
 * Takes an array and a string variable
 * @param arr is a nested array of lists that look like: [year, value]. EX: [[2008, 0], [2009, 1]]
 * @param variable is the variable that is being aggregated. EX: GENDER
 * @returns a dictionary where the keys are encoding descriptions and the values 
 *          are arrays of two values. The first value is the proportion 
 *          percentage of the surveys that answered accordingly, and the second 
 *          value is the number of count for that response.
 *          EX. {"Mexican/American": [0.11, 110], "Mexican": [0.65, 650], "Chicano": [0.10, 100], "Other Hispanic": [0.04: 40], "Puerto Rican": [0.08, 80], "Not Hispanic or Latino": [0.02, 20]}
 */
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
          sum.set(description, 1);
        }
        n++;
      }
    }
    sum.forEach((v, d) => {
      output.set(d, [Math.round(v/n * 100) / 100, v]);
    })
  });
  return output;

}


/**
 * @param arr is a nested array of lists that look like: [year, value]. EX: [[LATEST_YEAR, 0], [LATEST_YEAR, 1]]
 * @param variable is the variable that is being aggregated. EX: GENDER
 * @returns an object with attributes percentage and description. 
 *          The percentage represents the proprotion of respondents answering the chosen option. 
 *          The description is the binary data option to display
 */
 async function getDataHighlights(arr: [number, number][], variable: string, db: Db) {
  let query = { Variable: variable }
  let displayCount = 0
  let totalCount = 0
  const binaryData = await db.collection('binary-data').findOne(query)
  arr.forEach(([year, value]) => {
    if (!isNaN(value)) {
      if (value === binaryData!.DisplayEncoding) {
        displayCount++
      }
      totalCount++
    }
  });
  return {description: binaryData!.DisplayDescription, percentage: Math.round(displayCount/totalCount * 100)}
}


/**
 * Takes a string variable
 * @param variable is a variable that is being queried. EX: GENDER
 * @returns an array of two elements. The first element is the visualization 
 *          type and the second element indicates whether the variable generates 
 *          a time series visualization as well. *          
 */
async function getVizType(variable: string, db: Db) {
  let query = { Variable: variable }
  const variableInfo = await db.collection('variable-info').findOne(query)
  if (variableInfo !== null) {
    return [variableInfo["Visualization Type"], variableInfo["Time Series"]]
  } else {
    throw "Variable not found in variable-info collection: ", variable
  }
}

/**
 * @param variable is a variable to generate queries for
 * @param vizType is the visualization type of the variable
 * @param filterKey1 is the first filter being applied on the variable
 * @param filterValue1 is the filter value corresponding to filterKey1
 * @param filterKey2 is the first filter being applied on the variable
 * @param filterValue2 is the filter value corresponding to filterKey2
 * @returns the aggregated data of the variable in the format that is 
 *          usable by timeseries visualization component
 */
async function timeSeriesMain(variable: string, db: Db, filterKey1?: string, filterValue1?: string, filterKey2?: string, filterValue2?: string) {
  var queryResult;
  // TODO: ALLOW FILTERVAL PARSE IN AS DESCRIPTION STRING - NEED TO SEARCH FOR ENCODING
  if (typeof filterKey2 !== 'undefined'){
    queryResult = await queryVal(variable, db, filterKey1, parseInt(filterValue1!), filterKey2, parseInt(filterValue2!))
  }
  else if (typeof filterKey1 !== 'undefined') {
    queryResult = await queryVal(variable, db, filterKey1, parseInt(filterValue1!))
  }
  else{
    queryResult = await queryVal(variable, db)
  }
  const output = await aggregateTimeSeries(queryResult, variable)
  return output;
}


/**
 * @param variable is a variable to generate queries for
 * @param vizType is the visualization type of the variable
 * @param filterKey1 is the first filter being applied on the variable
 * @param filterValue1 is the filter value corresponding to filterKey1
 * @param filterKey2 is the first filter being applied on the variable
 * @param filterValue2 is the filter value corresponding to filterKey2
 * @returns the aggregated data of the variable in the format that is 
 *          corresponding its visualization type. Ready to be used by 
 *          visualization components.
 */
async function main(variable: string, db: Db, vizType: string, filterKey1?: string, filterValue1?: string, filterKey2?: string, filterValue2?: string) {
  var queryResult;
  // TODO: ALLOW FILTERVAL PARSE IN AS DESCRIPTION STRING - NEED TO SEARCH FOR ENCODING
  if (typeof filterKey2 !== 'undefined'){
    queryResult = await queryVal(variable, db, "FY", LATEST_YEAR, filterKey1, parseInt(filterValue1!), filterKey2, parseInt(filterValue2!))
  }
  else if (typeof filterKey1 !== 'undefined') {
    queryResult = await queryVal(variable, db, "FY", LATEST_YEAR, filterKey1, parseInt(filterValue1!))
  }
  else{
    queryResult = await queryVal(variable, db, "FY", LATEST_YEAR)
  }
  var output;
  if (vizType !== null) {
    if (vizType === VizType.Histogram) {
      output = aggregateHistogram(queryResult); 
    }
    else if (vizType === VizType.Table) {
      output = await aggregateTable(queryResult, variable, db);
      output = Object.fromEntries(output);
    }
    else if (vizType === VizType.Donut) {
      output = await aggregateDonutChart(queryResult, variable, db);
      output = Object.fromEntries(output);
    }
    else if (vizType === VizType.Data) {
      output = await getDataHighlights(queryResult, variable, db);
    }
  }
  else {
    console.log("Variable not found in variable-info collection: ", variable)
  }
  return output;
}

module.exports = () => {
  const express = require("express");
  const router = express.Router();

  /**** Routes ****/
  router.get('/:variable', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    var timeSeriesData; // timeSeriesData is undefined if not needed to display variable with time series graph
    const [vizType, timeSeries] = await getVizType(req.params.variable, dbo.getDb())
    const output = await main(req.params.variable, dbo.getDb(), vizType)
    if (timeSeries) {
      timeSeriesData = await timeSeriesMain(req.params.variable, dbo.getDb())
    }
    console.log("output: ", output)
    console.log("timeseries output: ", timeSeriesData)
    console.log("viz type: ", vizType)
    res.json({ data: output, vizType: vizType, timeSeriesData: timeSeriesData }); 
  });

  router.get('/:variable/:filterKey/:filterVal', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    var timeSeriesData;
    const [vizType, timeSeries] = await getVizType(req.params.variable, dbo.getDb())
    const output = await main(req.params.variable, dbo.getDb(), vizType, req.params.filterKey, req.params.filterVal)
    if (timeSeries) {
      timeSeriesData = await timeSeriesMain(req.params.variable, dbo.getDb())
    }
    console.log("output: ", output)
    console.log("timeseries output: ", timeSeriesData)
    console.log("viz type: ", vizType)
    res.json({ data: output, vizType: vizType, timeSeriesData: timeSeriesData }); 

  });

  router.get('/:variable/:filterKey1/:filterVal1/:filterKey2/:filterVal2', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    var timeSeriesData;
    const [vizType, timeSeries] = await getVizType(req.params.variable, dbo.getDb())
    const output = await main(req.params.variable, dbo.getDb(), vizType, req.params.filterKey1, req.params.filterVal1, req.params.filterKey2, req.params.filterVal2)
    if (timeSeries) {
      timeSeriesData = await timeSeriesMain(req.params.variable, dbo.getDb())
    }
    console.log("output: ", output)
    console.log("timeseries output: ", timeSeriesData)
    console.log("viz type: ", vizType)
    res.json({ data: output, vizType: vizType, timeSeriesData: timeSeriesData }); 
  });

  return router;
}
