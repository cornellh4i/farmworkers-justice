import { useState } from "react";
import Homepage from './components/Homepage/Homepage'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Minipage from './components/Minipage/Minipage'
import AdminLanding from './components/AdminLanding/AdminLanding'
import AdminUploadPortal from './components/AdminUploadPortal/AdminUploadPortal';

export const LATEST_ODD_YEAR = 2017;
export const LATEST_EVEN_YEAR = 2018;


function App() {
  const [token, setToken] = useState("");

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
    </div>
  );
}

export default App;