import { useEffect, useState } from "react";
import Histogram from '../src/charts/Histogram';
import Map from '../src/charts/Map';
import DataHighlight from '../src/charts/DataHighlight';
import Homepage from './components/Homepage/Homepage'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Donut from './charts/donutChart'
import Table from './charts/Table'


import LineGraph from './charts/lineGraph'
import Minipage from './components/Minipage/Minipage'
import AdminLanding from './components/AdminLanding/AdminLanding'
import AdminUpload from "./components/AdminUpload/AdminUpload";
import DonutChart from "./charts/donutChart";
import Line from './charts/lineGraph';
import ColumnChart from "./charts/columnChart";

const API_URL = process.env.REACT_APP_API;
const LATEST_ODD_YEAR = 2017;
const LATEST_EVEN_YEAR = 2018;


function App() {
  const [tableData, setTableData] = useState<{}>({});
  const [histogramData, setHistogramData] = useState<Array<number>>([]);
  const [donutData, setdonutData] = useState<{}>({});
  const [FLCData, setFLCData] = useState<{}>({});
  const [timeSeriesData, setTimeSeriesData] = useState<Array<{}>>([]);
  const [dataHighlightData, setDataHighlightData] = useState<{ percentage: number, description: string }>({ percentage: 0, description: "" });
  const [token, setToken] = useState("");

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const urlHistogram = `${API_URL}/A08`;
    const histogramResponse = await fetch(urlHistogram);
    const histogramOut = await histogramResponse.json();
    setHistogramData(histogramOut.data);

    const urlTable = `${API_URL}/B01`;
    const tableResponse = await fetch(urlTable);
    const tableOut = await tableResponse.json();
    setTableData(tableOut.data);

    const urlDonut = `${API_URL}/STREAMS`;
    const donutResponse = await fetch(urlDonut);
    const donutOut = await donutResponse.json();
    setdonutData(donutOut.data);
    
    const urlFLC = `${API_URL}/NUMFEMPL`;
    const FLCResponse = await fetch(urlFLC);
    const FLCOut = await FLCResponse.json();
    setFLCData(FLCOut.data);
    setTimeSeriesData(FLCOut.timeSeriesData)

    const urlDataHighlight = `${API_URL}/Indigenous`;
    const DataHighlightResponse = await fetch(urlDataHighlight);
    const DataHighlightOut = await DataHighlightResponse.json();
    setDataHighlightData(DataHighlightOut.data);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/visualizations/:categoryEncoding" element={<Minipage />} />
        <Route path="/linegraph" element={<Line data={timeSeriesData} variableEncoding={"G01"} variableDescription={"What was your total income last year in USD?"} />} />
        <Route path='/data' element={<DataHighlight data={dataHighlightData} />} />
        <Route path="histogram" element={<Histogram data={histogramData} variableEncoding={"A08"} index={0} />} />
        <Route path="/admin" element={<AdminLanding setToken={setToken} />} />
        <Route path="/adminUpload" element={<AdminUpload token={token}/>} />
        <Route path="columnChart" element={<ColumnChart/>} />
        <Route path='/table' element={<Table data={tableData} />} />
        <Route path='/donut' element={<DonutChart data={donutData} index={2}/>} />
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