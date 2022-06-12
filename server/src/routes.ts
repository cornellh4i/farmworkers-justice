import Express from "express";
import { Db } from "mongodb";

enum VizType {
  Donut = "donut",
  Histogram = "histogram",
  Table = "table",
  Data = 'data',
  Column = 'column'
}

const timeSeriesEncodings = require('./local-json/timeSeriesEncodings.json')
const columnChartGroupings = require('./local-json/columnChartGrouping.json')

const LATEST_ODD_YEAR = 2017;
const LATEST_EVEN_YEAR = 2018;


interface binProp {
  "start": null | number,
  "end": null | number
  "start-encoding": null | number
  "end-encoding": null | number
}

interface histogramProp {
  variableEncoding: string;
  data: number[],
  index: number
}

interface histogramBinRangesProp {
  "variable-encoding": string,
  "variable-description": string
  "bin-ranges": Array<binProp>
}
interface timeSeriesRangeProp {
  encoding: number,
  start: null | number,
  end: null | number
}

interface timeSeriesEncodingsProp {
  "variable-encoding": string,
  "variable-description": string,
  "ranges": timeSeriesRangeProp[]
}

interface columnChartVariableProp {
  "variable-encoding": string,
  "variable-description": string
}

interface columnChartGroupingProp {
  generalDescription: string,
  condensedVariableEncoding: string,
  variables: columnChartVariableProp[]
}

/**
 * Takes an array and a string variable
 * @param variable is the variable being used to filter the data. EX: GENDER, FLC, REGION6 
 * @param db is the database instance being used to filter data 
 * @param latestYearsQuery is true to limit data to only the latest two years (for histograms, data highlights, table, donut charts)
 * @param filter_key1, @param filter_key2 are selected filter option. EX: GENDER, FLC, REGION6
 * @param filter_value1, @param filter_value2 are the selected filter value corresponding to filter_key
 * @returns a nested array where each element corresponds to each document of 
 *          the query result and is in the form [FY, value of the variable key, weighting of the entry]. 
 *          EX: [[2010, 2, 2.9], [2010, 2, 0.81]]
 */
