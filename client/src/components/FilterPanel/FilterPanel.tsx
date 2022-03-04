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


  const handleGenderChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    DeletableChips();
    setGender(event.target.value);


  };
  const handleCurrStatChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setCurrStat(event.target.value);
  };
  const handleFlcChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setFlc(event.target.value);
  };
  const handleRegion6Change = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setRegion6(event.target.value);
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
            <MenuItem value={"m"}>Male</MenuItem>
            <MenuItem value={"f"}>Female</MenuItem>
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
            <MenuItem value={0}>Citizen</MenuItem>
            <MenuItem value={1}>Green Card</MenuItem>
            <MenuItem value={2}>Other Work Authorization</MenuItem>
            <MenuItem value={3}>Unauthorized</MenuItem>

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
            <MenuItem value={0}>Other</MenuItem>
            <MenuItem value={1}>Farm-labor Contractor</MenuItem>

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

            <MenuItem value={1}>East</MenuItem>
            <MenuItem value={2}>South East</MenuItem>
            <MenuItem value={3}>Midwest</MenuItem>
            <MenuItem value={4}>South West</MenuItem>
            <MenuItem value={5}>North West</MenuItem>
            <MenuItem value={6}>California</MenuItem>


          </Select>
        </FormControl>
      </Box>








    </div>
  )
}

function DeletableChips() {
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };


  return (


    < div >
      <Stack direction="row" spacing={1}>
        <Chip label="Deletable" onDelete={handleDelete} />
        <Chip label="Deletable" variant="outlined" onDelete={handleDelete} />
      </Stack>
    </div >);

}

export default FilterPanel;