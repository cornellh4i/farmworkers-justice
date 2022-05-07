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
import DataHighlight from './../../charts/DataHighlight'
import LineGraph from './../../charts/lineGraph'
import ColumnChart from './../../charts/columnChart'

interface DropdownProp {
  index: number
  variableDescription: string
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
  // const [visualizationType, setVisualizationType] = useState("")
  // const [visualizationData, setVisualizationData] = useState<any>(null)
  // const [timeSeriesData, setTimeSeriesData] = useState<{ year: number, value: number }[]>([])
  const [VisualizationComponent , setVisualizationComponent] = useState(<></>);
  const [TimeSeriesComponent , setTimeSeriesComponent] = useState(<></>);
  console.log("mapFilterSelected: ", props.mapFilterSelected)

  function onClickCollapse() {
    if (props.currentCollapseIndex === props.index) {
      setCollapse(false)
      props.setCurrentCollapseIndex(null)
    } else {
      setCollapse(true)
      props.setCurrentCollapseIndex(props.index)
    }
  }


  useEffect(() => {
    if (props.currentCollapseIndex !== props.index) {
      setCollapse(false);
    }
  }, [props.currentCollapseIndex])


  useEffect(() => {
    async function getData(url: string) {
      var response;
      var output: FetchedDataProps;
      try {
        response = await fetch(url);
        output = await response.json();
        // setVisualizationType(output.vizType)
        // setVisualizationData(output.data)
        // setTimeSeriesData(output.timeSeriesData)
        console.log("fetched data for variable ", props.variable, " : ", output.data)
        if (output.vizType === "histogram") {
          setVisualizationComponent(<Histogram key={props.index.toString()} index={props.index} variableEncoding={props.variable} data={output.data} />)
        } else if (output.vizType === "donut") {
          setVisualizationComponent(<Donut key={props.index.toString()} index={props.index} data={output.data} />)
        } else if (output.vizType === "table") {
          setVisualizationComponent(<DataTable key={props.index.toString()} data={output.data} />)
        } else if (output.vizType === "data") {
          setVisualizationComponent(<DataHighlight key={props.index.toString()} data={output.data} />)
        } else if (output.vizType === "column") {
          setVisualizationComponent(<ColumnChart key={props.index.toString()} data={output.data} />)
        } else {
          console.log("visualization type not covered ")
        }
        if (typeof output.timeSeriesData != 'undefined') {
          console.log("fetched timeseries data for variable ", props.variable, " : ", output.timeSeriesData)
          setTimeSeriesComponent(<LineGraph key={props.index.toString()} index={props.index} data={output.timeSeriesData} variableDescription={props.variableDescription} variableEncoding={props.variable}/>)
        } else {
          setTimeSeriesComponent(<></>)
        }
      } catch (error) {
        console.log("Failed to fetch: ", props.variable)
      }
    }

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
    getData(url)
  

  }, [props.filter1Selected, props.filter2Selected])


  return (
    <div>
      <div className="dropdownContainer">
        <Grid container >
          <Grid item xs={9}>
            <ListItemButton onClick={onClickCollapse}>
              <h4 className="variableHeader">
                {props.variableDescription}
              </h4>
              {collapse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={collapse} timeout="auto" mountOnEnter unmountOnExit>
              <div id="visualizationComponent">
                {/* {props.variable} */}
                {/* <Grid container> 
                  <Grid item xs ={9}> */}
                    {VisualizationComponent}
                  {/* </Grid>
                  <Grid item xs ={3}> */}
                    {/* {props.mapFilterSelected === null ? null : <Map key={props.index} mapFilterSelected={props.mapFilterSelected} />} */}
                  {/* </Grid>
                  <Grid item xs={12}>  */}
                    {TimeSeriesComponent}
                  {/* </Grid>
                </Grid> */}
              </div>
            </Collapse>
          </Grid>
        </Grid>
      </div >
    </div >
  )
}

export default Dropdown;


