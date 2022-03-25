import { useParams } from 'react-router-dom';
import React, { ComponentProps } from 'react';
import { Input } from 'reactstrap'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API;
// const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_PASSWORD = "password";
var attemptsLeft = 3;

//https://reactjs.org/docs/forms.html 
function AdminLanding() {
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const navigate = useNavigate();

  function checkPassword(inputPassword: string) {
    return inputPassword === ADMIN_PASSWORD
  }

  async function handleSubmit(event: any) {
    console.log("password submitted: ", password)
    console.log(ADMIN_PASSWORD)
    const haveAccess = checkPassword(password)
    console.log("have access: ", haveAccess)
    if (haveAccess){
    navigate(`/adminUpload`);
    }
    else{
      setWarning("Warning wrong password, " + attemptsLeft + " attempts left.");
      attemptsLeft--;
    }
    if (attemptsLeft < 0){
      navigate(`/`);
    }
  }

  function handleChange(event: any) {
    setPassword(event.target.value)
    console.log("handle change set password: ", event.target.value)
  }
  return (
    <div>
    <form >
      <label>
        password:
        <input type="password" value={password} name="password" placeholder="Enter password" onChange={handleChange} />
      </label>
      <input type="button" value="Submit" onClick={handleSubmit} />
    </form>
    {warning}
    </div>
  

  )
}
export default AdminLanding