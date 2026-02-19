import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import VercelSpeedInsights from "./components/VercelSpeedInsights";
import Authentication from "./screens/Authentication";
import DashPage from "./screens/DashPage";
import Homepage from "./screens/Homepage";
import Login from "./screens/Login";

const App = () => {
  useEffect(() => {
    // On mount, set theme from localStorage
    const color = localStorage.getItem("color") || "dark";
    document.documentElement.setAttribute("theme", color);
  }, []);

  return (
    <div className="w-screen overflow-x-hidden h-screen bg-(--bg-background) text-(--text-main)">
      {/* <div className='w-full py-2'>
        <h1 className='text-center'>Subscribe to our Newsletter For New & latest Blogs and Resources</h1>
      </div> */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashPage />} />
      </Routes>
      <VercelSpeedInsights />
    </div>
  );
};

export default App;