async function queryVal(variable: string, db: Db, latestYearsQuery: boolean, filter_key1?: string, filter_value1?: number, filter_key2?: string, filter_value2?: number) {
  var query;
  if (typeof filter_key2 !== 'undefined' && typeof filter_key1 !== 'undefined') {
    if (latestYearsQuery) {
      query = { $and: [{ [filter_key1]: filter_value1 }, { [filter_key2]: filter_value2 }, { $or: [{ "FY": LATEST_EVEN_YEAR }, { "FY": LATEST_ODD_YEAR }] }] }
    } else {
      query = { $and: [{ [filter_key1]: filter_value1 }, { [filter_key2]: filter_value2 }] }
    }
  }
  else if (typeof filter_key1 !== 'undefined') {
    if (latestYearsQuery) {
      query = { $and: [{ [filter_key1]: filter_value1 }, { $or: [{ "FY": LATEST_EVEN_YEAR }, { "FY": LATEST_ODD_YEAR }] }] }
    } else {
      query = { [filter_key1]: filter_value1 }
    }
  }
  else {
    if (latestYearsQuery) {
      query = { $or: [{ "FY": LATEST_EVEN_YEAR }, { "FY": LATEST_ODD_YEAR }] }
    } else {
      query = {}
    }
  }
  var filtered_array: Array<[number, any, number]> = []
  var result: any[] = [];
  try {
    result = await db.collection('naws-preprocessed').find(query).toArray();
  } catch (e) {
    console.log("error in queryVal with query: ", query, " for variable: ", variable)
  }
  function iterateFunc(doc: any) {
    let lst: [number, number, number] = [doc.FY, doc[variable], doc.PWTYCRD];
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
 * @param arr is a nested array of lists that look like: [year, value, weighting]. EX: [[2008, 0, 2.93], [2009, 1, 0.8]]
 *        it assumes that the number of distinct years is even
 * @param variable is the variable that is being aggregated. EX: GENDER
 * @returns an array of dictionaries where each dictionary element is formatted
 *          as {year: 2009, value: 0.54}. The year is representative of two years (2019 & 2010 in the example)
 *          and value is the weighted percentage of 1s / (1s + 0s)
 *          Note: years are always presented odd first then even (2007-2008, 2009-2010)
 *          The value represents the percentage of how often a variable appears in those two years. 
 *          An average value is returned for variables: B11, G01, G03, FWRDays, and NUMFEMPL. 
 *          The dictionaries are arranged in ascending order based on year
 */
function aggregateTimeSeries(arr: [number, any, number][], variable: string) {
  const minYear: number = Math.ceil(Math.min(...arr.map(function (a) { return a[0]; })) / 2) * 2 - 1
  const maxYear: number = Math.ceil(Math.max(...arr.map(function (a) { return a[0]; })) / 2) * 2
  let output = new Array<{ year: number, value: number }>();
  let totalEachYear = new Map<number, number>();
  for (let i = 0; i <= (maxYear - minYear - 1) / 2; i++) {
    output[i] = { year: minYear + i * 2, value: 0 };
    totalEachYear.set(minYear + i * 2, 0)
  }

  if (variable === "B11" || variable === "FWRDAYS" || variable === "NUMFEMPL") {
    arr.forEach((v) => {
      const yr: number = Math.ceil(v[0] / 2) * 2 - 1;
      const value: number = v[1];
      const weight: number = v[2];
      const yrIdx: number = Math.floor((yr - minYear) / 2) // Have odd then even years in one group
      if (!isNaN(value)) {
        output[yrIdx].value += value * weight;
        totalEachYear.set(yr, totalEachYear.get(yr)! + 1 * weight);
      }
    })
    output.forEach((d) => {
      d.value = (d.value / totalEachYear.get(d.year)!)
    })
  } else if (variable === "G01" || variable === "G03") {
    arr.forEach((v) => {
      const yr: number = Math.ceil(v[0] / 2) * 2 - 1;
      const value: number = v[1];
      const weight: number = v[2];
      const yrIdx: number = Math.floor((yr - minYear) / 2)
      const ranges = timeSeriesEncodings.find((e: timeSeriesEncodingsProp) =>
        e["variable-encoding"] === variable);

      if (!isNaN(value)) {
        let range = ranges.ranges.find((e: timeSeriesRangeProp) =>
          e["encoding"] === value);
        if (value !== 0 && typeof (range) !== 'undefined') { // Responses with encoding 0, 97 are excluded
          let midValue = (range.start + range.end + 1) / 2
          output[yrIdx].value += weight * midValue;
          totalEachYear.set(yr, totalEachYear.get(yr)! + 1 * weight);
        }
      }
    })
    output.forEach((d) => {
      d.value = (d.value / totalEachYear.get(d.year)!)
    })
  } else {
    arr.forEach((v) => {
      const yr: number = Math.ceil(v[0] / 2) * 2 - 1;
      const value: number = v[1];
      const weight: number = v[2];
      const yrIdx: number = Math.floor((yr - minYear) / 2)
      if (!isNaN(value)) {
        if (value == 1 || value == 0) { // Only consider Yes & No answers for the rest of the variables 
          output[yrIdx].value += value * weight;
          totalEachYear.set(yr, totalEachYear.get(yr)! + 1 * weight);
        }
      }
    })
    output.forEach((d) => {
      d.value = (d.value / totalEachYear.get(d.year)! * 100)
    })
  }
  return output
}


/**
 * Takes an array and a string variable
 * @param arr is a nested array of lists that look like: [LATEST_YEAR, value, weighting]. EX: [[LATEST_ODD_YEAR, 0, 2.93], [LATEST_EVEN_YEAR, 1, 0.8]]
 * @param variable is the variable that is being aggregated. EX: GENDER
 * @returns an array of aggregated, weighted percentages from the LATEST_ODD_YEAR and LATEST_EVEN_YEAR 
 *          in order of the corresponding bin ranges in histogramBinRanges.json
 *          EX output: [0.43, 0.24, 0.35, 0.15, 0.03]
 */
function aggregateHistogram(arr: [number, any, number][], variable: string) {
  const histogramBinRanges = require('./local-json/histogramBinRanges.json')
  var binRanges: binProp[] = histogramBinRanges["histogram-variables"].find((h: histogramBinRangesProp) =>
    h["variable-encoding"] === variable)["bin-ranges"];

  let aggregated: number[] = []
  let x = 0;

  for (x = 0; x < binRanges.length; x++) {
    aggregated[x] = 0;
  }

  let weightSum = 0;
  arr.forEach(d => {
    if (!isNaN(d[1])) {
      weightSum += d[2];
      aggregated.forEach((element, index) => {
        if (binRanges[index]["start-encoding"] != null) {
          if (binRanges[index].start == null) {
            if (d[1] <= binRanges[index]["end-encoding"]!) {
              let curr = aggregated[index] + 1 * d[2]; 
              aggregated[index] = curr;
            }
          }
          else if (binRanges[index].end == null) {
            if (d[1] >= binRanges[index]["start-encoding"]!) {
              let curr = aggregated[index] + 1 * d[2];
              aggregated[index] = curr;
            }
          }
          else if (d[1] <= binRanges[index]["end-encoding"]! && d[1] >= binRanges[index]["start-encoding"]!) {
            let curr = aggregated[index] + 1 * d[2];
            aggregated[index] = curr;
          }
        } else {
          if (binRanges[index].start == null) {
            if (d[1] <= binRanges[index]["end"]!) {
              let curr = aggregated[index] + 1 * d[2];
              aggregated[index] = curr;
            }
          }
          else if (binRanges[index].end == null) {
            if (d[1] >= binRanges[index]["start"]!) {
              let curr = aggregated[index] + 1 * d[2];
              aggregated[index] = curr;
            }
          }
          else if (d[1] <= binRanges[index]["end"]! && d[1] >= binRanges[index]["start"]!) {
            let curr = aggregated[index] + 1 * d[2];
            aggregated[index] = curr;
          }
        }
      });
    }
  });
  for (let j = 0; j < aggregated.length; j++) {
    aggregated[j] = (aggregated[j] / weightSum);
  }
  return aggregated
}


/**
 * Takes an array and a string variable
 * @param arr is a nested array of lists that look like: [LATEST_YEAR, value, weighting]. EX: [[LATEST_ODD_YEAR, 0, 0.22], [LATEST_EVEN_YEAR, 1, 1.3]]
 * @param variable is the variable that is being aggregated. EX: GENDER
 * @param db is the database instance being used to filter data 
 * @returns a dictionary where the keys are encoding descriptions and the values are the weighted
 *          percentage of times that encoding appears in the LATEST_ODD_YEAR and LATEST_EVEN_YEAR.
 *          EX. {"By the hour": 0.25, "By the piece": 0, "Combination hourly wage and piece rate": 0.5, "Salary or other": 0.25}
 */
async function aggregateDonutChart(arr: [number, any, number][], variable: string, db: Db) {
  var output = new Map<string, number>();
  let totalCounts = 0
  const query = { Variable: variable }
  const encodingDescrp = await db.collection('description-code').find(query).toArray()
  arr.forEach(([year, val, weight]) => {
    if (!isNaN(val) || (variable == "STREAMS" && val.length > 0)) {
      let currCount = output.get(val.toString())
      output.set(val.toString(), (typeof currCount == 'undefined') ? 0 : currCount! + weight)
      totalCounts += weight
    }
  });

  output.forEach((val, description) => {
    output.set(description, Math.round(val / totalCounts * 100) / 100);
  })

  // Get description for encoded variables 
  if (encodingDescrp.length > 0) {
    var outputDescription = new Map<string, number>();
    encodingDescrp.forEach(element => {
      let percentage = output.get(element.Encoding.toString());
      outputDescription.set(element.Description, (typeof percentage == 'undefined' ? 0 : percentage))
    });
    output = outputDescription
  }
  return output
}


/**
 * Takes an array and a string variable
 * @param arr is a nested array of lists that look like: [year, value, weighting]. EX: [LATEST_YEAR, value, weighting]. EX: [[LATEST_ODD_YEAR, 0, 0.22], [LATEST_EVEN_YEAR, 1, 1.3]]
 * @param variable is the variable that is being aggregated. EX: GENDER
 * @param db is the database instance being used to filter data 
 * @returns a dictionary where the keys are encoding descriptions and the values 
 *          are arrays of two values. The first value is the proportion weighted
 *          percentage of the surveys that answered accordingly, and the second 
 *          value is the number of count for that response.
 *          EX. {"Mexican/American": [0.11, 110], "Mexican": [0.65, 650], "Chicano": [0.10, 100], "Other Hispanic": [0.04: 40], "Puerto Rican": [0.08, 80], "Not Hispanic or Latino": [0.02, 20]}
 */
async function aggregateTable(arr: [number, any, number][], variable: string, db: Db) {
  let sum = new Map<string, number>();
  let output = new Map<string, number>();
  let n = 0;

  var encodingDescrp: any;
  async function allEncoding() {
    let query = { Variable: variable }
    try {
      encodingDescrp = await db.collection('description-code').find(query).toArray()
      if (typeof encodingDescrp == 'undefined') {
        console.log("check on code: ", variable)
      }
      return encodingDescrp;
    } catch (error) {
      console.log(error);
    };
  }

  await allEncoding()
    .then(function () {
      for (let i = 0; i < arr.length; i++) {
        const value = arr[i][1];
        const weight = arr[i][2];
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
            if (sum.has(description)) {
              sum.set(description, sum.get(description)! + 1 * weight) 
            }
            else {
              sum.set(description, 1);
            }
            n += weight; 
          } catch (e) {
            console.log("erroring for encoding: ", value, " for variable: ", variable)
          }
        }
      }
      sum.forEach((v, d) => {
        output.set(d, Number((v/n * 100).toFixed(1)));
      })
  });
  return output;
}


