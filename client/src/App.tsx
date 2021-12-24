import { useEffect, useState, useRef } from "react";
import Histogram from '../src/charts/Histogram';
import Map from '../src/charts/Map';
import * as d3 from "d3";
import Line, { timeSeriesProp } from './charts/lineGraph'
import Donut from './charts/donutChart'
import Table from './charts/Table'
import { Button} from 'react-bootstrap';


const API_URL = process.env.REACT_APP_API;

function App() {
  const [tableData, setTableData] = useState<{}>({});
  const [histogramData, setHistogramData] = useState<Array<number>>([]);
  const [donutData, setdonutData] = useState<{}>({});
  const [FOREIGNBData, setFOREIGNBData] = useState<{}>({});
  const [timeSeriesData, setTimeSeriesData] = useState<Array<{}>>([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const urlTable = `${API_URL}/B01`;
    const tableResponse = await fetch(urlTable);
    const tableOut = await tableResponse.json();
    setTableData(tableOut.data);

    const urlHistogram = `${API_URL}/AGE`;
    const histogramResponse = await fetch(urlHistogram);
    const histogramOut = await histogramResponse.json();
    setHistogramData(histogramOut.data);

    const urlDonut = `${API_URL}/B07`;
    const donutResponse = await fetch(urlDonut);
    const donutOut = await donutResponse.json();
    setdonutData(donutOut.data);

    const urlFOREIGNB = `${API_URL}/FOREIGNB`;
    const FOREIGNBResponse = await fetch(urlFOREIGNB);
    const FOREIGNBOut = await FOREIGNBResponse.json();
    setFOREIGNBData(FOREIGNBOut.data);
    setTimeSeriesData(FOREIGNBOut.timeSeriesData)
  }

  return (
    <>
      <Table
        data={tableData}
      />
      <h3 style={{ marginBottom: "1px", marginLeft: "200px" }}>
        Respondent Age
      </h3>
      <Histogram
        height={600}
        width={600}
        data={histogramData} />
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
      </div>
      <Table
        data={FOREIGNBData}
      />
      <h3 style={{ marginBottom: "1px", marginLeft: "200px" }}>
        Average Value per Year from 2009 to 2018
      </h3>
      <div style={{ marginBottom: "30px", marginLeft: "200px" }}>
        <Line
          data={timeSeriesData}
          width={500}
          height={400}
        />
      </div>
    </>
  );
}

export default App;