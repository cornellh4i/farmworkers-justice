import "@fontsource/rubik";
import './Dropdown.scss';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Map from './../../charts/Map';
import { useEffect, useState } from 'react';


interface DropdownProp {
  index: number
  categoryVariable: string
  encoding: string
  mapFilterSelected: null | string
  setCurrentCollapseIndex: Function
  currentCollapseIndex: number | null
  filter1Selected: null | string[]
  filter2Selected: null | string[]
}

interface FetchedDataProps {
  data: any, 
  vizType: string, 
  timeSeriesData: {year: number, value: number}[] 
}

const API_URL = process.env.REACT_APP_API;

function Dropdown(props: DropdownProp) {
  const [collapse, setCollapse] = useState(false)
  const [visualizationType, setVisualizationType] = useState("")
  const [visualizationData, setVisualizationData] = useState<any>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<{year: number, value: number}[]>([])


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
    const response = await fetch(url);
    const output: FetchedDataProps = await response.json();
    setVisualizationType(output.vizType)
    setVisualizationData(output.data)
    setTimeSeriesData(output.timeSeriesData)

    console.log("fetched data: ", output.data)

    return output
  }

  useEffect(() => {
    if (props.currentCollapseIndex !== props.index) {
      setCollapse(false);
    }

  }, [props.currentCollapseIndex])

  useEffect(() => {
    var url;
    if (props.filter1Selected === null && props.filter2Selected === null) {
      url = `${API_URL}/${props.encoding}`;
    } else if (props.filter2Selected === null) {
      url = `${API_URL}/${props.encoding}/${props.filter1Selected![1]}/${props.filter1Selected![0]}`;
    } else {
      url = `${API_URL}/${props.encoding}/${props.filter1Selected![1]}/${props.filter1Selected![0]}/${props.filter2Selected[1]}/${props.filter2Selected[0]}}`;
    }
    console.log("url: ", url)
    getData(url)
  }, [props.filter1Selected, props.filter2Selected])


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
                {props.encoding}
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


