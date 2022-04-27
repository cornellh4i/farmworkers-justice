import Express from "express";
import { Db } from "mongodb";


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
const LATEST_ODD_YEAR = 2017;
const LATEST_EVEN_YEAR = 2018;


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

interface fileRequest extends Request {
  files: any,
}

/**
 * Takes an array and a string variable
 * @param variable is the variable being used to filter the data. EX: GENDER, FLC, REGION6 
 * @param db is the database instance being used to filter data 
 * @param latestYearsQuery is true to limit data to only the latest two years (for histograms, data highlights, table, donut charts)
 * @param filter_key1, @param filter_key2 are selected filter option. EX: GENDER, FLC, REGION6
 * @param filter_value1, @param filter_value2 are the selected filter value corresponding to filter_key
 * @returns a nested array where each element corresponds to each document of 
 *          the query result and is in the form [FY, value of the variable key]. 
 *          EX: [[2010, 2], [2010, 2]]
 */
async function queryVal(variable: string, db: Db, latestYearsQuery: boolean, filter_key1?: string, filter_value1?: number, filter_key2?: string, filter_value2?: number) {
  var query = {}
  if (typeof filter_key2 !== 'undefined' && typeof filter_key1 !== 'undefined') {
    if (latestYearsQuery) {
      query = { $and: [{ [filter_key1]: filter_value1 }, { [filter_key2]: filter_value2 }, { $or: [{"FY": LATEST_EVEN_YEAR}, {"FY": LATEST_ODD_YEAR}]}] }
    } else {
      query = { $and: [{ [filter_key1]: filter_value1 }, { [filter_key2]: filter_value2 }] }
    }
  }
  else if (typeof filter_key1 !== 'undefined') {
    if (latestYearsQuery) {
      query = { $and: [{ [filter_key1]: filter_value1 }, { $or: [{"FY": LATEST_EVEN_YEAR}, {"FY": LATEST_ODD_YEAR}]}] }
    } else {
      query = { [filter_key1]: filter_value1 }
    }
  }
  else {
    if (latestYearsQuery) {
      query = { $or: [{"FY": LATEST_EVEN_YEAR}, {"FY": LATEST_ODD_YEAR}]}
    } else{
      query = {}
    }
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
 *        it assumes that the number of distinct years is even
 * @param variable is the variable that is being aggregated. EX: GENDER
 * @returns an array of dictionaries where each dictionary element is formatted
 *          as {year: 2009, value: 0.54}. The year is representative of two years (2019 & 2010 in the example)
 *          Note: years are always presented odd first then even (2007-2008, 2009-2010)
 *          The value represents the percentage of how often a variable appears in those two years. 
 *          An average value is returned for variables: B11, G01, G03, FWRDays, 
 *          and NUMFEMPL. 
 *          The dictionaries are arranged in ascending order based on year
 */
function aggregateTimeSeries(arr: [number, number][], variable: string) {
  const minYear: number = Math.ceil(Math.min(...arr.map(function (a) { return a[0]; })) / 2) * 2 - 1
  const maxYear: number = Math.ceil(Math.max(...arr.map(function (a) { return a[0]; })) / 2) * 2 
  let output = new Array<{ year: number, value: number }>();
  let totalEachYear = new Map<number, number>();
  for (let i = 0; i <= (maxYear - minYear - 1)/2; i++) {
    output[i] = { year: minYear + i*2, value: 0 };
    totalEachYear.set(minYear + i*2, 0)
  }

  if (variable === "B11" || variable === "FWRDays" || variable === "NUMFEMPL") {
    arr.forEach((v) => {
      const yr: number = Math.ceil(v[0] / 2) * 2 - 1;
      const value: number = v[1];
      const yrIdx: number = Math.floor((yr - minYear)/2) // Have odd then even years in one group
      if (!isNaN(value)) {
        output[yrIdx].value += value;
        totalEachYear.set(yr, totalEachYear.get(yr)! + 1);
      }
    })
  } else if (variable === "G01" || variable === "G03") {
    arr.forEach((v) => {
      const yr: number = Math.ceil(v[0] / 2) * 2 - 1;
      const value: number = v[1];
      const yrIdx: number = Math.floor((yr - minYear)/2) 
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
      const yr: number = Math.ceil(v[0] / 2) * 2 - 1;
      const value: number = v[1];
      const yrIdx: number = Math.floor((yr - minYear)/2) 
      if (!isNaN(value)) {
        if (value == 1 || value == 0) { // Only consider Yes & No answers for the rest of the variables 
          output[yrIdx].value += value;
          totalEachYear.set(yr, totalEachYear.get(yr)! + 1);
        }
      }
    })
  }
  console.log("output before division: ", output)
  console.log("total each year before division: ", totalEachYear)

  output.forEach((d) => {
    d.value = Math.round(d.value / totalEachYear.get(d.year)! * 100)
  })
  return output
}


/**
 * Takes an array and a string variable
 * @param arr is a nested array of lists that look like: [year, value]. EX: [[2008, 0], [2009, 1]]
 * @param variable is the variable that is being aggregated. EX: GENDER
 * @returns an array of all values from the LATEST_ODD_YEAR and LATEST_EVEN_YEAR
 */
function aggregateHistogram(arr: [number, number][]) {
  let recentVals: Array<number> = [];

  function iterateFunc(v: [number, number]) {
    if (!isNaN(v[1])){
      recentVals.push(v[1])
    }
  }
  function errorFunc(error: any) {
    console.log(error);
  }
  arr.forEach(iterateFunc, errorFunc)
  return recentVals
}


/**
 * Takes an array and a string variable
 * @param arr is a nested array of lists that look like: [LATEST_YEAR, value]. EX: [[LATEST_ODD_YEAR, 0], [LATEST_EVEN_YEAR, 1]]
 * @param variable is the variable that is being aggregated. EX: GENDER
 * @returns a dictionary where the keys are encoding descriptions and the values are the 
 *          percentage of times that encoding appears in the LATEST_ODD_YEAR and LATEST_EVEN_YEAR.
 *          EX. {"By the hour": 0.25, "By the piece": 0, "Combination hourly wage and piece rate": 0.5, "Salary or other": 0.25}
 */
async function aggregateDonutChart(arr: [number, number][], variable: string, db: Db) {
  var output = new Map<string, number>();
  let totalCounts = 0
  const query = { Variable: variable }
  const encodingDescrp = await db.collection('description-code').find(query).toArray()
  console.log("encoding descrp: ", encodingDescrp)
  arr.forEach(([year, val]) => {
    if (!isNaN(val)) {
      let currCount = output.get(val.toString())
      output.set(val.toString(), (typeof currCount == 'undefined') ? 0 : currCount! + 1)
      totalCounts += 1
    }
  });

  output.forEach((val, description) => {
    output.set(description, Math.round(val/totalCounts * 100) / 100);
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
 * @param arr is a nested array of lists that look like: [year, value]. EX: [[LATEST_EVEN_YEAR, 0], [LATEST_ODD_YEAR, 1]]
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
 * @param arr is a nested array of lists that look like: [year, value]. EX: [[LATEST_EVEN_YEAR, 0], [LATEST_EVEN_YEAR, 1], [LATEST_ODD_YEAR, 0]]
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
      totalCount++;
      if (value === binaryData!.DisplayEncoding) {
        displayCount++
      }
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
  if (typeof filterKey2 !== 'undefined'){
    queryResult = await queryVal(variable, db, false, filterKey1, parseInt(filterValue1!), filterKey2, parseInt(filterValue2!))
  }
  else if (typeof filterKey1 !== 'undefined') {
    queryResult = await queryVal(variable, db, false, filterKey1, parseInt(filterValue1!))
  }
  else{
    queryResult = await queryVal(variable, db, false)
  }
  const output = aggregateTimeSeries(queryResult, variable)
  return output;
}

async function getUniqueVariables(db: Db) {
  const variablesInfo = db.collection('variable-info').find({});
  var uniqueVariables: string[] = []
  await variablesInfo.forEach(variableInfo => {
    uniqueVariables.push(variableInfo.Variable)
  });
  console.log(uniqueVariables)
  return uniqueVariables;
  
}


// /**
//  * @returns the the data stored inside of naws/variable-info
//  */
// function collectVarInfo(){
//   const dbo = require("./db/conn");
//   var db = dbo.getDb();
//   return db.collection("variable-info");
// }
// export { collectVarInfo };


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
  if (typeof filterKey2 !== 'undefined'){
    queryResult = await queryVal(variable, db, true, filterKey1, parseInt(filterValue1!), filterKey2, parseInt(filterValue2!))
  }
  else if (typeof filterKey1 !== 'undefined') {
    queryResult = await queryVal(variable, db, true, filterKey1, parseInt(filterValue1!))
  }
  else{
    queryResult = await queryVal(variable, db, true)
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

  // const app = express();
  // const cors = require("cors");
  // app.use(cors({origin: "http://localhost:3000"}));

  // const multer = require('multer');
  // // const upload = multer({ dest: './src/db/data/'});

  const UPLOAD_DIRECTORY = 'src/db/data/';

  // let storage = multer.diskStorage({
  //   destination: function (req: Express.Request, file: fileRequest, cb: Callback) {
  //       cb(null, UPLOAD_DIRECTORY)
  //   },
  //   filename: function (req: Express.Request, file: fileRequest, cb: Callback) {
  //     cb(null, file.fieldname)
  //   }
  // });

  // const upload = multer({storage: storage,
  //   onFileUploadStart: function (file: fileRequest) {
  //     console.log(file.originalname + ' is starting ...')
  //   }
  // });

  /**** Routes ****/
  const multer = require('multer')
  const upload = multer({dest: UPLOAD_DIRECTORY})
  const fs = require("fs")
  router.post('/updateData', upload.single('selectedFile'), async (req: any, res: Express.Response) =>{
    console.log("req body: ", req.body)
    console.log("received files: ", req.file)
    try {
      if(!req.file) {
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

    const {spawn} = require('child_process');

    var dataToSend: any;
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
    });
  });


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
      timeSeriesData = await timeSeriesMain(req.params.variable, dbo.getDb(), req.params.filterKey, req.params.filterVal)
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
      timeSeriesData = await timeSeriesMain(req.params.variable, dbo.getDb(), req.params.filterKey1, req.params.filterVal1, req.params.filterKey2, req.params.filterVal2)
    }
    console.log("output: ", output)
    console.log("timeseries output: ", timeSeriesData)
    console.log("viz type: ", vizType)
    res.json({ data: output, vizType: vizType, timeSeriesData: timeSeriesData }); 
  });

  return router;
}
