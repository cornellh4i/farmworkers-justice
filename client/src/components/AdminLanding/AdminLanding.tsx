import { useParams } from 'react-router-dom';
import React, { ComponentProps } from 'react';
import { Input } from 'reactstrap'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';

interface AdminLandingProps {
  setToken: Function
}

const API_URL = process.env.REACT_APP_API;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
//const ADMIN_PASSWORD = "password";
var attemptsLeft = 3;

//https://reactjs.org/docs/forms.html 
function AdminLanding(props: AdminLandingProps) {
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const navigate = useNavigate();

  async function handleKeypress(event: any) {
    if (event.keyCode === 13) {
      event.preventDefault();
      console.log("enter pressed")
      handleSubmit(event)
    }
  }
  async function handleSubmit(event: any) {
    console.log("password submitted: ", password)
    //`${API_URL}/admin`
    const haveAccess = await fetch(`${API_URL}/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password })
    });
    const resp = await haveAccess.json();
    console.log("resp have acces: ", resp.haveAccess);
    console.group("respond token:", resp.token )
    if (resp.haveAccess) {
      props.setToken(resp.token);
      navigate(`/adminUpload`);
    }
    else {
      setWarning("Warning wrong password, " + attemptsLeft + " attempts left.");
      attemptsLeft--;
    }
    if (attemptsLeft < 0) {
      navigate(`/`);
    }
  }

  function handleChange(event: any) {
    setPassword(event.target.value)
    console.log("handle change set password: ", event.target.value)
  }
  return (
    <div className="adminLandingContainer">
      <form>
        <h2 className="adminLandingContent">
          <label>
            <Grid container direction="column" alignItems="center"
              justifyContent="center" style={{ minHeight: '100vh' }}>
              <Grid item xs={6}>
                PASSWORD:
              </Grid>
              <Grid item xs={6}>
                <input type="password" value={password} name="password" placeholder="Enter password" onChange={handleChange} onKeyPress={handleKeypress} />
              </Grid>
              <Grid item xs={6}>
                <input type="button" value="Submit" onClick={handleSubmit} />
              </Grid>
            </Grid>

          </label>

        </h2>
      </form>
    </div>

  )
}
export default AdminLanding