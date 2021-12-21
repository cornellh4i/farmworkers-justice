import { useEffect, useState, useRef } from "react";
import Histogram from '../src/charts/Histogram';
import Map from '../src/charts/Map';
import * as d3 from "d3";
import Line, {timeSeriesProp} from './charts/lineGraph'
import Donut from './charts/donutChart'
import Table from './charts/Table'



const API_URL = process.env.REACT_APP_API;

function App() {
  const [data, setData] = useState("No data :(");
  const [tableData, setTableData] = useState<{}>({});
  const [timeSeriesData, setTimeSeriesData] = useState<Array<[number, number]>>([]);
  const [donutData, setdonutData] = useState<{}>({});
  const [histogramData, setHistogramData] = useState<Array<number>>([]);

  // TODO: USE PROMISE.ALL (PARALLEL FETCHING)
  useEffect(() => {
    async function getData() {
      // const urlHistogram = `${API_URL}/histogram/AGE`;
      // const histogramResponse = await fetch(urlHistogram);
      // const histogramOut = await histogramResponse.json();
      // setHistogramData(histogramOut.msg);
      // console.log("histogram data: ", histogramData)

      // const urlTimeSeries = `${API_URL}/timeSeries/FOREIGNB`;
      // const timeSeriesResponse = await fetch(urlTimeSeries);
      // const timeSeriesOut = await timeSeriesResponse.json();
      // setTimeSeriesData(timeSeriesOut.msg);
      // console.log("time series data: ", timeSeriesData)

      // const urlDonut = `${API_URL}/donut/B07`;
      // const donutResponse = await fetch(urlDonut);
      // const donutOut = await donutResponse.json();
      // setdonutData(donutOut.msg);
      // console.log("donut data: ", donutData)

      const urlTable = `${API_URL}/table/B01`;
      const tableResponse = await fetch(urlTable);
      const tableOut = await tableResponse.json();
      setTableData(tableOut.msg);
      
    }

    getData();
  }, []);


  return (
    <>
        <Table
          data={tableData}
        /> 
        {/* <h3 style={{ marginBottom: "1px", marginLeft: "200px" }}>
          Respondent Age
        </h3> */}
        {/* <Histogram
          height ={600}
          width = {600}
          data = {histogramData}/> */}
        {/* <Map
          height ={770}
          width = {990}
        /> */}
      {/* <div style={{ marginTop: "100px", marginLeft: "200px", marginRight: "auto" }}> */}
        {/* <h3 style={{ marginBottom: "1px", marginLeft: "100px" }}>
          How well do you speak English?
        </h3> */}
        {/* <Donut
          data={donutData}
          width={500}
          height={500}
          innerRadius={150}
          outerRadius={200}
        /> */}
     {/* </div> */}
      {/* <h3 style={{ marginBottom: "1px", marginLeft: "200px" }}>
         Average Value per Year from 2009 to 2018
       </h3>
       <div style={{ marginBottom: "30px", marginLeft: "200px" }}> */}
     {/* <Line
      data={timeSeriesData}
      width={500}
      height={400}
      /> */}
       {/* </div> */}
    </>
  );
}

export default App;