import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import VercelSpeedInsights from "./components/VercelSpeedInsights";
import ProtectedRoute from "./components/ProtectedRoute";
import Authentication from "./screens/Authentication";
import DashPage from "./screens/DashPage";
import Homepage from "./screens/Homepage";
import TechNews from "./screens/TechNews";
import BlogDetail from "./screens/BlogDetail";
import AdminDashboard from "./frontend/admin/pages/AdminDashboard";
import InstructorDashboard from "./screens/InstructorDashboard";
import InstructorCourses from "./screens/InstructorCourses";
import InstructorCreateCourse from "./screens/InstructorCreateCourse";
import InstructorCourseBuilder from "./screens/InstructorCourseBuilder";
import InstructorLessonBuilder from "./screens/InstructorLessonBuilder";

import Login from "./screens/Login";
import OtpVerification from "./screens/OtpVerification";
import ForgotPassword from "./screens/ForgotPassword";

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
        <Route path="/news" element={<TechNews/>} />
        <Route path="/blog/:slug" element={<BlogDetail/>} />
        <Route path="/auth" element={<Authentication/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashPage /></ProtectedRoute>} />
        <Route path="/instructor/dashboard" element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
        <Route path="/instructor/courses" element={<ProtectedRoute><InstructorCourses /></ProtectedRoute>} />
        <Route path="/instructor/courses/create" element={<ProtectedRoute><InstructorCreateCourse /></ProtectedRoute>} />
        <Route path="/instructor/courses/builder" element={<ProtectedRoute><InstructorCourseBuilder /></ProtectedRoute>} />
        <Route path="/instructor/lessons/builder" element={<ProtectedRoute><InstructorLessonBuilder /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
      </Routes>
      <VercelSpeedInsights />
    </div>
  );
};

export default App;
