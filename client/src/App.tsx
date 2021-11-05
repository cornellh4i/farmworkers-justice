import {useEffect, useState} from "react";
const API_URL = process.env.REACT_APP_API;

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
      <p>Data from server: {data}</p>
    </>
  );
}

export default App;
