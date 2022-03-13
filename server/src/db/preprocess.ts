import * as dfd from "danfojs-node";
import { collectVarInfo } from "../routes";

// Necessary - ensure there are no commas in the dataset; Ctrl + A, change format to "Number"
// Need to npm install to update with "danfojs-node"
// TO RUN - cd into db; npx ts-node preprocess.ts

const latestFY: number = 2020;
const earliestFY: number = (latestFY + 1) - 10;
const notNecessaryVariables: string[] = [];

async function preprocess() {
	let df1 = await dfd.readCSV("./data/NAWS_A2E191.csv")
					.then((df: dfd.DataFrame) => {return df;});
	let df2 = await dfd.readCSV("./data/NAWS_F2Y191.csv")
					.then((df: dfd.DataFrame) => {return df;});

	let df: dfd.DataFrame | dfd.Series = dfd.concat(
		{dfList : [df1, df2], axis : 1})
	dfd.toCSV(df, { filePath: "combined.csv" });

	// df = df.drop({columns: notNecessaryVariables});

	// WARNING - very inefficient and slow; how to optimize?
	for (let i = 0; i < df.columns.length; i++) {
		let columnToCast: any = df.columns[i];
		df = df.asType(columnToCast, "int32");
	}

	// Verified this works
	df = df.query(df['FY'].ge(earliestFY).and(df['FY'].le(latestFY)));
	
	// get necessaryVariables
	let varInfo = await collectVarInfo()

	// put all necessary variables into hashmap for constant time lookup
	let necessaryVariables: any = {}
	for(let i = 0; i < varInfo.length(); i++){
		necessaryVariables[varInfo[i].variable] = true;
	}
	console.log("not running, but script finishes");
}

preprocess()

// TODO 3: Drop unnecesary variables

// TODO 4: Change type of all entries to int
// let df_new = df.asType("D", "int32")
// Need a way to cast each column

// TODO 5: Substitute missing values with null
// 

// TODO 6: Make sure there's an ID
// 

// TODO 7: delete data that have fiscal year a decade before latest FY [2011..2020]
// 

// TODO 8: send to MongoDB
// 