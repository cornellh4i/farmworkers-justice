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
  variableEncoding: string
  categoryVariable: string
}


function CategoryCard(props: DropdownProp) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="dropdownContainer">
        <Grid container >
          <Grid item xs={9}>
            <ListItemButton onClick={() => { setOpen(!open) }}>
              <h4 className="variableHeader">
                {props.categoryVariable}
                {console.log(props.categoryVariable)}</h4>
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <div >

              </div>
            </Collapse>
          </Grid>
        </Grid>

      </div >
    </div >
  )
}

export default CategoryCard;


