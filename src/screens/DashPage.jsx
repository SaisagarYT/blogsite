import { useNavigate } from "react-router-dom";

const DashPage = () => {
  const navigate = useNavigate();

  // Example: Add logic here to check authentication if needed

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard!</h1>
        <p className="mb-6">You have successfully logged in or registered.</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default DashPage;
