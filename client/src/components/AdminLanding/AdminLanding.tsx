import { useParams } from 'react-router-dom';
import React, { ComponentProps } from 'react';
import { Input } from 'reactstrap'
import { useState } from "react";

//https://reactjs.org/docs/forms.html 
function AdminLanding() {
  const [getPassword, setPassword] = useState<"">("");

  function handleSubmit(event: any) {
    // pass value to back end through fetch 
    setPassword(event.value)
    console.log(getPassword)

  }
  function handleChange(event: any) {
    setPassword(event.value)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        password:
        <input type="text" value={getPassword} name="password" onChange={handleChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>

  )
}
export default AdminLanding