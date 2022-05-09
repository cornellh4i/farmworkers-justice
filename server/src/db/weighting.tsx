import * as dfd from "danfojs"

const variables1: string[] = [];
let df: dfd.DataFrame | dfd.Series;

async function weighting() {
  let df = await dfd.readCSV("./data/NAWS_A2E191.csv")
    .then((df: dfd.DataFrame) => { return df; });

  // variables list
  for (let i = 0; i < variables1.length; i++) {
    df[variables1[i]] *= df['PWTYCRD']
  }

  df.toCSV({ filePath: "testOut.csv" });

}


