import { useEffect, useState } from "react";
import * as d3 from "d3";
import Line from './lineGraph'
import Donut from './donutChart'
const API_URL = process.env.REACT_APP_API;

function App() {
  const [data, setData1] = useState("No data :(");

  useEffect(() => {
    async function getData() {
      const url = `${API_URL}/api/timeSeries/FOREIGNB`;
      const response = await fetch(url);
      const data = await response.json();
      setData1(data.msg);
    }
    getData();
  }, []);

  const generateData = (length = 5) =>
    d3.range(length).map((item, index) => ({
      date: index,
      value: item === null || item === undefined ? Math.random() * 100 : item
    }));

  let dictionary1: { [year: number]: number } = {};

  dictionary1[2009] = 50;
  dictionary1[2010] = 75;
  dictionary1[2011] = 25;
  dictionary1[2012] = 150;
  dictionary1[2013] = 100;
  dictionary1[2014] = 50;
  dictionary1[2015] = 25;
  dictionary1[2016] = 125;
  dictionary1[2017] = 300;
  dictionary1[2018] = 105;

  type donutData = {
    year: number;
    value: number;
  }

  let dictionary2: { [key: number]: donutData } = [];

  dictionary2[0] = {
    year: 2009,
    value: 50
  };
  dictionary2[1] = {
    year: 2010,
    value: 75
  };
  dictionary2[2] = {
    year: 2011,
    value: 25
  };
  dictionary2[3] = {
    year: 2012,
    value: 150
  };
  dictionary2[4] = {
    year: 2013,
    value: 100
  };
  dictionary2[5] = {
    year: 2014,
    value: 50
  };
  dictionary2[6] = {
    year: 2015,
    value: 25
  };
  dictionary2[7] = {
    year: 2016,
    value: 125
  };
  dictionary2[8] = {
    year: 2017,
    value: 300
  };
  dictionary2[9] = {
    year: 2018,
    value: 105
  };
  
  //const [data1, setData2] = useState(generateData());

  return (
    <>
      <h1>MERN App!</h1>
      <p>Data from server: {data}</p>
      <div style={{ marginTop: "100px", marginLeft: "200px", marginRight: "auto" }}>
        <Donut
          data={[100, 100, 200]}
          width={500}
          height={500}
          innerRadius={150}
          outerRadius={200}
        />
      </div>
      <p>Data from server: {Object.keys(dictionary2).length}</p>
      <p>Data from server: {dictionary2[4].value}</p>
      <p>Data from server: {Object.keys(dictionary1)[1]}</p>
      <div style={{ marginBottom: "100px", marginLeft: "200px" }}>
        <Line
          data={data}
          width={500}
          height={400} />
      </div>
    </>
  );
}

export default App;
