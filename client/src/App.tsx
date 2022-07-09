import { useState, useMemo } from "react";
import Homepage from './components/Homepage/Homepage'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Minipage from './components/Minipage/Minipage'
import AdminLanding from './components/AdminLanding/AdminLanding'
import AdminUploadPortal from './components/AdminUploadPortal/AdminUploadPortal';
import Crontab from 'reactjs-crontab'

export const LATEST_ODD_YEAR = 2017;
export const LATEST_EVEN_YEAR = 2018;


function App() {
  const [token, setToken] = useState("");
  const cronTasks = useMemo(
    () => [
      {
        fn: () => fetch(`/`)
          .then(res => console.log(`response-ok: ${res.ok}, status: ${res.status}`))
          .catch(err => console.log(err)),
        config: '*/20 * * * *' // this runs every 20 minutes to prevent heroku dyno from sleeping
      }
    ],
    []
  )

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/visualizations/:categoryEncoding" element={<Minipage />} />
          <Route path="/admin" element={<AdminLanding setToken={setToken} />} />
          <Route path="/adminUpload" element={<AdminUploadPortal token={token} />} />
        </Routes>
      </BrowserRouter>
      <Crontab
        tasks={cronTasks}
        timeZone='UTC'
        dashboard={{
          hidden: false, // if true, dashboard is hidden
          route: '/cron' // dashboard will only appear in '/' route
        }}
      />
    </div>
  );
}

export default App;