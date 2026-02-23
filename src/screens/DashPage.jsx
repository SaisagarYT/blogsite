import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashPage = () => {
  const navigate = useNavigate();


  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/logout", {}, { withCredentials: true });
    } catch {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard!</h1>
        <p className="mb-6">You have successfully logged in or registered.</p>
        <div className="flex flex-col gap-4 items-center">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate("/")}> 
            Go to Home
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashPage;
