import { useState } from "react";
import * as React from 'react';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import './FilterPanel.scss'
import { propsToClassKey } from "@mui/styles";

const FilterEnum = {
  GENDER: "GENDER",
  CURRSTAT: "CURRSTAT",
  FLC: "FLC",
  REGION6: "REGION6"
}

interface FilterPanelProps {
  setMapFilterSelected: Function
}

function FilterPanel(props: FilterPanelProps) {
  const [gender, setGender] = useState('');
  const [currstat, setCurrStat] = useState('');
  const [flc, setFlc] = useState('');
  const [region6, setRegion6] = useState('');


  // filter1 and filter2 states are in the form of [filter value, filter name]
  const [filter1, setFilter1] = useState<null | string[]>(null);
  const [filter2, setFilter2] = useState<null | string[]>(null);

  function handleFilterChange(filterName: string, event: { target: { value: string; } }) {
    if (filterName === FilterEnum.GENDER) {
      setGender(event.target.value);
    } else if (filterName === FilterEnum.CURRSTAT) {
      setCurrStat(event.target.value);
    } else if (filterName === FilterEnum.FLC) {
      setFlc(event.target.value);
    } else if (filterName === FilterEnum.REGION6) {
      setRegion6(event.target.value);
      props.setMapFilterSelected(event.target.value);
    }

    if (filter1 === null || filter1[1] === filterName) {
      setFilter1([event.target.value, filterName]);
    } else if (filter2 === null || filter2[1] === filterName) {
      setFilter2([event.target.value, filterName]);
    }
  };

  function handleDeleteFilter1() {
    if (filter1![1] === FilterEnum.GENDER) {
      setGender('');
    } else if (filter1![1] === FilterEnum.CURRSTAT) {
      setCurrStat('');
    } else if (filter1![1] === FilterEnum.FLC) {
      setFlc('');
    } else if (filter1![1] === FilterEnum.REGION6) {
      setRegion6('');
      props.setMapFilterSelected(null);
    }

    if (filter2 !== null) {
      setFilter1(filter2);
      setFilter2(null);
    } else {
      setFilter1(null);
    }
  };

  function handleDeleteFilter2() {
    if (filter2![1] === FilterEnum.GENDER) {
      setGender('');
    } else if (filter2![1] === FilterEnum.CURRSTAT) {
      setCurrStat('');
    } else if (filter2![1] === FilterEnum.FLC) {
      setFlc('');
    } else if (filter2![1] === FilterEnum.REGION6) {
      setRegion6('');
      props.setMapFilterSelected(null);
    }
    setFilter2(null);
  };

  return (

    <div className="filter-panel-container">

      <Grid container spacing={1} flexGrow={1}>
        <Grid item md={1} sm={2} xs={2}>
          <FormControl fullWidth>
            <InputLabel id="gender-select-label">Gender</InputLabel>
            <Select
              className="test"
              labelId="gender-select-label"
              id="gender-select"
              value={gender}
              label="Gender"
              onChange={(e) => handleFilterChange(FilterEnum.GENDER, e)}
              disabled={(filter1 !== null && filter2 !== null && filter1[1] !== FilterEnum.GENDER && filter2[1] !== FilterEnum.GENDER)}
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2} sm={4} xs={4}>
          <FormControl fullWidth>
            <InputLabel id="currstat-select-label">Work Authorization Status</InputLabel>
            <Select
              labelId="currstat-select-label"
              id="currstat-select"
              value={currstat}
              label="Work Authorization Status"
              onChange={(e) => handleFilterChange(FilterEnum.CURRSTAT, e)}
              disabled={(filter1 !== null && filter2 !== null && filter1[1] !== FilterEnum.CURRSTAT && filter2[1] !== FilterEnum.CURRSTAT)}
            >
              <MenuItem value={"Citizen"}>Citizen</MenuItem>
              <MenuItem value={"Green Card"}>Green Card</MenuItem>
              <MenuItem value={"Other Work Authorization"}>Other Work Authorization</MenuItem>
              <MenuItem value={"Unauthorized"}>Unauthorized</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2} sm={4} xs={4}>
          <FormControl fullWidth>
            <InputLabel id="flc-select-label">Employer</InputLabel>
            <Select
              labelId="flc-select-label"
              id="flc-select"
              value={flc}
              label="Employer"
              onChange={(e) => handleFilterChange(FilterEnum.FLC, e)}
              disabled={(filter1 !== null && filter2 !== null && filter1[1] !== FilterEnum.FLC && filter2[1] !== FilterEnum.FLC)}
            >
              <MenuItem value={"Grower/Nurs./Packh/Oth"}>Grower/Nurs./Packh/Oth</MenuItem>
              <MenuItem value={"Farm-labor Contractor"}>Farm-labor Contractor</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={1} sm={2} xs={2}>
          <FormControl fullWidth>
            <InputLabel id="region6-select-label">Region</InputLabel>
            <Select
              labelId="region6-select-label"
              id="region6-select"
              value={region6}
              label="Region"
              onChange={(e) => handleFilterChange(FilterEnum.REGION6, e)}
              disabled={(filter1 !== null && filter2 !== null && filter1[1] !== FilterEnum.REGION6 && filter2[1] !== FilterEnum.REGION6)}
            >
              <MenuItem value={"East"}>East</MenuItem>
              <MenuItem value={"South East"}>South East</MenuItem>
              <MenuItem value={"Midwest"}>Midwest</MenuItem>
              <MenuItem value={"South West"}>South West</MenuItem>
              <MenuItem value={"North West"}>North West</MenuItem>
              <MenuItem value={"California"}>California</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>



      < div className="chip">
        <h3 className="filter-applied-text">Filters applied:</h3>
        {filter1 === null ?
          null :
          <Stack direction="row" spacing={1} sx={{ marginRight: '1rem' }}>
            <Chip label={filter1[0]} onDelete={handleDeleteFilter1} sx={{ backgroundColor: '#D2E0F1' }} />
          </Stack>
        }
        {filter2 === null ?
          null :
          <Stack direction="row" spacing={1} >
            <Chip label={filter2[0]} onDelete={handleDeleteFilter2} sx={{ backgroundColor: '#FFD999' }} />
          </Stack>
        }
      </div>
    </div>




  )
}

export default FilterPanel;