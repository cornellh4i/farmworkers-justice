import * as dfd from "danfojs"

const latestFY: number = 2020;
const earliestFY: number = (latestFY + 1) - 10;
const notNecessaryVariables: string[] = [];
let df: dfd.DataFrame | dfd.Series;

async function preprocess() {
  let df1 = await dfd.readCSV("./data/NAWS_A2E191.csv")
    .then((df: dfd.DataFrame) => { return df; });
  let df2 = await dfd.readCSV("./data/NAWS_F2Y191.csv")
    .then((df: dfd.DataFrame) => { return df; });

  df = dfd.concat({ dfList: [df1, df2], axis: 1 })
  dfd.toCSV(df, { filePath: "combined.csv" });
  console.log(df.shape)

  // df = df.drop({columns: notNecessaryVariables});
  // for (let i = 0; i < df.columns.length; i++) {
  // 	df = df.asType(df.columns[i], "int32");
  // }
  // df = df.replace("", "null");
  // df = df.asType(df.columns[], "int32");
  df = df.query(df['FY'].ge(earliestFY) && df['FY'].le(latestFY));
  console.log(df.shape)
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