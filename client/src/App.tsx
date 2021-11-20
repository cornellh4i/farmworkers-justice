import {useEffect, useState} from "react";
import DataTable from 'react-data-table-component';
// import ReactDOM from "react-dom"
import Histogram from '../src/charts/Histogram';
import * as d3 from "d3";
// require('react-dom');
// window.React2 = require('react');
// console.log(window.React1 === window.React2);


interface rowProp {
  id: number,
  ethnicity: string,
  percentage: string
}

const API_URL = process.env.REACT_APP_API;
const columns = [
  {
      name: "Ethnicity",
      selector: (row: rowProp) => row.ethnicity,
  },
  {
      name: "Percentage",
      selector: (row: rowProp) => row.percentage,
  },
];

const table = [
  {
      id: 1,
      ethnicity: 'Mexican\\American',
      percentage: "72% (182)",
  },
  {
      id: 2,
      ethnicity: 'Mexican',
      percentage: '72% (182)',
  },
  {
      id: 3,
      ethnicity: 'Chicano',
      percentage: '72% (182)',
  },
  {
      id: 4,
      ethnicity: 'Mexican',
      percentage: '72% (182)',
  },
  {
      id: 5,
      ethnicity: 'Other Hispanic',
      percentage: '72% (182)',
  },
  {
      id: 6,
      ethnicity: 'Puerto Rican',
      percentage: '72% (182)',
  },
  {
      id: 7,
      ethnicity: 'Not HIspanic or Latino',
      percentage: '72% (182)',
  }
  
]
function App() {
  const [data, setData] = useState("No data :(");
  const [test, setTest] = useState<Array<string>>([]);
  const [ageData, setAgeData] = useState<Array<number>>([]);
  

  useEffect(() => {
    async function getData() {
      const url = `${API_URL}/hello`;
      const response = await fetch(url);
      const data = await response.json();
      
      setData(data.msg);
      console.log(test);
      setTest(["hello"]);
      
    }
    let i : number;
    for (i = 0; i< 500; i ++){
      let age = d3.randomInt(1,100)()
      setAgeData(ageData => [...ageData,age]);
    };
    console.log(ageData);
    getData();
  }, []); 

  


  return (
    <>
      <h1>MERN App!</h1>
      <p>Data from server: {data} </p>
        
        <DataTable
          title="Ethnicity"
          columns= {columns}
          data={table}
        />
        <Histogram
          height ={500}
          width = {500}
          data = {ageData}/>
    </>
  );
}

export default App;