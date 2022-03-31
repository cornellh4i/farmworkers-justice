import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import './AdminLanding.scss'

interface AdminLandingProps {
  setToken: Function
}

const API_URL = process.env.REACT_APP_API;

function AdminLanding(props: AdminLandingProps) {
  const [password, setPassword] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(3)
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Attempts left: ", attemptsLeft)
  })

  async function handleKeypress(event: any) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
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
    if (resp.haveAccess) {
      props.setToken(resp.token);
      navigate(`/adminUpload`);
    }
    else {
      if (attemptsLeft - 1 == 0) {
        navigate(`/`);
      }
      setAttemptsLeft(attemptsLeft - 1);
      setPassword("")
    }
  }

  function handleChange(event: any) {
    setPassword(event.target.value)
  }
  return (
    <div className="adminLandingContainer">
      <Stack>
        <form className="adminLandingContent">
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
        </form>
        {attemptsLeft == 3 ?  null : <p className="warning">Warning wrong password: {attemptsLeft} attempts left.</p>}
      </Stack>
    </div>
  )
}
export default AdminLanding