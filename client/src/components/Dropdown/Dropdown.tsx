import "@fontsource/rubik";
import './Dropdown.scss';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Map from './../../charts/Map';
import { useEffect, useState } from 'react';
import Histogram from './../../charts/Histogram';
import Donut from './../../charts/donutChart'
import DataTable from './../../charts/Table'


interface DropdownProp {
  index: number
  categoryVariable: string
  variable: string
  mapFilterSelected: null | string
  setCurrentCollapseIndex: Function
  currentCollapseIndex: number | null
  filter1Selected: null | string[]
  filter2Selected: null | string[]
}

interface FetchedDataProps {
  data: any,
  vizType: string,
  timeSeriesData: { year: number, value: number }[]
}

interface FilterEncodingProp {
  "filter-encoding": number,
  "filter-value": string
}

const API_URL = process.env.REACT_APP_API;
const filterEncodings = require("./../../local-json/filterEncoding.json")


function Dropdown(props: DropdownProp) {
  const [collapse, setCollapse] = useState(false)
  const [visualizationType, setVisualizationType] = useState("")
  const [visualizationData, setVisualizationData] = useState<any>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<{ year: number, value: number }[]>([])


  function onClickCollapse() {
    if (props.currentCollapseIndex === props.index) {
      setCollapse(false)
      props.setCurrentCollapseIndex(null)
    } else {
      setCollapse(true)
      props.setCurrentCollapseIndex(props.index)
    }
  }

  async function getData(url: string) {
    var response;
    var output: FetchedDataProps;
    try {
      response = await fetch(url);
      output = await response.json();
      setVisualizationType(output.vizType)
      setVisualizationData(output.data)
      setTimeSeriesData(output.timeSeriesData)
      //getVisualization(visualizationType, visualizationData)
      //console.log("Variable: ", props.variable)
      //console.log("fetched data: ", output.data)
      console.log("viz type: ", visualizationType)
    } catch (error) {
      console.log("Failed to fetch: ", props.variable)
    }
  }

  useEffect(() => {
    if (props.currentCollapseIndex !== props.index) {
      setCollapse(false);
    }

  }, [props.currentCollapseIndex])

  // TODO: GET DATA AFTER THE FIRST RENDER (IT'S NOW ONLY FETCHING WHEN FILTER CHANGES)
  useEffect(() => {
    const url = `${API_URL}/${props.variable}`;
    getData(url)
  }, [])

  useEffect(() => {
    var url;
    if (props.filter1Selected === null && props.filter2Selected === null) {
      url = `${API_URL}/${props.variable}`;
    } else if (props.filter2Selected === null) {
      const filterEncoding = filterEncodings[props.filter1Selected![1]].find((el: FilterEncodingProp) =>
        el["filter-value"] === props.filter1Selected![0])["filter-encoding"];
      url = `${API_URL}/${props.variable}/${props.filter1Selected![1]}/${filterEncoding}`;
    } else {
      const filter1Encoding = filterEncodings[props.filter1Selected![1]].find((el: FilterEncodingProp) =>
        el["filter-value"] === props.filter1Selected![0])["filter-encoding"];
      const filter2Encoding = filterEncodings[props.filter2Selected![1]].find((el: FilterEncodingProp) =>
        el["filter-value"] === props.filter2Selected![0])["filter-encoding"];
      url = `${API_URL}/${props.variable}/${props.filter1Selected![1]}/${filter1Encoding}/${props.filter2Selected[1]}/${filter2Encoding}`;
    }
    console.log("url: ", url)
    getData(url)
  }, [props.filter1Selected, props.filter2Selected])

  function getVisualization() {
    // fetch does work, just takes close to a minute to fetch all the viz types and load all the data, hist still looks funky
    const url = `${API_URL}/${props.variable}`;
    getData(url)
    console.log("viz type: ", visualizationType)
    if (visualizationType == "histogram") {
      return <Histogram categoryEncoding={props.index} variableEncoding={props.variable} variableDescription={props.categoryVariable} />;
    }
    //histogram: in what year did you/
    if (visualizationType == "donut") {
      return <Donut innerRadius={200} outerRadius={300} data={visualizationData} height={600} width={600} />
    }
    if (visualizationType == "table") { //issue: cannot pass in props for id, other stuff, only tableprops not row props 

      // let tableData: DataTable.rowProp = {
      //   id = props.index;
      //   response_description= props.categoryVariable;
      //   //response = ? [number, number]
      // }
      return <DataTable data={visualizationData} />
    }
    // data? 
  }

  //for hist: 
  //variable - encoding 
  //cateogyrvari - description 
  //index - categoryencoding 

  return (
    <div>
      <div className="dropdownContainer">
        <Grid container >
          <Grid item xs={9}>
            <ListItemButton onClick={onClickCollapse}>
              <h4 className="variableHeader">
                {props.categoryVariable}
              </h4>
              {collapse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={collapse} timeout="auto" unmountOnExit>
              <div>
                {props.variable}
                {/* {<Histogram categoryEncoding={props.index} variableEncoding={props.variable} variableDescription={props.categoryVariable} />} */}
                {getVisualization()}
                {props.mapFilterSelected === null ? null : <Map mapFilterSelected={props.mapFilterSelected} collapseIndex={props.currentCollapseIndex} />}
              </div>
            </Collapse>
          </Grid>
        </Grid>

      </div >
    </div >
  )
}

export default Dropdown;


