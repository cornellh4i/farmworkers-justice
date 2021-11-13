import { useEffect, useState } from "react";
import Line from './lineGraph'
import Donut from './donutChart'
const API_URL = process.env.REACT_APP_API;

function App() {
  const [data, setData] = useState("No data :(");

  useEffect(() => {
    async function getData() {
      const url = `${API_URL}/hello`;
      const response = await fetch(url);
      const data = await response.json();
      setData(data.msg);
    }
    getData();
  }, []);

  const generateData = (length = 5) =>
    d3.range(length).map((item, index) => ({
      date: index,
      value: item === null || item === undefined ? Math.random() * 100 : item
    }));

  const [data1, setData] = useState(generateData());

  return (
    <>
      <h1>MERN App!</h1>
      <p>Data from server: {data}</p>
      <div style={{ marginTop: "100px", marginLeft: "auto", marginRight: "auto" }}>
        <Donut
          data={data1}
          width={500}
          height={500}
          innerRadius={150}
          outerRadius={200}
        />
      </div>
      <div style={{ marginBottom: "100px" }}>
        <Line
          data={[50, 75, 25, 150, 100, 50, 25, 125, 300, 105]}
          width={500}
          height={400} />
      </div>
    </>
  );
}

export default App;
