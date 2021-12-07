import { useEffect, useState, useRef } from "react";
import Histogram from '../src/charts/Histogram';
import Map from '../src/charts/Map';
import * as d3 from "d3";
import Line, {timeSeriesProp} from './charts/lineGraph'
import Donut from './charts/donutChart'
import Table from './charts/Table'



const API_URL = process.env.REACT_APP_API;

function App() {
  // const [data, setData] = useState("No data :(");
  const [tableData, setTableData] = useState<{}>({});
  const [timeSeriesData, setTimeSeriesData] = useState<Array<[number, number]>>([]);
  const [donutData, setdonutData] = useState<{}>({});
  const [histogramData, setHistogramData] = useState<Array<number>>([]);

  useEffect(() => {
    async function getData() {
      // const url = `${API_URL}/hello`;
      // const response = await fetch(url);
      // const data = await response.json();
      // setData(data.msg);
      // console.log(data);

      const urlHistogram = `${API_URL}/histogram/AGE`;
      const histogramResponse = await fetch(urlHistogram);
      const histogramOut = await histogramResponse.json();
      setHistogramData(histogramOut.msg);
      // console.log("histogram data: ", histogramData)

      const urlTimeSeries = `${API_URL}/timeSeries/FOREIGNB`;
      const timeSeriesResponse = await fetch(urlTimeSeries);
      const timeSeriesOut = await timeSeriesResponse.json();
      setTimeSeriesData(timeSeriesOut.msg);
      console.log("time series data: ", timeSeriesData)
      // console.log("type of backend data: ", typeof timeSeriesOut.msg[0])


      const urlDonut = `${API_URL}/donut/B07`;
      const donutResponse = await fetch(urlDonut);
      const donutOut = await donutResponse.json();
      setdonutData(donutOut.msg);
      // console.log("donut data: ", donutData)

      const urlTable = `${API_URL}/table/B01`;
      const tableResponse = await fetch(urlTable);
      const tableOut = await tableResponse.json();
      console.log("table out msg: ", tableOut.msg)
      setTableData(tableOut.msg);
      console.log("table data: ", tableData)
      
    }

    // fetch(`${API_URL}/timeSeries/FOREIGNB`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setTimeSeriesData(data.msg);
    //     console.log("fetched data: ", data.msg)
    //   });
    
    // fetch(`${API_URL}/donut/B07`)
    // .then(res => res.json())
    // .then(data => {
    //   setdonutData(data);
    // });
    
    // fetch(`${API_URL}/histogram/AGE`)
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log("histogram data: ", data);
    //     setAgeData(data);
    //   });

  //   fetch(`${API_URL}/api/table/B01`)
  //     .then(res => res.json())
  //     .then(data => {
  //       let count: number = 0
  //       for (let key in data) {
  //         let value = dict[key]
  //         let d: rowProp = { id: 0, response_description: "", response: [0, 0] };
  //         d = {
  //           id: count,
  //           response_description: key,
  //           response: value
  //         };
  //         count++;
  //         setTableData(tableData => [...tableData, d]);
  //       }
  //     })
  //     .catch(rejected => {
  //     });
    getData();
  }, []);
  // console.log("outside useeffect")
  // console.log("histogram data: ", histogramData)
  // console.log("time series data: ", timeSeriesData)
  // console.log("donut data: ", donutData)




  // const generateData = (length = 5) =>
  //   d3.range(length).map((item, index) => ({
  //     date: index,
  //     value: item === null || item === undefined ? Math.random() * 100 : item
  //   }));

  // let dictionary1: { [year: number]: number } = {};

  // dictionary1[2009] = 50;
  // dictionary1[2010] = 75;
  // dictionary1[2011] = 25;
  // dictionary1[2012] = 150;
  // dictionary1[2013] = 100;
  // dictionary1[2014] = 50;
  // dictionary1[2015] = 25;
  // dictionary1[2016] = 125;
  // dictionary1[2017] = 300;
  // dictionary1[2018] = 105;

  // const dictionary3 = [{ year: 2009, value: 50 }, { year: 2010, value: 75 }, { year: 2011, value: 25 }, { year: 2012, value: 150 }
  //   , { year: 2013, value: 100 }, { year: 2014, value: 50 }, { year: 2015, value: 25 }, { year: 2016, value: 125 }, { year: 2017, value: 300 }
  //   , { year: 2018, value: 105 }];


  // const maxVal = dictionary3.reduce((op, item) => op = op > item.value ? op : item.value, 0);
  // const maxYear = dictionary3.reduce((op, item) => op = op > item.year ? op : item.year, 0);
  // const minVal = dictionary3.reduce((op, item) => op = op < item.value ? op : item.value, maxVal);

  // type donutDataProp = {
  //   year: number;
  //   value: number;
  // }

  // let dictionary2: { [key: number]: donutDataProp } = [];

  // dictionary2[0] = {
  //   year: 2009,
  //   value: 50
  // };
  // dictionary2[1] = {
  //   year: 2010,
  //   value: 75
  // };
  // dictionary2[2] = {
  //   year: 2011,
  //   value: 25
  // };
  // dictionary2[3] = {
  //   year: 2012,
  //   value: 150
  // };
  // dictionary2[4] = {
  //   year: 2013,
  //   value: 100
  // };
  // dictionary2[5] = {
  //   year: 2014,
  //   value: 50
  // };
  // dictionary2[6] = {
  //   year: 2015,
  //   value: 25
  // };
  // dictionary2[7] = {
  //   year: 2016,
  //   value: 125
  // };
  // dictionary2[8] = {
  //   year: 2017,
  //   value: 300
  // };
  // dictionary2[9] = {
  //   year: 2018,
  //   value: 105
  // };

  return (
    <>
    {/* <p>Data from server: {data}</p> */}
        {/* <Table
          data={tableData}
        />  */}
        <h3 style={{ marginBottom: "1px", marginLeft: "200px" }}>
          Respondent Age
        </h3>
        <Histogram
          height ={600}
          width = {600}
          data = {histogramData}/>
        <Map
          height ={770}
          width = {990}
        />
      {/* <div style={{ marginTop: "100px", marginLeft: "200px", marginRight: "auto" }}> */}
        <h3 style={{ marginBottom: "1px", marginLeft: "100px" }}>
          How well do you speak English?
        </h3>
        <Donut
          data={donutData}
          width={500}
          height={500}
          innerRadius={150}
          outerRadius={200}
        />
     {/* </div> */}
      {/* <h3 style={{ marginBottom: "1px", marginLeft: "200px" }}>
         Average Value per Year from 2009 to 2018
       </h3>
       <div style={{ marginBottom: "30px", marginLeft: "200px" }}> */}
    {/* <Line
      data={timeSeriesData}
      width={500}
      height={400}
      // width={Object.keys(timeSeriesData).length*50}
      // height={Math.ceil(maxVal / 10) * 10} 
      // height={maxVal} 
      /> */}
       {/* </div> */}
    </>
  );
}

export default App;