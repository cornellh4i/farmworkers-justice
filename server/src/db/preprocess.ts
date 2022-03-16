import * as dfd from "danfojs-node";
//import { collectVarInfo } from "../routes";

// Necessary - ensure there are no commas in the dataset; Ctrl + A, change format to "Number"
// Need to npm install to update with "danfojs-node"
// TO RUN - cd into db; npx ts-node preprocess.ts


const notNecessaryVariables: string[] = [];


async function preprocess() {
	const latestFY: number = 2020;
	const earliestFY: number = (latestFY + 1) - 10;

	var startTime: any  = new Date();

	let df1 = await dfd.readCSV("./data/NAWS_A2E191.csv")
					.then((df: dfd.DataFrame) => {return df;});
	let df2 = await dfd.readCSV("./data/NAWS_F2Y191.csv")
					.then((df: dfd.DataFrame) => {return df;});

	let df: dfd.DataFrame | dfd.Series = dfd.concat(
		{dfList : [df1, df2], axis : 1})
	dfd.toCSV(df, { filePath : "./combined.csv" });
	console.log(df.shape);

	console.log("Here")
	// get necessaryVariables
	let varInfo = await collectVarInfo();
	console.log("Passed")

	// put all necessary variables into hashmap for constant time lookup
	let necessaryVariables: any = {}
	for (let i = 0; i < varInfo.length(); i++){
		necessaryVariables[varInfo[i].variable] = true;
	}

	console.log(necessaryVariables);

	// // notnecessaryvariables is all the columns of the df less the necessary variables; this for loop also casts the columns to int32
	// for (let i = 0; i < df.columns.length; i++) {
	// 	let selectedColumn: any = df.columns[i];

	// 	if (!necessaryVariables[selectedColumn]) {
	// 		notNecessaryVariables.push(selectedColumn);
	// 	}

	// 	// Note that "STREAMS" and "MIGTYPE2" are strings
	// 	if (selectedColumn !== "STREAMS" || selectedColumn !== "MIGTYPE2") {
	// 		df = df.asType(selectedColumn, "int32");
	// 	}
	// }

	// df = df.drop({columns : notNecessaryVariables});

	console.log(df.shape)

	// Verified this works
	let fiscal: any = "FY"
	df = df.asType(fiscal, "int32");
	df = df.query(df['FY'].ge(earliestFY).and(df['FY'].le(latestFY)));

	console.log(df.shape)

	var endTime: any = new Date();

	console.log(endTime - startTime);

	// Fill in missing numbers with null
	// df = df.fillNa(null);

	dfd.toCSV(df, { filePath : "./preprocessed.csv" });
	return df;
}

function collectVarInfo(){
	const dbo = require("./conn");
	var db = dbo.getDb();
	console.log(typeof(db))
	return db.collection("variable-info");
}

collectVarInfo()

// TODO 3: Drop unnecesary variables

// TODO 5: Substitute missing values with null
// 

// TODO 6: Make sure there's an ID
// 

// TODO 8: send to MongoDB
// 