/**
 * @param arr is a nested array of lists where each element look like: [column description, [[year, value, weighting], [year value, weighting], ..]]. 
 * EX: [
 *        ["English", [[2002, 0, 0.2], [2012, 1, 1.2], [2047, 97, 4.2], [1993, 0, 2.3], [1992, 1, 1.1]]],
 *        ["Spanish", [[2002, 0, 0.9], [2012, 1, 0.8], [2047, 1, 3.1], [1993, 23, 4]]],
 *        ["Mixtec", [[2002, 1, 0.9]], [2012, 1, 0.9]], [2047, 1, 0.9]], [1993, 1, 0.9]]]]],
 *        ["Other", [[2002, 0, 0.91], [2012, 0, 0.91], [2047, 0, 0.91], [1993, 1, 0.91]]]
 *     ];
 * @returns a list of seriesProps that is needed to supplied to the HighCharts Column type 
 */
function aggregateColumnChart(arr: Array<[string, [number, number, number][]]>) {
  interface seriesProps {
    type: string,
    name: string,
    data: number[]
  }

  var output: seriesProps[] = [];

  for (let i = 0; i < arr.length; i++) {
    var percent = calculatePercent(arr[i][1]);
    output.push({
      type: 'column', // always have to be column
      name: arr[i][0], // x-axis column description label
      data: [percent]
    })
  }

  function calculatePercent(arr: [number, number, number][]) {
    var counterYes = 0;
    var counterNo = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i][1] === 1) {
        counterYes += 1;
      }
      else if (arr[i][1] === 0) {
        counterNo += 1;
      }
    }
    if (counterYes + counterNo === 0) {
      return 0
    } else {
      return Number(((counterYes / (counterYes + counterNo)) * 100).toFixed(2)); //TODO: RUN CACHE AGAIN FOR COLUMN CHART
    }
  }
  return output;
}


