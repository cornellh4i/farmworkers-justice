import { useState } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';


//handlechange: disable
//handeldelete: enable

function FilterPanel() {
  const [gender, setGender] = React.useState('');
  const [currstat, setCurrStat] = React.useState('');
  const [flc, setFlc] = React.useState('');
  const [region6, setRegion6] = React.useState('');

  const [filter1, setFilter1] = React.useState<null | string[]>(null);
  const [filter2, setFilter2] = React.useState<null | string[]>(null);

  const handleGenderChange = (event: { target: { value: string; }; }) => {
    console.log(event.target.value);
    setGender(event.target.value);
    if(filter1 === null) {
      setFilter1([event.target.value, "gender"]);
    } else if (filter2 === null && filter1[1] != "gender") {
      setFilter2([event.target.value, "gender"]);
    }
    
  };
  const handleCurrStatChange = (event: { target: { value: string; }; }) => {
    setCurrStat(event.target.value);
    if(filter1 === null) {
      setFilter1([event.target.value, "currstat"]);
    } else if (filter2 === null && filter1[1] != "currstat") {
      setFilter2([event.target.value, "currstat"]);
    }
  };
  const handleFlcChange = (event: { target: { value: string; }; }) => {
    setFlc(event.target.value);
    if(filter1 === null) {
      setFilter1([event.target.value, "flc"]);
    } else if (filter2 === null && filter1[1] != "flc") {
      setFilter2([event.target.value, "flc"]);
    }
  };
  const handleRegion6Change = (event: { target: { value: string; }; }) => {
    setRegion6(event.target.value);
    if(filter1 === null) {
      setFilter1([event.target.value, "region6"]);
    } else if (filter2 === null && filter1[1] != "region6") {
      setFilter2([event.target.value, "region6"]);
    }
  };

    function handleDelete1(){
      if(filter1![1] === "gender"){
        setGender('');
      }
      else if(filter1![1] === "currstat"){
        setCurrStat('');
      }
      else if(filter1![1] === "flc"){
        setFlc('');
      }
      else{
        setRegion6('');
      }

      if(filter2 !== null){
        setFilter1(filter2);
        setFilter2(null);
      }
      else{
        setFilter1(null);
      }


      
    };

    function handleDelete2(){
      if(filter2![1] === "gender"){
        setGender('');
      }
      else if(filter2![1] === "currstat"){
        setCurrStat('');
      }
      else if(filter2![1] === "flc"){
        setFlc('');
      }
      else{
        setRegion6('');
      }
      setFilter2(null);

      
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

{filter1===null?
null:
<Stack direction="row" spacing={1}>
        <Chip label={filter1[0]} onDelete={handleDelete1} />
      </Stack>
}

{filter2===null?
null:
<Stack direction="row" spacing={1}>
        <Chip label={filter2[0]} onDelete={handleDelete2} />
      </Stack>
}
    </div >

    </div>
  )
}

export default FilterPanel;