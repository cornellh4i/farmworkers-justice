import * as dfd from "danfojs-node";

const latestFY: number = 2020;
const earliestFY: number = (latestFY + 1) - 10;
const notNecessaryVariables: string[] = [];

// paste -d "," ./toCombine/*.csv > combined.csv

dfd.readCSV("./combined.csv")
	.then((df: dfd.DataFrame) => { 
		console.log(df.shape)
		df = df.drop({columns: notNecessaryVariables});
		for (let i = 0; i < df.columns.length; i++) {
			df = df.asType(df.columns[i], "int32");
		}
		// df = df.replace("", "null");
		df = df.query(df['FY'].ge(earliestFY) && df['FY'].le(latestFY));
	 })


// TODO 1: read the csv file

// TODO 2: combine the two sample datasheets by columns
//let combined = dfd.concat({dfList : [df1, df2], axis : 1})

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