/**
 * @param arr is a nested array of lists that look like: [year, value]. EX: [LATEST_YEAR, value, weighting]. EX: [[LATEST_ODD_YEAR, 0, 0.22], [LATEST_EVEN_YEAR, 1, 1.3]]
 * @param variable is the variable that is being aggregated. EX: GENDER
 * @param db is the database instance being used to filter data 
 * @returns an object with attributes percentage and description. 
 *          The percentage represents the weighted proprotion of respondents answering the chosen option. 
 *          The description is the binary data option to display
 */
async function getDataHighlights(arr: [number, any, number][], variable: string, db: Db) {
  let query = { Variable: variable }
  let displayCount = 0
  let totalCount = 0
  const binaryData = await db.collection('binary-data').findOne(query)
  arr.forEach(([year, value, weight]) => {
    try {
      if (!isNaN(value)) {
        totalCount += weight; 
        if (value === binaryData!.DisplayEncoding) {
          displayCount += weight; 
        }
      }
    } catch (e) {
      console.log("Error in getDataHighlights for variable: ", variable, " on value: ", value)
    }
  });
  return { description: binaryData!.DisplayDescription, percentage: (displayCount / totalCount * 100).toFixed(1) }
}


/**
 * @param variable is the variable that is being queried. EX: GENDER
 * @param db is the database instance being used to filter data 
 * @returns an array of two elements. The first element is the visualization 
 *          type and the second element indicates whether the variable generates 
 *          a time series visualization as well. *          
 */
