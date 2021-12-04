import {useEffect, useState} from "react";
import DataTable, {TableColumn} from 'react-data-table-component';
import Histogram from '../src/charts/Histogram';
import * as d3 from "d3";

type rowProp = {
  id: number,
  response_description: string,
  response: [number, number]
}

const API_URL = process.env.REACT_APP_API;
const dict : { [key: string]: [number, number]} = {};
const columns : TableColumn<rowProp>[] = [
  {
    name: "Ethnicity",
    selector: row => row.response_description
  }, 
  {
    name: "Percentage",
    selector: row => row.response.toString()
  }
];
let table : rowProp[] = [];
function App() {
  const [data, setData] = useState("No data :(");
  const [test, setTest] = useState<Array<string>>([]);
  const [ageData, setAgeData] = useState<Array<number>>([]);
  const [tableData, setTableData] = useState<Array<rowProp>>([]);


  useEffect(() => {
    async function getData() {
      const url = `${API_URL}/hello`;
      const response = await fetch(url);
      const data = await response.json();
      
      setData(data.msg);
      console.log(test);
      setTest(["hello"]);
    }

    fetch(`${API_URL}/api/table/AGE`)
    .then(res => res.json())
    .then(data => {
      setAgeData(data);
    });

    fetch(`${API_URL}/api/table/B01`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          let count : number = 0
          for (let key in data) {
            let value = dict[key]
            let d : rowProp = {id: 0, response_description: "", response: [0, 0]};
            d = {
              id: count,
              response_description: key, 
              response: value
            };
            count++;
            console.log(d)
            table.push(d);
            setTableData(table);
        }
      })
        .catch(rejected => {
            console.log(rejected);   
        }); 
    getData();
  }, []); 

  return (
    <>
      <h1>MERN App!</h1>
      <p>Data from server: {data} </p>
        
        <DataTable
          title="Ethnicity"
          columns= {columns}
          data={tableData}
        />
        <Histogram
          height ={500}
          width = {500}
          data = {ageData}/>
    </>
  );
}

export default App;