import "@fontsource/rubik";
import './Dropdown.scss';
import { unmountComponentAtNode } from 'react-dom'
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
  const [visualizationType, setVisualizationType] = useState("")
  const [visualizationData, setVisualizationData] = useState<any>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<{ year: number, value: number }[]>([])
  const [VisualizationComponent , setVisualizationComponent] = useState(<></>);


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
        setVisualizationType(output.vizType)
        setVisualizationData(output.data)
        setTimeSeriesData(output.timeSeriesData)
        //TODO: RENDER TIME SERIES
        console.log("fetched data for variable ", props.variable, " : ", output.data)
        if (output.vizType === "histogram") {
          setVisualizationComponent(<Histogram categoryEncoding={props.index} variableEncoding={props.variable} data={output.data} />)
        } else if (output.vizType === "donut") {
          setVisualizationComponent(<Donut innerRadius={100} outerRadius={200} data={output.data} height={600} width={600} />)
        } else if (output.vizType === "table") {
          setVisualizationComponent(<DataTable data={output.data} />)
        } else if (output.vizType === "data") {
          setVisualizationComponent(<DataHighlight data={output.data} />)
        } else {
          console.log("visualization type not covered ")
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
    console.log("filter fetch url: ", url)
    getData(url)
    // unmountComponentAtNode(document.getElementById('#visualizationComponent')!)
  

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
                {props.variable}
                {VisualizationComponent}
                {/* {visualizationType === "histogram" ? 
                  <Histogram categoryEncoding={props.index} variableEncoding={props.variable} data={visualizationData} />
                  :
                  <>
                    {visualizationType === "donut" ? 
                      <Donut innerRadius={100} outerRadius={200} data={visualizationData} height={600} width={600} />
                      :
                      <>
                        {visualizationType === "table" ?
                          <DataTable data={visualizationData} />
                          :
                          <>
                            {visualizationType === "data" ?
                              <DataHighlight percentage={visualizationData.percentage} description={visualizationData.description}/>
                              :
                              null
                              }
                          </>
                        }
                      </>
                    }
                  </>
                } */}
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