async function getVizType(variable: string, db: Db) {
  let query = { Variable: variable }
  const columnEncodings = ["B21x", "G04x", "NH0x", "NQ10x"]
  // for(var i = 0; i < columnChartGroupings.length; i++){
  //   columnEncodings.push(columnChartGroupings[i]["condensedVariableEncoding"])
  // }
  if (columnEncodings.includes(variable)) {
    return [VizType.Column, 0]
  } else {
    const variableInfo = await db.collection('variable-info').findOne(query)
    if (variableInfo !== null) {
      if (columnEncodings.includes(variable)) {
        return [VizType.Column, variableInfo["Time Series"]]
      } else {
        return [variableInfo["Visualization Type"], variableInfo["Time Series"]]
      }
    } else {
      throw "Variable not found in variable-info collection: ", variable
    }
  }
}


/**
 * @param variable is a variable to generate queries for
 * @param filterKey1 is the first filter being applied on the variable
 * @param filterValue1 is the filter value corresponding to filterKey1
 * @param filterKey2 is the first filter being applied on the variable
 * @param filterValue2 is the filter value corresponding to filterKey2
 * @returns the aggregated data of the variable in the format that is 
 *          usable by timeseries visualization component
 */
async function timeSeriesMain(variable: string, db: Db, filterKey1?: string, filterValue1?: string, filterKey2?: string, filterValue2?: string) {
  var queryResult;
  if (typeof filterKey2 !== 'undefined') {
    queryResult = await queryVal(variable, db, false, filterKey1, parseInt(filterValue1!), filterKey2, parseInt(filterValue2!))
  }
  else if (typeof filterKey1 !== 'undefined') {
    queryResult = await queryVal(variable, db, false, filterKey1, parseInt(filterValue1!))
  }
  else {
    queryResult = await queryVal(variable, db, false)
  }
  const output = aggregateTimeSeries(queryResult, variable)
  return output;
}

/**
 * @param db is the database instance being used to filter data 
 * @returns a list of all variables that are being visualized on
 */
async function getUniqueVariables(db: Db) {
  const variablesInfo = db.collection('variable-info').find({});
  var uniqueVariables: string[] = []
  await variablesInfo.forEach(variableInfo => {
    uniqueVariables.push(variableInfo.Variable)
  });
  return uniqueVariables;
}


/**
 * A helper function for main
 * @param variable is a variable to generate queries for
 * @param db is the database instance being used to filter data 
 * @param filterKey1 is the first filter being applied on the variable
 * @param filterValue1 is the filter value corresponding to filterKey1
 * @param filterKey2 is the second filter being applied on the variable
 * @param filterValue2 is the filter value corresponding to filterKey2
 * @returns the aggregated data of the variable in the format that is 
 *          corresponding its visualization type. Ready to be used by 
 *          visualization components.
 */
