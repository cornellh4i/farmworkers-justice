import {useEffect, useState} from "react";
import DataTable from 'react-data-table-component';
//import ReactDOM from "react-dom"


const API_URL = process.env.REACT_APP_API;
const columns = [
  {
      name: "Ethnicity",
      //selector: (row: { title: any; }) => row.title,
  },
  {
      name: "Percentage",
      //selector: (row: { year: any; }) => row.year,
  },
];
const table = [
  {
      id: 1,
      ethnicity: 'Mexican\American',
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
  const [test, setTest] = useState<Array<string>>([])
  
  useEffect(() => {
    async function getData() {
      const url = `${API_URL}/hello`;
      const response = await fetch(url);
      const data = await response.json();
      setData(data.msg);
      console.log(test);
      setTest(["hello"]);
    }
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
          //defaultSortField="ethnicity"
        />
    </>
  );
}

//const rootElement = document.getElementById("root");
//ReactDOM.render(<App />, rootElement);
export default App;
