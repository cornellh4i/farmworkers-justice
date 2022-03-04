import { useState } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

function FilterPanel() {
  const [gender, setGender] = React.useState('');
  const [currstat, setCurrStat] = React.useState('');
  const [flc, setFlc] = React.useState('');
  const [region6, setRegion6] = React.useState('');

  const [filter, setFilter] = React.useState<null | string>(null);

  const handleGenderChange = (event: { target: { value: string; }; }) => {
    console.log(event.target.value);
    setGender(event.target.value);
    setFilter(event.target.value);
  };
  const handleCurrStatChange = (event: { target: { value: string; }; }) => {
    setCurrStat(event.target.value);
    setFilter(event.target.value);
  };
  const handleFlcChange = (event: { target: { value: string; }; }) => {
    setFlc(event.target.value);
    setFilter(event.target.value);
  };
  const handleRegion6Change = (event: { target: { value: string; }; }) => {
    setRegion6(event.target.value);
    setFilter(event.target.value);
  };

    function handleDelete(){
      setFilter(null);
      setGender('');
      setCurrStat('');
      setFlc('');
      setRegion6('');


    };

  return (
    <div>
      <Box sx={{ width: 1 / 12 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Gender</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={gender}
            label="Gender"
            onChange={handleGenderChange}
          >
            <MenuItem value={"Male"}>Male</MenuItem>
            <MenuItem value={"Female"}>Female</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: 1 / 6 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Work Authorization Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currstat}
            label="Work Authorization Status"
            onChange={handleCurrStatChange}
          >
            <MenuItem value={"Citizen"}>Citizen</MenuItem>
            <MenuItem value={"Green Card"}>Green Card</MenuItem>
            <MenuItem value={"Other Work Authorization"}>Other Work Authorization</MenuItem>
            <MenuItem value={"Unauthorized"}>Unauthorized</MenuItem>

          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: 1 / 12 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Employer</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={flc}
            label="Employer"
            onChange={handleFlcChange}
          >
            <MenuItem value={"Grower/Nurs./Packh/Oth"}>Grower/Nurs./Packh/Oth</MenuItem>
            <MenuItem value={"Farm-labor Contractor"}>Farm-labor Contractor</MenuItem>

          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: 1 / 12 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Region</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={region6}
            label="Region"
            onChange={handleRegion6Change}
          >

            <MenuItem value={"East"}>East</MenuItem>
            <MenuItem value={"South East"}>South East</MenuItem>
            <MenuItem value={"Midwest"}>Midwest</MenuItem>
            <MenuItem value={"South West"}>South West</MenuItem>
            <MenuItem value={"North West"}>North West</MenuItem>
            <MenuItem value={"California"}>California</MenuItem>


          </Select>
        </FormControl>
      </Box>
      < div >

{filter===null?
null:
<Stack direction="row" spacing={1}>
        <Chip label={filter} onDelete={handleDelete} />
      </Stack>

}

    </div >

    </div>
  )
}

export default FilterPanel;