async function getQueryResult(variable: string, db: Db, filterKey1?: string, filterValue1?: string, filterKey2?: string, filterValue2?: string) {
  var queryResult;
  if (typeof filterKey2 !== 'undefined') {
    queryResult = await queryVal(variable, db, true, filterKey1, parseInt(filterValue1!), filterKey2, parseInt(filterValue2!))
  }
  else if (typeof filterKey1 !== 'undefined') {
    queryResult = await queryVal(variable, db, true, filterKey1, parseInt(filterValue1!))
  }
  else {
    queryResult = await queryVal(variable, db, true)
  }
  return queryResult
}


/**
 * @param variable is a variable to generate queries for
 * @param db is the database instance being used to filter data 
 * @param vizType is the visualization type of the variable
 * @param filterKey1 is the first filter being applied on the variable
 * @param filterValue1 is the filter value corresponding to filterKey1
 * @param filterKey2 is the second filter being applied on the variable
 * @param filterValue2 is the filter value corresponding to filterKey2
 * @returns the aggregated data of the variable in the format that is 
 *          corresponding its visualization type. Ready to be used by 
 *          visualization components.
 */
async function main(variable: string, db: Db, vizType: string, filterKey1?: string, filterValue1?: string, filterKey2?: string, filterValue2?: string) {
  var output;
  if (vizType === VizType.Column) {
    const variablesInSameGrouping = columnChartGroupings.find((e: columnChartGroupingProp) =>
      e["condensedVariableEncoding"] === variable).variables;
    var queryResults: Array<[string, [number, number, number][]]> = []
    for (const v of variablesInSameGrouping) {
      const queryResult = await getQueryResult(v['variable-encoding'], db, filterKey1, filterValue1, filterKey2, filterValue2)
      // each arr element supplied to aggregationColumnChart function look like: [column description, [[year, value], [year value], ..]].
      queryResults.push([v['variable-description'], queryResult])
    };
    output = aggregateColumnChart(queryResults)
  } else {
    const queryResult = await getQueryResult(variable, db, filterKey1, filterValue1, filterKey2, filterValue2)
    if (vizType !== null) {
      if (vizType === VizType.Histogram) {
        output = aggregateHistogram(queryResult, variable);
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
    } else {
      console.log("Variable not found in variable-info collection: ", variable)
    }
  }
  return output;
}

/**96 total variables 
 * GENDER: 2; FLC: 2; REGION6: 6; currstat: 4
 * total entries: 83 combinations * 96 variable = 
 */
async function combinationalData(db: Db) {
  const filtersEncoding = require('./local-json/filterEncoding.json')
  var variables: string[] = await getUniqueVariables(db);
  const columnVariables = ["B21x", "G04x", "NH0x", "NQ10x"] 
  variables = variables.concat(columnVariables)
  var combDatas: any[] = []
  for (let i = 0; i < variables.length; i++) {
    combDatas = []
    // no filters
    var [vizType, timeSeries] = await getVizType(variables[i], db);
    const timeSeriesData = timeSeries === 1 ? (await timeSeriesMain(variables[i], db)) : undefined;
    const filters = ["GENDER", "FLC", "REGION6", "currstat"]
    let combData = {
      "variable": variables[i],
      "vizType": vizType,
      "filter1": "",
      "filter1Encoding": "",
      "filter2": "",
      "filter2Encoding": "",
      "mainQueryData": (await main(variables[i], db, vizType)),
      "timeSeriesQueryData": timeSeriesData,
    }
    combDatas.push(combData)
    // loop through filters (fill all filter1 only)
    for (let x = 0; x < 4; x++) {
      let combDataOne = {
        ...combData
      }
      let value1: string = filters[x]
      combDataOne["filter1"] = value1
      for (var element1 of filtersEncoding[value1]) {
        let combDataTwo = {
          ...combDataOne
        }
        combDataTwo["filter1Encoding"] = element1["filter-encoding"]
        combDataTwo["mainQueryData"] = (await main(variables[i], db, vizType, combDataTwo["filter1"], combDataTwo["filter1Encoding"]))
        if (timeSeries) {
          combDataTwo["timeSeriesQueryData"] = (await timeSeriesMain(variables[i], db, combDataTwo["filter1"], combDataTwo["filter1Encoding"]))
        }
        combDatas.push(combDataTwo) // f1 = filter, f2 = null
        // loop through filters (fill both filter1 and filter2)
        for (let j = x + 1; j < 4; j++) {
          let combDataThree = {
            ...combDataTwo
          }
          let value2: string = filters[j]
          combDataThree["filter2"] = value2
          for (var element2 of filtersEncoding[value2]) {
            let combDataFour = {
              ...combDataThree
            }
            combDataFour["filter2Encoding"] = element2["filter-encoding"]
            combDataFour["mainQueryData"] = (await main(variables[i], db, vizType, combDataFour["filter1"], combDataFour["filter1Encoding"], combDataFour["filter2"], combDataFour["filter2Encoding"]))
            if (timeSeries) {
              combDataFour["timeSeriesQueryData"] = (await timeSeriesMain(variables[i], db, combDataFour["filter1"], combDataFour["filter1Encoding"], combDataFour["filter2"], combDataFour["filter2Encoding"]))
            }
            combDatas.push(combDataFour) // f1 = filt, f2 = filt
          }
        }
      }
    }
    console.log("cache data computed  for: ", variables[i])
    db.collection('new-weighted-cache').insertMany(combDatas)
  }
  db.collection('weighted-cache').drop()
  db.collection('new-weighted-cache').rename("weighted-cache")
  console.log("cache population done for all variables")
  return combDatas;
}



module.exports = () => {
  const Express = require("express");
  const router = Express.Router();

  /**** Routes ****/

  router.get('/testData', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    await combinationalData(dbo.getDb());
    res.json({ success: true });
  })

  router.post('/admin', async (req: Express.Request, res: Express.Response) => {
    const haveAccess = req.body.password === process.env.ADMIN_PASSWORD
    var token: null | string = null
    if (haveAccess) {
      token = "token"
    }
    res.json({ haveAccess: haveAccess, token: token });
  })

  // This updateData route is placed before the :/variable route to prevent it from getting overriden 
  const multer = require('multer')
  const UPLOAD_DIRECTORY = 'src/db/data/';
  const upload = multer({ dest: UPLOAD_DIRECTORY })
  const fs = require("fs")
  router.post('/updateData', upload.single('selectedFile'), async (req: any, res: Express.Response) => {
    console.log("req body: ", req.body)
    console.log("received files: ", req.file)
    try {
      if (!req.file) {
        res.send({
          status: false,
          message: 'No file uploaded',
        })
      } else {
        let file = req.file;
        fs.rename(file.path, `${UPLOAD_DIRECTORY}/${file.originalname}`, (err: Error) => {
          if (err) console.log(err)
        })

        res.send({
          status: true,
          message: 'File is uploaded',
          data: {
            name: file.name,
            mimetype: file.mimetype,
            size: file.size,
          }
        });
      }
    } catch (e: any) {
      res.status(500).send(e);
    }
  })

  // This updateData route is placed before the :/variable route to prevent it from getting overriden 
  router.get('/updateData', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    let variables: string = (await getUniqueVariables(dbo.getDb())).toString();
    const ATLAS_URI = process.env.ATLAS_URI;
    const { spawn } = require('child_process');
    var dataToSend: any;
    
    const preprocessingPromise = new Promise(() => {
      // spawn new child process to call the python script
      // switch this to python if your terminal uses python insteal of py
      const python = spawn('python', ['preprocessing.py', variables, ATLAS_URI]);
      // collect data from script
      python.stdout.on('data', function (data: any) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
      });
      // in close event we are sure that stream from child process is closed
      python.on('close', (code: any) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      res.send(dataToSend)
    })})
    preprocessingPromise.then( () => {
      console.log("Starting to combine data")
      combinationalData(dbo.getDb())}
    )
  });

  // query = { $and: [{ [filter_key1]: filter_value1 }, { [filter_key2]: filter_value2 }, { $or: [{ "FY": LATEST_EVEN_YEAR }, { "FY": LATEST_ODD_YEAR }] }] }
  router.get('/:variable', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    let query = { $and: [{ variable: req.params.variable }, { filter1: "" }, { filter1Encoding: "" }, { filter2: "" }, { filter2Encoding: "" }] }
    try {
      // var timeSeriesData; // timeSeriesData is undefined if not needed to display variable with time series graph
      // const [vizType, timeSeries] = await getVizType(req.params.variable, dbo.getDb())
      // const output = await main(req.params.variable, dbo.getDb(), vizType)
      // if (timeSeries) {
      //   timeSeriesData = await timeSeriesMain(req.params.variable, dbo.getDb())
      // }
      const cache = await dbo.getDb().collection('weighted-cache').findOne(query)
      const output = cache["mainQueryData"]
      const vizType: string = cache["vizType"]
      const timeSeriesData = cache["timeSeriesQueryData"] === null ? undefined : cache["timeSeriesQueryData"]
      console.log("variable: ", req.params.variable)
      console.log("output: ", output)
      console.log("timeseries output: ", timeSeriesData)
      res.json({ data: output, vizType: vizType, timeSeriesData: timeSeriesData });
    } catch {
      console.log("Variable doesn't exist in cache: ", req.params.variable)
      res.send({ status: false })
    }
  });

  router.get('/:variable/:filterKey/:filterVal', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    let query = { $and: [{ variable: req.params.variable }, { filter1: req.params.filterKey }, { filter1Encoding: Number(req.params.filterVal) }, { filter2: "" }, { filter2Encoding: "" }] }
    try {
      const cache = await dbo.getDb().collection('weighted-cache').findOne(query)
      const output = cache["mainQueryData"]
      const vizType = cache["vizType"]
      const timeSeriesData = cache["timeSeriesQueryData"] === null ? undefined : cache["timeSeriesQueryData"]
      console.log("variable: ", req.params.variable)
      console.log("output: ", output)
      console.log("timeseries output: ", timeSeriesData)
      res.json({ data: output, vizType: vizType, timeSeriesData: timeSeriesData });
    } catch {
      console.log("Variable doesn't exist in cache: ", req.params.variable)
      res.send({ status: false })
    }
  });

  router.get('/:variable/:filterKey1/:filterVal1/:filterKey2/:filterVal2', async (req: Express.Request, res: Express.Response) => {
    const dbo = require("./db/conn");
    const filters = ["GENDER", "FLC", "REGION6", "currstat"]
    let query = { $and: [{ variable: req.params.variable }, { filter1: req.params.filterKey1 }, { filter1Encoding: Number(req.params.filterVal1) }, { filter2: req.params.filterKey2 }, { filter2Encoding: Number(req.params.filterVal2) }] }
    let idx1 = filters.indexOf(req.params.filterKey1)
    let idx2 = filters.indexOf(req.params.filterKey2)
    if (idx1 > idx2) {
      query = { $and: [{ variable: req.params.variable }, { filter1: req.params.filterKey2 }, { filter1Encoding: Number(req.params.filterVal2) }, { filter2: req.params.filterKey1 }, { filter2Encoding: Number(req.params.filterVal1) }] }
    }
    try {
      const cache = await dbo.getDb().collection('weighted-cache').findOne(query)
      const output = cache["mainQueryData"]
      const vizType = cache["vizType"]
      const timeSeriesData = cache["timeSeriesQueryData"] === null ? undefined : cache["timeSeriesQueryData"]
      console.log("variable: ", req.params.variable)
      console.log("output: ", output)
      console.log("timeseries output: ", timeSeriesData)
      res.json({ data: output, vizType: vizType, timeSeriesData: timeSeriesData });
    } catch {
      console.log("Variable doesn't exist in cache: ", req.params.variable)
      res.send({ status: false })
    }
  });

  return router;
}