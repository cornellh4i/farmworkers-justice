import { useParams } from 'react-router-dom';
import React, { ComponentProps } from 'react';
import { Input } from 'reactstrap'
import { useState } from "react";

const API_URL = process.env.REACT_APP_API;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

//https://reactjs.org/docs/forms.html 
function AdminLanding() {
  const [password, setPassword] = useState("");

  function checkPassword(inputPassword: string) {
    return inputPassword === ADMIN_PASSWORD
  }

  async function handleSubmit(event: any) {
    console.log("password submitted: ", password)
    const haveAccess = checkPassword(password)
    console.log("have access: ", haveAccess)
    // BASED ON WHETHER PASSWORD IS CORRECT, 
    // IF CORRECT -> ROUTE TO ADMIN UPLOAD (ANOTHER COMPONENT)
    // IF INCORRECT -> PUT A WARNING
  }

  function handleChange(event: any) {
    setPassword(event.target.value)
    console.log("handle change set password: ", event.target.value)
  }
  return (
    <form >
      <label>
        password:
        <input type="password" value={password} name="password" placeholder="Enter password" onChange={handleChange} />
      </label>
      <input type="button" value="Submit" onClick={handleSubmit}  />
    </form>

  )
}
export default AdminLanding