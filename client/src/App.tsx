import { useEffect, useState } from "react";
import Histogram from '../src/charts/Histogram';
import Map from '../src/charts/Map';
import DataHighlight from '../src/charts/DataHighlight';
import * as d3 from "d3";
import Homepage from './components/Homepage/Homepage'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Donut from './charts/donutChart'
import Table from './charts/Table'
import LineGraph from './charts/lineGraph'
import { Button } from 'react-bootstrap';
import Minipage from './components/Minipage/Minipage'
import Line from './charts/lineGraph';


const API_URL = process.env.REACT_APP_API;

function App() {
  const [tableData, setTableData] = useState<{}>({});
  const [histogramData, setHistogramData] = useState<Array<number>>([]);
  const [donutData, setdonutData] = useState<{}>({});
  const [FLCData, setFLCData] = useState<{}>({});
  const [timeSeriesData, setTimeSeriesData] = useState<Array<{}>>([]);
  const [dataHighlightData, setDataHighlightData] = useState<{percentage: number, description: string}>({percentage: 0, description: ""});

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const urlHistogram = `${API_URL}/AGE`;
    const histogramResponse = await fetch(urlHistogram);
    const histogramOut = await histogramResponse.json();
    setHistogramData(histogramOut.data);

    //   const urlTable = `${API_URL}/B01`;
    //   const tableResponse = await fetch(urlTable);
    //   const tableOut = await tableResponse.json();
    //   setTableData(tableOut.data);

    //   const urlDonut = `${API_URL}/B07`;
    //   const donutResponse = await fetch(urlDonut);
    //   const donutOut = await donutResponse.json();
    //   setdonutData(donutOut.data);
    // 
    const urlFLC = `${API_URL}/NUMFEMPL`;
    const FLCResponse = await fetch(urlFLC);
    const FLCOut = await FLCResponse.json();
    setFLCData(FLCOut.data);
    setTimeSeriesData(FLCOut.timeSeriesData)

    const urlDataHighlight = `${API_URL}/FOREIGNB`;
    const DataHighlightResponse = await fetch(urlDataHighlight);
    const DataHighlightOut = await DataHighlightResponse.json();
    setDataHighlightData(DataHighlightOut.data);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/visualizations/:categoryEncoding" element={<Minipage />} />
        <Route path = "/linegraph" element = {<Line data = {timeSeriesData} width = {500} height = {500} categoryEncoding = {"8"} variableEncoding = {"G01"} variableDescription = {"What was your total income last year in USD?"}/>} />
        <Route path='/data' element={<DataHighlight percentage={dataHighlightData.percentage} description={dataHighlightData.description} />} />
        <Route path="histogram" element={<Histogram categoryEncoding={"2"} variableDescription={"In what year did you/they first enter the US to live or work? (if foreign-born)"} variableEncoding={"A08"} />} />
        {/* <Route path='/map' element={<Map regionEncoding={"1"} />} /> */}
        
        {/* <h3 style={{ marginBottom: "1px", marginLeft: "200px" }}>\
          Respondent Age
        </h3> 
      <Histogram
        height={600}
        width={600}
        data={histogramData} />
      <Table
        data={tableData}
      />
      <Map
        height={770}
        width={990}
      />
      <div style={{ marginTop: "100px", marginLeft: "200px", marginRight: "auto" }}>
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
        <Donut
          data={FLCData}
          width={500}
          height={500}
          innerRadius={150}
          outerRadius={200}
        />
      <div style={{ marginBottom: "30px", marginLeft: "200px" }}>
        <LineGraph
          data={timeSeriesData}
          width={500}
          height={400}
        />
      </div> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;