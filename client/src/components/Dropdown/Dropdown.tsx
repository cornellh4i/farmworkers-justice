import "@fontsource/rubik";
import './Dropdown.scss';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import Histogram from './../../charts/Histogram';
import Donut from './../../charts/donutChart'
import DataTable from './../../charts/Table'
import DataHighlight from './../../charts/DataHighlight'
import LineGraph from './../../charts/lineGraph'
import ColumnChart from './../../charts/columnChart'
import domtoimage from 'dom-to-image';

interface DropdownProp {
  index: number
  variableDescription: string
  variable: string
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
  const [VisualizationComponent , setVisualizationComponent] = useState(<></>);
  const [TimeSeriesComponent , setTimeSeriesComponent] = useState(<></>);

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

  async function handleDownload(event: any) {
    event.preventDefault();

    var node = document.getElementById("visualizationComponent")!;
    domtoimage.toJpeg(node, {bgcolor: "white"})
      .then(function (dataUrl: any) {
        var link = document.createElement('a');
        link.download = `${props.variableDescription}.jpeg`;
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error: Error) {
        console.error("Something went wrong!", error);
      })
  }

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
                {props.variable}
                {VisualizationComponent}
                {TimeSeriesComponent}
              </div>
              <Button 
                variant="contained" 
                onClick={handleDownload}
                sx={{ 
                  backgroundColor: '#FFB83F', 
                  margin: '1rem', 
                  '&:hover': {
                    backgroundColor: '#FFB83F',
                    opacity: 0.6}
                  }}
              > 
                Download Chart
              </Button>
            </Collapse>
          </Grid>
        </Grid>
      </div >
    </div >
  )
}

export default Dropdown;


