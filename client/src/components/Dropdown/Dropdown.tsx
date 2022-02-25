import { useState } from "react";
import "@fontsource/rubik";
import './Dropdown.scss';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';


interface DropdownProp {
  categoryIndex: number
  //variableEncoding: string
  dropdownOpen: boolean
  dropdownIndex: number
  categoryVariable: string
  encodings: string
  onCollapse: any
}
const API_URL = process.env.REACT_APP_API;


function CategoryCard(props: DropdownProp) {

  function onClickCustom() {
    props.onCollapse(props.dropdownIndex)
  }

  console.log(props.encodings)
  return (
    <div>
      <div className="dropdownContainer">
        <Grid container >
          <Grid item xs={9}>
            <ListItemButton onClick={onClickCustom}>
              <h4 className="variableHeader">
                {props.categoryVariable}
              </h4>
              {props.dropdownOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={props.dropdownOpen} timeout="auto" unmountOnExit>
              <div>
                {props.encodings}
              </div>
            </Collapse>
          </Grid>
        </Grid>

      </div >
    </div >
  )
}

export default CategoryCard;


