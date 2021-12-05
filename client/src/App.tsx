import {useEffect, useState} from "react";
import DataTable, {TableColumn} from 'react-data-table-component';
import Histogram from '../src/charts/Histogram';
import Map from '../src/charts/Map';

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
function App() {
  const [data, setData] = useState("No data :(");
  const [ageData, setAgeData] = useState<Array<number>>([]);
  const [tableData, setTableData] = useState<Array<rowProp>>([]);

  useEffect(() => {
    async function getData() {
      const url = `${API_URL}/hello`;
      const response = await fetch(url);
      const data = await response.json();
      
      setData(data.msg);
    }

    fetch(`${API_URL}/api/table/AGE`)
    .then(res => res.json())
    .then(data => {
      setAgeData(data);
    });

    fetch(`${API_URL}/api/table/B01`)
        .then(res => res.json())
        .then(data => {
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
            setTableData(tableData => [...tableData,d]);
        }
      })
        .catch(rejected => {
        }); 
    getData();
  }, []); 

  return (
    <>
      <p>Data from server: {data} </p>
        
        <DataTable
          title="Ethnicity"
          columns= {columns}
          data={tableData}
        />
        <Histogram
          height ={600}
          width = {600}
          data = {ageData}/>
        <Map
          height ={770}
          width = {990}
        />
    </>
  );
}

export default App;