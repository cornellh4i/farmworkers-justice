import { useState } from "react";
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import './FilterPanel.scss'

const FilterEnum = {
  GENDER: "GENDER",
  CURRSTAT: "currstat",
  FLC: "FLC",
  REGION6: "REGION6"
}

interface FilterPanelProps {
  mapFilterSelected: null | string
  setMapFilterSelected: Function
  filter1Selected: null | string[]
  setFilter1Selected: Function
  filter2Selected: null | string[]
  setFilter2Selected: Function
}

function FilterPanel(props: FilterPanelProps) {
  const [gender, setGender] = useState('');
  const [currstat, setCurrStat] = useState('');
  const [flc, setFlc] = useState('');
  const [region6, setRegion6] = useState('');


  // filter1 and filter2 states are in the form of [filter value, filter name]
  // const [filter1, setFilter1] = useState<null | string[]>(null);
  // const [filter2, setFilter2] = useState<null | string[]>(null);

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

    if (props.filter1Selected === null || props.filter1Selected[1] === filterName) {
      props.setFilter1Selected([event.target.value, filterName]);
    } else if (props.filter2Selected === null || props.filter2Selected[1] === filterName) {
      props.setFilter2Selected([event.target.value, filterName]);
    }
  };

  function handleDeleteFilter1() {
    if (props.filter1Selected![1] === FilterEnum.GENDER) {
      setGender('');
    } else if (props.filter1Selected![1] === FilterEnum.CURRSTAT) {
      setCurrStat('');
    } else if (props.filter1Selected![1] === FilterEnum.FLC) {
      setFlc('');
    } else if (props.filter1Selected![1] === FilterEnum.REGION6) {
      setRegion6('');
      props.setMapFilterSelected(null);
    }

    if (props.filter2Selected !== null) {
      props.setFilter1Selected(props.filter2Selected);
      props.setFilter2Selected(null);
    } else {
      props.setFilter1Selected(null);
    }
  };

  function handleDeleteFilter2() {
    if (props.filter2Selected![1] === FilterEnum.GENDER) {
      setGender('');
    } else if (props.filter2Selected![1] === FilterEnum.CURRSTAT) {
      setCurrStat('');
    } else if (props.filter2Selected![1] === FilterEnum.FLC) {
      setFlc('');
    } else if (props.filter2Selected![1] === FilterEnum.REGION6) {
      setRegion6('');
      props.setMapFilterSelected(null);
    }
    props.setFilter2Selected(null);
  };

  return (

    <div className="filter-panel-container">

      <Grid container spacing={1} flexGrow={1}>
        <Grid item xs={2}>

          <FormControl fullWidth>
            <InputLabel id="gender-select-label">Gender</InputLabel>
            <Select
              className="test"
              labelId="gender-select-label"
              id="gender-select"
              value={gender}
              label="Gender"
              onChange={(e) => handleFilterChange(FilterEnum.GENDER, e)}
              disabled={(props.filter1Selected !== null && props.filter2Selected !== null && props.filter1Selected[1] !== FilterEnum.GENDER && props.filter2Selected[1] !== FilterEnum.GENDER)}
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id="currstat-select-label">Work Authorization Status</InputLabel>
            <Select
              labelId="currstat-select-label"
              id="currstat-select"
              value={currstat}
              label="Work Authorization Status"
              onChange={(e) => handleFilterChange(FilterEnum.CURRSTAT, e)}
              disabled={(props.filter1Selected !== null && props.filter2Selected !== null && props.filter1Selected[1] !== FilterEnum.CURRSTAT && props.filter2Selected[1] !== FilterEnum.CURRSTAT)}
            >
              <MenuItem value={"Citizen"}>Citizen</MenuItem>
              <MenuItem value={"Green Card"}>Green Card</MenuItem>
              <MenuItem value={"Other Work Authorization"}>Other Work Authorization</MenuItem>
              <MenuItem value={"Unauthorized"}>Unauthorized</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id="flc-select-label">Employer</InputLabel>
            <Select
              labelId="flc-select-label"
              id="flc-select"
              value={flc}
              label="Employer"
              onChange={(e) => handleFilterChange(FilterEnum.FLC, e)}
              disabled={(props.filter1Selected !== null && props.filter2Selected !== null && props.filter1Selected[1] !== FilterEnum.FLC && props.filter2Selected[1] !== FilterEnum.FLC)}
            >
              <MenuItem value={"Grower/Nurs./Packh/Oth"}>Grower/Nurs./Packh/Oth</MenuItem>
              <MenuItem value={"Farm-labor Contractor"}>Farm-labor Contractor</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel id="region6-select-label">Region</InputLabel>
            <Select
              labelId="region6-select-label"
              id="region6-select"
              value={region6}
              label="Region"
              onChange={(e) => handleFilterChange(FilterEnum.REGION6, e)}
              disabled={(props.filter1Selected !== null && props.filter2Selected !== null && props.filter1Selected[1] !== FilterEnum.REGION6 && props.filter2Selected[1] !== FilterEnum.REGION6)}
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
        {props.filter1Selected === null ?
          null :
          <Stack direction="row" spacing={1} sx={{ marginRight: '1rem' }}>
            <Chip label={props.filter1Selected[0]} onDelete={handleDeleteFilter1} sx={{ backgroundColor: '#D2E0F1' }} />
          </Stack>
        }
        {props.filter2Selected === null ?
          null :
          <Stack direction="row" spacing={1} >
            <Chip label={props.filter2Selected[0]} onDelete={handleDeleteFilter2} sx={{ backgroundColor: '#FFD999' }} />
          </Stack>
        }
      </div>
    </div>
  )
}

export default FilterPanel;