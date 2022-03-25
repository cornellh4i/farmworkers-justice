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
  mapFilterSelected : null | string
  setCurrentCollapseIndex: Function
  currentCollapseIndex: number | null
}


function Dropdown(props: DropdownProp) {
  const [collapse, setCollapse] = useState(false)

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
                {props.mapFilterSelected === null? null : <Map mapFilterSelected={props.mapFilterSelected} collapseIndex={props.currentCollapseIndex}/>}
              </div>
            </Collapse>
          </Grid>
        </Grid>

      </div >
    </div >
  )
}

export default Dropdown;


